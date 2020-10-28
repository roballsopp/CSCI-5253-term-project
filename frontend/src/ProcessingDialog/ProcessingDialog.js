import * as React from 'react';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { styled, makeStyles } from '@material-ui/styles';
import { useAudioFile } from '../audio-file-context';
import { useTransients } from '../transients-context';
import UploadProgress, {
	UPLOAD_STATE_COMPLETED,
	UPLOAD_STATE_PROCESSING,
	UPLOAD_STATE_UPLOADING,
	UPLOAD_STATE_FAILED,
} from './upload-progress.component';
import useApi from './useApi';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

const useStyles = makeStyles((theme) => ({
	info: {
		paddingBottom: theme.spacing(2),
	},
}));

ProcessingDialog.propTypes = {
	open: PropTypes.bool,
	onRequestClose: PropTypes.func.isRequired,
};

export default function ProcessingDialog({ open, onRequestClose }) {
	const { setTransients } = useTransients();
	const { audioFile } = useAudioFile();
	const classes = useStyles();
	const [extracting, setExtracting] = React.useState(false);
	const [progressBytes, setProgressBytes] = React.useState(0);
	const [totalBytes, setTotalBytes] = React.useState(0);
	const [uploadState, setUploadState] = React.useState();

	const { getUploadUrl, uploadFile, beginProcessingJob, pollProcessingJob, getTransientsByJobId } = useApi();

	const handleProcessAudio = async (e) => {
		setExtracting(true);
		try {
			setUploadState(UPLOAD_STATE_UPLOADING);
			const { filename, url } = await getUploadUrl();

			await uploadFile(audioFile, url, (e) => {
				setProgressBytes(e.loaded);
				setTotalBytes(e.total);
			});

			setUploadState(UPLOAD_STATE_PROCESSING);
			const { job } = await beginProcessingJob(filename);

			await pollProcessingJob(job.id, 2000);

			const results = await getTransientsByJobId(job.id);

			setUploadState(UPLOAD_STATE_COMPLETED);

			if (!results || !results.length) {
				throw new Error('Unable to find any transients.');
			}

			setTransients(results);
			onRequestClose(e);
		} catch (err) {
			setUploadState(UPLOAD_STATE_FAILED);
			console.error(err);
		}

		setExtracting(false);
	};

	return (
		<Dialog
			disableBackdropClick
			disableEscapeKeyDown
			maxWidth="sm"
			fullWidth
			open={open}
			onClose={onRequestClose}
			aria-labelledby="find-transients-title">
			<Title id="find-transients-title" disableTypography>
				<Typography variant="h6">find Audio Transients</Typography>
				<IconButton aria-label="Close" edge="end" onClick={onRequestClose}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<div className={classes.info}>
					<Typography>Options might go here.</Typography>
				</div>
				{extracting && (
					<UploadProgress progressBytes={progressBytes} totalBytes={totalBytes} uploadState={uploadState} />
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onRequestClose} color="primary">
					Cancel
				</Button>
				<Button onClick={handleProcessAudio} color="primary" variant="contained" disabled={extracting}>
					Find Transients
				</Button>
			</DialogActions>
		</Dialog>
	);
}
