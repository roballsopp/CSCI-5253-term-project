import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import { useAudioFile } from './audio-file-context';
import { TransientsProvider } from './transients-context';
import useFileSelector from './useFileSelector';
import ProcessingDialog from './ProcessingDialog';
import AudioTrack from './AudioTrack';

const useStyles = makeStyles((theme) => ({
	audioContainer: {
		backgroundColor: theme.palette.grey[800],
		margin: theme.spacing(1),
		position: 'relative',
		height: 400,
	},
	selectFileButton: {
		position: 'absolute',
		top: 'calc(50% - 18px)',
		left: 'calc(50% - 58px)',
	},
}));

export default function App() {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const { audioFile, setAudioFile } = useAudioFile();
	const classes = useStyles();

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

	const openFileSelector = useFileSelector({ accept: '.wav', onFilesSelected: handleFileSelected });

	return (
		<TransientsProvider>
			<div>
				<div className={classes.audioContainer}>
					<AudioTrack />
					{!audioFile && (
						<Button variant="contained" color="primary" onClick={openFileSelector} className={classes.selectFileButton}>
							Select File
						</Button>
					)}
				</div>
				{audioFile && (
					<Button variant="contained" color="secondary" onClick={handleDialogOpen}>
						Find Transients
					</Button>
				)}
			</div>
			<ProcessingDialog open={dialogOpen} onRequestClose={handleDialogClose} />
		</TransientsProvider>
	);
}
