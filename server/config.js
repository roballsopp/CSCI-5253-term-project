const AUDIO_BUCKET = process.env.AUDIO_BUCKET;
const RABBITMQ_HOST = process.env.RABBITMQ_HOST;
const WORK_QUEUE = process.env.WORK_QUEUE;
const RABBITMQ_USER = encodeURIComponent(process.env.RABBITMQ_USER);
const RABBITMQ_PWD = encodeURIComponent(process.env.RABBITMQ_PWD);
const RABBITMQ_PORT = process.env.RABBITMQ_PORT;
const PG_DATABASE = process.env.PG_DATABASE;
const PG_USER = process.env.PG_USER;
const PG_PWD = process.env.PG_PWD;
const PG_HOST = process.env.PG_HOST;
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const REQUEST_LOGGING = process.env.REQUEST_LOGGING === 'true';

module.exports = {
	AUDIO_BUCKET,
	RABBITMQ_HOST,
	WORK_QUEUE,
	RABBITMQ_USER,
	RABBITMQ_PWD,
	RABBITMQ_PORT,
	PG_DATABASE,
	PG_USER,
	PG_PWD,
	PG_HOST,
	PORT,
	CORS_ORIGIN,
	REQUEST_LOGGING,
};
