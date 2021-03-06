import pika
import os
import sys
import traceback
import json
from db import Connection
import gcp
from Wave import Wave
import processor
import logging

logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logger = logging.getLogger(__name__)


RABBITMQ_USER = os.getenv('RABBITMQ_USER')
RABBITMQ_PWD = os.getenv('RABBITMQ_PWD')
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST')
RABBITMQ_PORT = os.getenv('RABBITMQ_PORT')
WORK_QUEUE = os.getenv('WORK_QUEUE')
PG_DATABASE = os.getenv('PG_DATABASE')
PG_USER = os.getenv('PG_USER')
PG_PWD = os.getenv('PG_PWD')
PG_HOST = os.getenv('PG_HOST')


pika_creds = pika.credentials.PlainCredentials(RABBITMQ_USER, RABBITMQ_PWD)
pika_params = pika.ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT, credentials=pika_creds)

def process(job_id):
	with Connection() as pg_conn:
		res = pg_conn.find_job(job_id)

		if res['rowcount'] != 1:
			raise Exception(f'Could not find job {job_id}')

		job, = res['rows']

		if job['state'] != 'queued':
			raise Exception(f"Expected job state 'queued', found '{job['state']}'. Skipping message.")

		try:
			logger.info('Retrieving audio...')
			audio_bytes = gcp.get_blob(job['file_key'])
			pg_conn.begin_processing(job_id)
			logger.info('Finding transients...')
			transients = processor.get_transients(Wave.from_bytes(audio_bytes))
			logger.info('Saving...')
			pg_conn.finish_processing(job_id, transients)
			logger.info('Done.')
		except Exception as e:
			pg_conn.fail_processing(job_id)
			raise e


def handle_message(ch, method, properties, body):
	logger.info('Received message')
	try:
		message = json.loads(body.decode())

		if 'jobId' not in message:
			raise Exception('Message missing required field `jobId`')

		logger.info(f"Processing job {message['jobId']}")
		process(message['jobId'])

		# acknowledge message only once processing completes successfully
		ch.basic_ack(delivery_tag=method.delivery_tag)
	except Exception as e:
		logger.error(str(e))
		traceback.print_exc()

def handle_conn_blocked(connection, thing):
	logger.error('Connection blocked!', thing)

def handle_conn_unblocked(connection, thing):
	logger.info('Connection un-blocked', thing)


def main():
	pika_conn = pika.BlockingConnection(pika_params)
	pika_conn.add_on_connection_blocked_callback(handle_conn_blocked)
	pika_conn.add_on_connection_unblocked_callback(handle_conn_unblocked)
	channel = pika_conn.channel()
	# tell rabbit to send only one message at a time.
	#    wait til a worker has acknowledged its message in progress to start it again
	channel.basic_qos(prefetch_count=1)
	# durable options tells rabbitmq to persist queue to disk so its there even if rabbitmq restarts
	channel.queue_declare(queue=WORK_QUEUE, durable=True)
	channel.basic_consume(queue=WORK_QUEUE, on_message_callback=handle_message)
	logger.info(f'Waiting for messages on queue "{WORK_QUEUE}"')
	channel.start_consuming()

if __name__ == '__main__':
	logger.info('Starting worker...')
	try:
		main()
	except KeyboardInterrupt:
		logger.info('Interrupted')
		try:
			sys.exit(0)
		except SystemExit:
			os._exit(0)
	except:
		traceback.print_exc()
