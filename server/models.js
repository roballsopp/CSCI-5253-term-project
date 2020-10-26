const createGCPModel = require('./gcp.model');
const createProcessingJobModel = require('./processing-job/processing-job.model');

module.exports = ({ sequelize, processingQueue, storageClient }) => {
	const gcp = createGCPModel({ storageClient });
	const processingJob = createProcessingJobModel({ sequelize, processingQueue });
	return { gcp, processingJob };
};
