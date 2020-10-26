import React from 'react';
import Button from '@material-ui/core/Button';
import useApi from './useApi';
import useFileSelector from './useFileSelector';

export default function App() {
	const { getUploadUrl, uploadFile, beginProcessingJob } = useApi();

	const handleFileSelected = React.useCallback(
		async (e) => {
			const file = e.target.files[0];
			try {
				const { url, filename } = await getUploadUrl();
				await uploadFile(file, url);
				const resp = await beginProcessingJob(filename);
				console.log("HI", resp);
			} catch (err) {
				console.error(err);
			}
		},
		[getUploadUrl, uploadFile, beginProcessingJob]
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
