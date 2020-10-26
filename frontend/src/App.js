import React from 'react';
import Button from '@material-ui/core/Button';
import { useApiClient } from './ApiClientContext';
import useFileSelector from './useFileSelector';

export default function App() {
	const { getUploadUrl } = useApiClient();

	const handleFileSelected = React.useCallback(
		(e) => {
			getUploadUrl()
				.then(({ url }) => {
					return uploadFile(e.target.files[0], url);
				})
				.catch((err) => console.error(err));
		},
		[getUploadUrl]
	);

	const openFileSelector = useFileSelector({ accept: '.wav', onFilesSelected: handleFileSelected });

	return (
		<div>
			<Button variant="contained" color="primary" onClick={openFileSelector}>
				Select File
			</Button>
		</div>
	);
}

async function uploadFile(file, url, onProgress) {
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
}
