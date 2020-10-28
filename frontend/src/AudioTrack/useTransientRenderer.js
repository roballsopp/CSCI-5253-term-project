import React from 'react';
import { useTransients } from '../transients-context';

export default function useTransientRenderer(wavesurfer) {
	const { transients } = useTransients();

	React.useEffect(() => {
		if (!wavesurfer) return;

		const canvas = wavesurfer.drawer.canvases[0].wave;
		const ctx = wavesurfer.drawer.canvases[0].waveCtx;
		const width = canvas.width;
		const height = canvas.height;
		const duration = wavesurfer.getDuration();
		const pxDelta = width / duration;

		ctx.fillStyle = 'rgba(225,0,0,0.7)';

		transients.forEach(({ time }) => {
			const px = time * pxDelta;
			ctx.fillRect(px, 0, 2, height);
		});
	}, [wavesurfer, transients]);
}
