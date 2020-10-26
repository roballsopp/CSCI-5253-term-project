const { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');

module.exports.ProcessingJobType = new GraphQLObjectType({
	name: 'ProcessingJob',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLID) },
		fileKey: { type: GraphQLNonNull(GraphQLString) },
		createdAt: { type: GraphQLNonNull(GraphQLDateTime) },
		state: {
			type: GraphQLNonNull(GraphQLString),
			description: 'Can be either `queued`, `running`, `success`, or `error`',
		},
	}),
});
