import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { ApiUrl } from './config';

const httpLink = createHttpLink({
	uri: `${ApiUrl}/graphql`,
});

export default new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache({
		typePolicies: {
			User: {
				keyFields: ['id'],
			},
		},
	}),
	queryDeduplication: false,
});
