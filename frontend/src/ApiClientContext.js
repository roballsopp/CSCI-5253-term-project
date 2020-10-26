import React from 'react';
import PropTypes from 'prop-types';
import { ApiUrl } from './config';
import { ApiClient } from '../../proto/api_grpc_web_pb';
import { UploadUrlReq } from '../../proto/api_pb';

const ApiClientContext = React.createContext({
	apiClient: {},
	getUploadUrl: () => {},
});

ApiClientProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function ApiClientProvider({ children }) {
	const clientRef = React.useRef(new ApiClient(ApiUrl, null, null));

	const getUploadUrl = React.useCallback(() => {
		return new Promise((resolve, reject) => {
			clientRef.current.getUploadUrl(new UploadUrlReq(), (err, resp) => {
				if (err) return reject(err);
				resolve({
					url: resp.getUrl(),
					filename: resp.getFilename(),
				});
			});
		});
	}, []);

	return (
		<ApiClientContext.Provider value={{ apiClient: clientRef.current, getUploadUrl }}>
			{children}
		</ApiClientContext.Provider>
	);
}

export function useApiClient() {
	return React.useContext(ApiClientContext);
}
