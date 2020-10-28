import React from 'react';
import PropTypes from 'prop-types';

const TransientsContext = React.createContext({
	transients: [],
	setTransients: () => {},
});

TransientsProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function TransientsProvider({ children }) {
	const [transients, setTransients] = React.useState([]);

	return (
		<TransientsContext.Provider
			value={{
				transients,
				setTransients,
			}}>
			{children}
		</TransientsContext.Provider>
	);
}

export function useTransients() {
	return React.useContext(TransientsContext);
}
