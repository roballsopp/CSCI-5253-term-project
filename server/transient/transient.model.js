module.exports = function createTransientModel({ sequelize }) {
	const transientsTable = sequelize.model('transients');

	async function findByJobId(jobId) {
		return transientsTable.findAll({ where: { jobId } });
	}

	return { findByJobId };
};
