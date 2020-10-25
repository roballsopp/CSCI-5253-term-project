module.exports = function createProcessingJobModel({ sequelize, processingQueue }) {
	const processingJobsTable = sequelize.model('processingJobs');

	async function findById(id) {
		return processingJobsTable.findOne({ where: { id } });
	}

	async function findPending(userId, operationId) {
		return processingJobsTable.findOne({ where: { userId, operationId, state: 'pending' } });
	}

	async function initJob(fileKey) {
		const job = await processingJobsTable.create({
			state: 'queued',
			fileKey,
		});

		processingQueue.send({ jobId: job.id });

		return job;
	}

	return { findById, findPending, initJob };
};
