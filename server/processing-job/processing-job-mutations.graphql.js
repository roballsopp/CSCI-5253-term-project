const { GraphQLNonNull, GraphQLObjectType, GraphQLString } = require('graphql');
const { ProcessingJobType } = require('./processing-job.graphql');

module.exports = {
	beginProcessingJob: {
		type: GraphQLNonNull(
			new GraphQLObjectType({
				name: 'BeginProcessingJobResponse',
				fields: () => ({
					job: { type: GraphQLNonNull(ProcessingJobType) },
				}),
			})
		),
		description: 'Returns a processing job object with a speech to text operation id',
		args: {
			filename: {
				type: GraphQLNonNull(GraphQLString),
				description: 'The name/key of the audio file in the cloud storage bucket to begin processing.',
			},
		},
		resolve: async (_, args, ctx) => {
			const { filename } = args;
			const job = await ctx.models.processingJob.initJob(filename);
			return { job };
		},
	},
};
