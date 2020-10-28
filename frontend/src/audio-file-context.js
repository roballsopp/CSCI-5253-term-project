import * as React from 'react';
import * as PropTypes from 'prop-types';

const AudioFileContext = React.createContext({
	audioFile: null,
	setAudioFile: () => {},
});

AudioFileProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function AudioFileProvider({ children }) {
	const [audioFile, setAudioFile] = React.useState(null);

	return (
		<AudioFileContext.Provider
			value={{
				audioFile,
				setAudioFile,
			}}>
			{children}
		</AudioFileContext.Provider>
	);
}

export function useAudioFile() {
	return React.useContext(AudioFileContext);
}
