import pika
import os
import sys

RABBITMQ_USER = os.getenv('RABBITMQ_USER')
RABBITMQ_PWD = os.getenv('RABBITMQ_PWD')
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST')
RABBITMQ_PORT = os.getenv('RABBITMQ_PORT')
WORK_QUEUE = os.getenv('WORK_QUEUE')
PG_DATABASE = os.getenv('PG_DATABASE')
PG_USER = os.getenv('PG_USER')
PG_PWD = os.getenv('PG_PWD')
PG_HOST = os.getenv('PG_HOST')
AUDIO_BUCKET = os.getenv('AUDIO_BUCKET')


def callback(ch, method, properties, body):
	print(" [x] Received %r" % body)
	# acknowledge message only once processing completes successfully
	ch.basic_ack(delivery_tag=method.delivery_tag)

def main():
	credentials = pika.credentials.PlainCredentials(RABBITMQ_USER, RABBITMQ_PWD)
	conn_params = pika.ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT, credentials=credentials)
	connection = pika.BlockingConnection(conn_params)
	channel = connection.channel()
	# tell rabbit to send only one message at a time.
	#    wait til a worker has acknowledged its message in progress to start it again
	channel.basic_qos(prefetch_count=1)
	# durable options tells rabbitmq to persist queue to disk so its there even if rabbitmq restarts
	channel.queue_declare(queue=WORK_QUEUE, durable=True)
	channel.basic_consume(queue=WORK_QUEUE, on_message_callback=callback)
	print('Waiting for messages')
	channel.start_consuming()

if __name__ == '__main__':
	try:
		main()
	except KeyboardInterrupt:
		print('Interrupted')
		try:
			sys.exit(0)
		except SystemExit:
			os._exit(0)
	except Exception as e:
		print(e)
