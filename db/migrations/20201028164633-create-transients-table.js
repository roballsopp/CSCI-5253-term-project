module.exports = {
	up: (queryInterface) => {
		return queryInterface.sequelize.query(`
			CREATE TABLE IF NOT EXISTS transients
			(
				id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
				job_id uuid NOT NULL,
				sample integer NOT NULL,
				time real NOT NULL,
				created_at timestamp with time zone NOT NULL DEFAULT now(),
				updated_at timestamp with time zone NOT NULL DEFAULT now(),
				CONSTRAINT transients_job_id_fkey FOREIGN KEY (job_id)
					REFERENCES processing_jobs (id) MATCH SIMPLE
					ON UPDATE NO ACTION
					ON DELETE NO ACTION
			);
		`);
	},
	down: (queryInterface) => {
		return queryInterface.sequelize.query(`DROP TABLE IF EXISTS transients`);
	},
};
