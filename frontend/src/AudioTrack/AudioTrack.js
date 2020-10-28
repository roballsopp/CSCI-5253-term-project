import * as React from 'react';
import * as WaveSurfer from '../../node_modules/wavesurfer.js/dist/wavesurfer';
import muiBlues from '@material-ui/core/colors/blue';
import { makeStyles } from '@material-ui/styles';
import { useAudioFile } from '../audio-file-context';
import useTransientRenderer from './useTransientRenderer';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		height: '100%',
		justifyContent: 'center',
		flexDirection: 'column',
	},
});

export default function AudioTrack() {
	const [waveformRef, setWaveformRef] = React.useState();
	const [wavesurfer, setWavesurfer] = React.useState();
	const { audioFile } = useAudioFile();
	const classes = useStyles();

	useTransientRenderer(wavesurfer);

	React.useEffect(() => {
		if (!waveformRef) return;

		const surfer = WaveSurfer.create({
			container: waveformRef,
			waveColor: muiBlues[400],
			height: 400,
		});

		setWavesurfer(surfer);

		return () => {
			surfer.destroy();
		};
	}, [waveformRef]);

	React.useEffect(() => {
		if (audioFile && wavesurfer) wavesurfer.loadBlob(audioFile);
	}, [audioFile, wavesurfer]);

	return <div ref={setWaveformRef} className={classes.root} />;
}
