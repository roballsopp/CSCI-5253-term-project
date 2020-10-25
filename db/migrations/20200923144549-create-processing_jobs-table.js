module.exports = {
	up: queryInterface => {
		return queryInterface.sequelize.query(`
		  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
		  
			CREATE TABLE IF NOT EXISTS processing_jobs
			(
				id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
				state character varying(255) NOT NULL DEFAULT 'queued',
				file_key character varying(500) NOT NULL UNIQUE,
				created_at timestamp with time zone NOT NULL DEFAULT now(),
				updated_at timestamp with time zone NOT NULL DEFAULT now()
			);
		`);
	},
	down: () => {},
};
