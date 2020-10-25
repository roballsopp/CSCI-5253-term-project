const { Sequelize } = require('sequelize');

class ProcessingJob extends Sequelize.Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					type: Sequelize.UUID,
					allowNull: false,
					primaryKey: true,
					defaultValue: sequelize.literal('uuid_generate_v4()'),
				},
				state: { type: Sequelize.STRING, allowNull: false, defaultValue: 'queued' },
				fileKey: { type: Sequelize.STRING, allowNull: false },
			},
			{
				sequelize,
				modelName: 'processingJobs',
				tableName: 'processing_jobs',
				underscored: true,
			}
		);
	}
}

module.exports = ProcessingJob;
