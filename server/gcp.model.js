const moment = require('moment');
const { AUDIO_BUCKET } = require('./config');

module.exports = function createGCPModel({ storageClient }) {
	const audioBucket = storageClient.bucket(AUDIO_BUCKET);

	return {
		getSignedUrl,
	};

	async function getSignedUrl(filename) {
		const file = audioBucket.file(filename);

		const [url] = await file.getSignedUrl({
			action: 'write',
			version: 'v4',
			expires: moment().add(10, 'minutes').toISOString(),
		});

		return url;
	}
};
