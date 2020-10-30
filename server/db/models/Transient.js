const { Sequelize } = require('sequelize');

class Transient extends Sequelize.Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					type: Sequelize.UUID,
					allowNull: false,
					primaryKey: true,
					defaultValue: sequelize.literal('uuid_generate_v4()'),
				},
				jobId: { type: Sequelize.UUID, allowNull: false },
				sample: { type: Sequelize.INTEGER, allowNull: false },
				time: { type: Sequelize.FLOAT, allowNull: false },
			},
			{
				sequelize,
				modelName: 'transients',
				tableName: 'transients',
				underscored: true,
			}
		);
	}
}

module.exports = Transient;
