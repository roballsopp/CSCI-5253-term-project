const { ProcessingJobType } = require('./processing-job.graphql');
const ProcessingMutations = require('./processing-job-mutations.graphql');
const createProcessingJobModel = require('./processing-job.model');

module.exports = { ProcessingJobType, createProcessingJobModel, ProcessingMutations };
