const amqp = require('amqplib');
const { RABBITMQ_HOST, WORK_QUEUE, RABBITMQ_USER, RABBITMQ_PWD, RABBITMQ_PORT } = require('./config');

const CONNECTION_STR = `amqp://${RABBITMQ_USER}:${RABBITMQ_PWD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

module.exports = { connect, getQueue };

function connect() {
	console.log(`Connecting to rabbitmq broker at ${RABBITMQ_HOST}...`);
	return amqp.connect(CONNECTION_STR);
}

async function getQueue(connection) {
	const channel = await connection.createChannel();
	// ensure the queue is there
	await channel.assertQueue(WORK_QUEUE, {
		durable: true, // persist queue to disk so its there even if rabbitmq restarts
	});

	channel.on('error', (err) => {
		console.error(err);
	});

	channel.on('blocked', (reason) => {
		console.error('Channel blocked', reason);
	});

	channel.on('unblocked', () => {
		console.log('Channel unblocked');
	});

	return {
		send: (msg) => {
			return channel.sendToQueue(WORK_QUEUE, Buffer.from(JSON.stringify(msg)), { persistent: true });
		},
	};
}
