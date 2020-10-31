import numpy as np
import wave
import logging
from io import BytesIO

BYTE_DEPTH_TO_TYPE = {
	1: np.int8,
	2: np.int16
}

class Wave:
	def __init__(self, data, sample_rate=44100):
		self._data = data.astype(np.float32)
		self._sample_rate = sample_rate

	def get_data(self):
		return self._data

	def get_chan(self, chan):
		return self._data[chan]

	@property
	def num_chan(self):
		return len(self._data)

	@property
	def sample_rate(self):
		return self._sample_rate

	def to_file(self, filepath, bit_depth=16):
		float_to_int = (2 ** (bit_depth - 1)) - 1
		data_int = np.rint(self._data * float_to_int).astype(np.int16)

		data_cont = np.ascontiguousarray(data_int.T)

		with wave.open(filepath, mode='wb') as file:
			file.setnchannels(len(self._data))
			file.setsampwidth(int(bit_depth / 8))
			file.setframerate(self._sample_rate)
			file.writeframesraw(data_cont.data)

	@staticmethod
	def from_bytes(audio_bytes):
		logging.info('Loading wav from bytes')

		with wave.open(BytesIO(audio_bytes), mode='rb') as file:
			sample_rate = file.getframerate()
			byte_depth = file.getsampwidth()
			bit_depth = byte_depth * 8
			num_channels = file.getnchannels()
			num_samples = file.getnframes()

			logging.info('Sample Rate: ' + str(sample_rate))
			logging.info('Bit Depth: ' + str(bit_depth))
			logging.info('Channels: ' + str(num_channels))
			logging.info('Num Samples: ' + str(num_samples))

			buf = file.readframes(num_samples)

		dt = np.dtype(BYTE_DEPTH_TO_TYPE[byte_depth])
		dt = dt.newbyteorder('L')

		data = np.frombuffer(buf, dtype=dt)
		# buffer comes out in channels-last order
		data.shape = (num_samples, num_channels)

		# data.T to make it return data in channels-first order
		return Wave(data.T / (2 ** (bit_depth - 1)), sample_rate)