const { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const { ProcessingJobType } = require('./processing-job');
const { TransientType } = require('./transient/transient.graphql');

module.exports = new GraphQLObjectType({
	name: 'RootQuery',
	fields: () => ({
		processingJob: {
			type: GraphQLNonNull(ProcessingJobType),
			args: {
				jobId: {
					type: GraphQLNonNull(GraphQLString),
					description: 'The job id for the processing job',
				},
			},
			resolve: (_, args, ctx) => {
				const { jobId } = args;
				return ctx.models.processingJob.findById(jobId);
			},
		},
		transients: {
			type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TransientType))),
			args: {
				jobId: {
					type: GraphQLNonNull(GraphQLString),
					description: 'The job id for the processing job',
				},
			},
			resolve: (_, args, ctx) => {
				const { jobId } = args;
				return ctx.models.transient.findByJobId(jobId);
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
