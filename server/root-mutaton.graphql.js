const { GraphQLObjectType } = require('graphql');
const { ProcessingMutations } = require('./processing-job');

module.exports = new GraphQLObjectType({
	name: 'RootMutation',
	fields: {
		...ProcessingMutations,
	},
});
