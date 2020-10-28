import React from 'react';
import Button from '@material-ui/core/Button';
import { useAudioFile } from './audio-file-context';
import useFileSelector from './useFileSelector';
import ProcessingDialog from './ProcessingDialog';

export default function App() {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const { setAudioFile } = useAudioFile();

	const handleFileSelected = React.useCallback(
		async (e) => {
			setAudioFile(e.target.files[0]);
		},
		[setAudioFile]
	);

	const handleDialogOpen = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const handleProcessingComplete = (results) => {
		console.log('DONE!', results);
	};

	const openFileSelector = useFileSelector({ accept: '.wav', onFilesSelected: handleFileSelected });

	return (
		<React.Fragment>
			<div>
				<Button variant="contained" color="primary" onClick={openFileSelector}>
					Select File
				</Button>
				<Button variant="contained" color="secondary" onClick={handleDialogOpen}>
					Find Transients
				</Button>
			</div>
			<ProcessingDialog open={dialogOpen} onRequestClose={handleDialogClose} onComplete={handleProcessingComplete} />
		</React.Fragment>
	);
}
