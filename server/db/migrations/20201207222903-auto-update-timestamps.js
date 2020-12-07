module.exports = {
	up: async (queryInterface) => {
		await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
         NEW.updated_at = now(); 
         RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

		await queryInterface.sequelize.query(`
      CREATE TRIGGER update_jobs_timestamp BEFORE UPDATE
      ON processing_jobs FOR EACH ROW EXECUTE PROCEDURE 
      update_timestamp();
    `);
	},
	down: async (queryInterface) => {
		await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS update_jobs_timestamp ON processing_jobs;`);
		await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS update_timestamp;`);
	},
};
