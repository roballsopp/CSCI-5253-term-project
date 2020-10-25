const amqp = require('amqplib/callback_api');
const { RABBITMQ_HOST, AUDIO_QUEUE, RABBITMQ_USER, RABBITMQ_PWD, RABBITMQ_PORT } = require('./config');

const CONNECTION_STR = `amqp://${RABBITMQ_USER}:${RABBITMQ_PWD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

module.exports = { connect, getQueue };

function connect() {
	return new Promise((resolve, reject) => {
		amqp.connect(CONNECTION_STR, function (err, connection) {
			if (err) return reject(err);
			resolve(connection);
		});
	});
}

function getQueue(connection) {
	return new Promise((resolve, reject) => {
		connection.createChannel(function (err, channel) {
			if (err) return reject(err);

			// ensure the queue is there
			channel.assertQueue(AUDIO_QUEUE, {
				durable: true, // persist queue to disk so its there even if rabbitmq restarts
			});

			resolve({
				send: (msg) => {
					channel.sendToQueue(AUDIO_QUEUE, Buffer.from(JSON.stringify(msg)), { persistent: true });
				},
			});
		});
	});
}
