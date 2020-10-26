const { GraphQLSchema } = require('graphql');
const { Storage } = require('@google-cloud/storage');
const { createServer } = require('./express');
const createModels = require('./models');
const RabbitMQ = require('./rabbitmq');
const { PG_DATABASE, PG_USER, PG_PWD, PG_HOST, PORT } = require('./config');
const gqlQueries = require('./root-query.graphql');
const gqlMutations = require('./root-mutaton.graphql');
const connectToDb = require('../db');

const graphqlSchema = new GraphQLSchema({ query: gqlQueries, mutation: gqlMutations });

Promise.all([
	connectToDb({ database: PG_DATABASE, user: PG_USER, password: PG_PWD, host: PG_HOST, logging: false }),
	RabbitMQ.connect().then(getRabbitQueue),
])
	.then(([sequelize, processingQueue]) => {
		const storageClient = new Storage();
		const models = createModels({ sequelize, processingQueue, storageClient });
		const app = createServer(graphqlSchema, models);
		// eslint-disable-next-line no-console
		app.listen(process.env.PORT, () => console.log(`Listening on port ${PORT}`));
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
