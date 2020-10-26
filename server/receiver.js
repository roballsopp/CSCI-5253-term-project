const amqp = require('amqplib/callback_api');
const RABBITMQ_HOST = process.env.RABBITMQ_HOST;
const RABBITMQ_USER = process.env.RABBITMQ_USER;
const RABBITMQ_PWD = process.env.RABBITMQ_PWD;
const RABBITMQ_PORT = process.env.PORT;

const CONNECTION_STR = `amqp://${encodeURIComponent(RABBITMQ_USER)}:${encodeURIComponent(
	RABBITMQ_PWD
)}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

amqp.connect(CONNECTION_STR, function (err, connection) {
	if (err) return console.error(err);

	connection.createChannel(function (err, channel) {
		if (err) return console.error(err);

		const queue = 'hello';

		// tell rabbit to send only one message at a time.
		//   wait til a worker has acknowledged its message in progress to start it again
		channel.prefetch(1);

		channel.assertQueue(queue, {
			durable: true, // persist queue to disk so its there even if rabbitmq restarts
		});

		console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
		channel.consume(
			queue,
			function (msg) {
				console.log(' [x] Received %s', msg.content.toString());
				channel.ack(msg); // acknowledge message only once processing completes successfully
			},
			{
				// false prevents rabbitmq from removing this message from the queue until channel.ack(msg) is called
				noAck: false,
			}
		);
	});
});
