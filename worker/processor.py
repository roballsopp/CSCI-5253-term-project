import numpy as np
import functools

# the size of the moving average filter in seconds of audio
LOBE_SIZE_SEC = 40 / 1000

def get_transients(wav):
	print('Processing...')
	lobe_size = round(wav.sample_rate * LOBE_SIZE_SEC)
	rectified = np.abs(wav.get_data())
	chan_sum = np.sum(rectified, axis=0)
	out = np.convolve(chan_sum, diff_kernel(lobe_size), mode='valid')
	# smoothing
	likelihood = np.convolve(out, np.ones((lobe_size,)), mode='same')
	# peak finding
	peaks = np.convolve(likelihood, [-1, 1], mode='same')
	peaks = (peaks > 0).astype(np.float)
	peaks = np.convolve(peaks, [1, -1], mode='same')
	peaks = (peaks > 0).astype(np.float)
	out = np.multiply(likelihood, peaks)
	# normalize
	out = out / np.amax(out)
	# filter out low likelihood
	out = out > 0.1
	return [{ 'sample': i, 'time': i / wav.sample_rate } for i in range(out.size) if out[i]]


# generates a kernel like [-1, -2, -3, 3, 2, 1]. sharpness controls how sharp the peak is
# sharpness of 2.0 will make a kernel like [-1, -4, -9, 9, 4, 1]
# sharpness of 0.0 (default) makes it flat [-1, -1, -1, 1, 1, 1]
def diff_kernel(lobe_size, sharpness=0.0, dtype=np.float):
	positive_lobe = np.arange(lobe_size, 0, -1, dtype=dtype)
	positive_lobe = np.power(positive_lobe, sharpness)
	negative_lobe = np.flip(positive_lobe) * -1
	return np.concatenate([negative_lobe, positive_lobe])
