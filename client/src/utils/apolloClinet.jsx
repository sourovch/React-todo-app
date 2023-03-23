import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  concat,
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || null,
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(
    authMiddleware,
    createUploadLink({
      uri: 'http://localhost:3001/api/graphql',
      headers: {
        'Apollo-Require-Preflight': 'true',
      },
    })
  ),
});

export default client;
