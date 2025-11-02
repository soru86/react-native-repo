import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';
import { getApiUrl } from '../utils/getApiUrl';

const API_URL = getApiUrl();

console.log('🔗 Apollo Client configured with API URL:', API_URL);

const httpLink = createHttpLink({
  uri: API_URL,
  // Add fetch options for better error handling
  fetchOptions: {
    timeout: 30000, // 30 second timeout
  },
});

const authLink = setContext(async (_, { headers }) => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error getting auth token:', error);
    return {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    };
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;


