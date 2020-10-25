const { UploadUrlRes, CreateProcessingRes, GetProcessingRes } = require('../proto/api_pb');

module.exports = function createApiService({ gcp, processingJob }) {
	return {
		getUploadUrl,
		createProcessingJob,
		getProcessingJob,
	};

	async function getUploadUrl(call, callback) {
		try {
			const filename = `${new Date().getTime()}`;
			const url = await gcp.getSignedUrl(filename);
			const resp = new UploadUrlRes();
			resp.setUrl(url);
			resp.setFilename(filename);
			callback(null, resp);
		} catch (e) {
			callback(e);
		}
	}

	async function createProcessingJob(call, callback) {
		try {
			const job = await processingJob.initJob(call.request.getFilename());
			const resp = new CreateProcessingRes();
			resp.setJob(job);
			callback(null, resp);
		} catch (e) {
			callback(e);
		}
	}

	async function getProcessingJob(call, callback) {
		try {
			const job = await processingJob.findById(call.request.getJobid());
			const resp = new GetProcessingRes();
			resp.setJob(job);
			callback(null, resp);
		} catch (e) {
			callback(e);
		}
	}
};
