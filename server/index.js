const grpc = require('grpc');
const { Storage } = require('@google-cloud/storage');
const createApiService = require('./ApiService');
const createModels = require('./models');
const RabbitMQ = require('./rabbitmq');
const { PG_DATABASE, PG_USER, PG_PWD, PG_HOST, GRPC_PORT } = require('./config');
const connectToDb = require('../db');
const { ApiService: GRPCApiService } = require('../proto/api_grpc_pb');

Promise.all([
	connectToDb({ database: PG_DATABASE, user: PG_USER, password: PG_PWD, host: PG_HOST, logging: false }),
	RabbitMQ.connect().then(getRabbitQueue),
])
	.then(([sequelize, processingQueue]) => {
		const storageClient = new Storage();
		const models = createModels({ sequelize, processingQueue, storageClient });
		const server = new grpc.Server();
		server.addService(GRPCApiService, createApiService(models));
		server.bind(`0.0.0.0:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure());
		server.start();
		console.log(`Server listening on ${GRPC_PORT}`);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});

function getRabbitQueue(connection) {
	process.on('beforeExit', () => {
		connection.close();
	});
	return RabbitMQ.getQueue(connection);
}
