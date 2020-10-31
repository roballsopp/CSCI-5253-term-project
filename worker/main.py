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

logging.basicConfig(stream=sys.stdout, format='{"severity":"%(levelname)s","message":"%(message)s"}', level=logging.INFO)


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
			audio_bytes = gcp.get_blob(job['file_key'])
			pg_conn.begin_processing(job_id)
			transients = processor.get_transients(Wave.from_bytes(audio_bytes))
			logging.info('Saving...')
			pg_conn.finish_processing(job_id, transients)
		except Exception as e:
			pg_conn.fail_processing(job_id)
			raise e


def callback(ch, method, properties, body):
	message = json.loads(body.decode())

	if 'jobId' not in message:
		raise Exception('Message missing required field `jobId`')

	try:
		process(message['jobId'])
	except Exception as e:
		traceback.print_exc()

	# acknowledge message only once processing completes successfully
	ch.basic_ack(delivery_tag=method.delivery_tag)

def main():
	pika_conn = pika.BlockingConnection(pika_params)
	channel = pika_conn.channel()
	# tell rabbit to send only one message at a time.
	#    wait til a worker has acknowledged its message in progress to start it again
	channel.basic_qos(prefetch_count=1)
	# durable options tells rabbitmq to persist queue to disk so its there even if rabbitmq restarts
	channel.queue_declare(queue=WORK_QUEUE, durable=True)
	channel.basic_consume(queue=WORK_QUEUE, on_message_callback=callback)
	logging.info('Waiting for messages')
	channel.start_consuming()

if __name__ == '__main__':
	logging.info('Starting worker...')
	try:
		main()
	except KeyboardInterrupt:
		logging.info('Interrupted')
		try:
			sys.exit(0)
		except SystemExit:
			os._exit(0)
	except Exception as e:
		print(e)
