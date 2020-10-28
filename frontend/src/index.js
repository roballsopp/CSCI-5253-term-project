import * as React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './ApolloClient';
import theme from './mui-theme';
import App from './App';
import { AudioFileProvider } from './audio-file-context';

function AppWrapper() {
	return (
		<ApolloProvider client={apolloClient}>
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				<AudioFileProvider>
					<App />
				</AudioFileProvider>
			</MuiThemeProvider>
		</ApolloProvider>
	);
}

const root = document.getElementById('react-root');
if (!root) throw new Error('Could not find react dom root');
ReactDOM.render(<AppWrapper />, root);
