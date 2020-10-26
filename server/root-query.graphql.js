const { GraphQLNonNull, GraphQLObjectType, GraphQLString } = require('graphql');
const { ProcessingJobType } = require('./processing-job');

module.exports = new GraphQLObjectType({
	name: 'RootQuery',
	fields: () => ({
		processingJob: {
			type: GraphQLNonNull(ProcessingJobType),
			args: {
				jobId: {
					type: GraphQLNonNull(GraphQLString),
					description: 'The operation id for the speech to text operation',
				},
			},
			resolve: (_, args, ctx) => {
				const { jobId } = args;
				return ctx.models.processingJob.findById(jobId);
			},
		},
		uploadUrl: {
			type: GraphQLNonNull(UploadUrlType),
			resolve: async (_, args, ctx) => {
				const filename = `${Date.now()}`;
				const url = await ctx.models.gcp.getSignedUrl(filename);
				return { filename, url };
			},
		},
	}),
});

const UploadUrlType = new GraphQLObjectType({
	name: 'UploadUrl',
	fields: () => ({
		filename: { type: GraphQLNonNull(GraphQLString) },
		url: { type: GraphQLNonNull(GraphQLString) },
	}),
});
