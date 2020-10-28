const { Sequelize } = require('sequelize');
const ProcessingJob = require('./models/ProcessingJob');
const Transient = require('./models/Transient');

module.exports = ({ database, user, password, host, logging = false }) => {
	// TODO: wrap logger
	// eslint-disable-next-line no-console
	console.log(
		JSON.stringify({
			severity: 'info',
			message: `Connecting to postgres db "${database}" at ${host}`,
		})
	);

	const sequelize = new Sequelize(database, user, password, {
		host,
		logging,
		dialect: 'postgres',
	});

	ProcessingJob.init(sequelize);
	Transient.init(sequelize);

	return sequelize.authenticate().then(() => sequelize);
};
