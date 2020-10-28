const { GraphQLObjectType, GraphQLNonNull, GraphQLFloat, GraphQLInt } = require('graphql');

module.exports.TransientType = new GraphQLObjectType({
	name: 'Transient',
	fields: () => ({
		sample: { type: GraphQLNonNull(GraphQLInt) },
		time: { type: GraphQLNonNull(GraphQLFloat) },
	}),
});
