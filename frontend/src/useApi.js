import * as React from 'react';
import { useApolloClient, gql } from '@apollo/client';

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
	};
}
