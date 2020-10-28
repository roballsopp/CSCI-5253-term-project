import * as React from 'react';
import * as WaveSurfer from 'wavesurfer.js';
import muiPinks from '@material-ui/core/colors/pink';
import { makeStyles } from '@material-ui/styles';
import { useAudioFile } from './audio-file-context';

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

	React.useEffect(() => {
		if (!waveformRef) return;

		const surfer = WaveSurfer.create({
			container: waveformRef,
			waveColor: muiPinks[400],
			interact: false,
			cursorWidth: 0,
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
