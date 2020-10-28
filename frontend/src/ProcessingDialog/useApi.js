import * as React from 'react';
import { useApolloClient, gql } from '@apollo/client';
import { JobTimeout } from '../config';

export default function useApi() {
	const apolloClient = useApolloClient();

	return {
		getUploadUrl: React.useCallback(async () => {
			const {
				data: { uploadUrl },
			} = await apolloClient.query({
				fetchPolicy: 'network-only',
				query: gql`
					query getUploadUrl {
						uploadUrl {
							filename
							url
						}
					}
				`,
			});
			return uploadUrl;
		}, [apolloClient]),
		uploadFile: React.useCallback(async (file, url, onProgress) => {
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();

				if (onProgress) xhr.upload.addEventListener('progress', onProgress);

				xhr.upload.addEventListener('error', () => {
					reject(new Error('Upload errored'));
				});
				xhr.upload.addEventListener('abort', () => reject(new Error('Upload aborted.')));
				xhr.addEventListener('load', () => {
					if (xhr.status >= 400) {
						return reject(new Error(`${xhr.status} - Upload failed. ${xhr.responseText}. ${xhr.response}`));
					}
					resolve();
				});

				xhr.open('PUT', url);
				xhr.send(file);
			});
		}, []),
		beginProcessingJob: React.useCallback(
			async (filename) => {
				const {
					data: { beginProcessingJob },
				} = await apolloClient.mutate({
					mutation: gql`
						mutation beginProcessingJob($filename: String!) {
							beginProcessingJob(filename: $filename) {
								job {
									id
									state
								}
							}
						}
					`,
					variables: { filename },
				});
				return beginProcessingJob;
			},
			[apolloClient]
		),
		pollProcessingJob: (jobId, interval = 1000, timeout = JobTimeout) => {
			return new Promise((resolve, reject) => {
				const intervalId = setInterval(async () => {
					apolloClient
						.query({
							fetchPolicy: 'network-only',
							query: gql`
								query getProcessingJob($jobId: String!) {
									processingJob(jobId: $jobId) {
										id
										state
									}
								}
							`,
							variables: { jobId },
						})
						.then(({ data: { processingJob } }) => {
							if (processingJob.state === 'success') {
								clearInterval(intervalId);
								resolve(processingJob);
							} else if (processingJob.state === 'error') {
								clearInterval(intervalId);
								reject(new Error('Job failed'));
							}
						})
						.catch((err) => {
							clearInterval(intervalId);
							if (err.networkError) {
								if (err.networkError.result) {
									return reject(new Error(err.networkError.result.errors[0].message));
								}
								return reject(err.networkError);
							}
							reject(err);
						});
				}, interval);

				setTimeout(() => {
					clearInterval(intervalId);
					reject(new Error('Poll timeout exceeded.'));
				}, timeout);
			});
		},
		getTransientsByJobId: React.useCallback(
			async (jobId) => {
				const {
					data: { transients },
				} = await apolloClient.query({
					fetchPolicy: 'network-only',
					query: gql`
						query getTransients($jobId: String!) {
							transients(jobId: $jobId) {
								time
							}
						}
					`,
					variables: { jobId },
				});
				return transients;
			},
			[apolloClient]
		),
	};
}
