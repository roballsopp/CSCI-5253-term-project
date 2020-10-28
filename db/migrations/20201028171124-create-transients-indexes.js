module.exports = {
	up: (queryInterface) => {
		return queryInterface.sequelize.query(`CREATE INDEX transients_job_id_idx ON transients (job_id);`);
	},
	down: (queryInterface) => {
		return queryInterface.sequelize.query(`DROP INDEX transients_job_id_idx;`);
	},
};
