import { gql } from '@apollo/client';

export const CREATE_USER_QUERY = gql`
  mutation createUser($data: UserCreateInput!) {
    createUser(data: $data) {
      email
      name
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
          name
          image {
            url
          }
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;

export const TOKEN_VALIDATE_QUERY = gql`
  query AuthenticatedItem {
    authenticatedItem {
      ... on User {
        name
        image {
          url
        }
        id
      }
    }
  }
`;
