const createGCPModel = require('./gcp.model');
const { createProcessingJobModel } = require('./processing-job');
const { createTransientModel } = require('./transient');

module.exports = ({ sequelize, processingQueue, storageClient }) => {
	const gcp = createGCPModel({ storageClient });
	const processingJob = createProcessingJobModel({ sequelize, processingQueue });
	const transient = createTransientModel({ sequelize });
	return { gcp, processingJob, transient };
};
