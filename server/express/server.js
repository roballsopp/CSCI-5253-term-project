const express = require('express');
const cors = require('cors');
const errorHandler = require('./error-handler');
const requestLogger = require('./request-logger');
const createGraphqlApp = require('./graphql-app');
const { REQUEST_LOGGING, CORS_ORIGIN } = require('../config');

module.exports = function createServer(graphqlSchema, models) {
	const app = express();

	app.use(cors());
	app.use(express.json());
	if (REQUEST_LOGGING) app.use(requestLogger);
	app.get('/health', (req, res) => res.status(200).json({ status: 'Ok' }));
	app.use(createGraphqlApp(graphqlSchema, models));
	app.use(errorHandler);

	return app;
};
