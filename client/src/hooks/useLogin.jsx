import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';

import { ERROR_TOAST_OPTIONS } from '../utils/tostOptions';
import { SUCCESS_TOAST_OPTIONS } from '../utils/tostOptions';

const LOGIN_MUTATION = gql`
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

function useLogin() {
  const [reqLogin, { loading }] = useMutation(LOGIN_MUTATION);
  const { setIsLoggedIn, setUserData } = useAuth();

  function login(email, password) {
    return reqLogin({
      variables: {
        email,
        password,
      },
      onCompleted: ({ authenticateUserWithPassword: authData }) => {
        if (
          authData.__typename ===
          'UserAuthenticationWithPasswordFailure'
        ) {
          toast.error(authData.message, ERROR_TOAST_OPTIONS);
        } else if (
          authData.__typename ===
          'UserAuthenticationWithPasswordSuccess'
        ) {
          localStorage.setItem('token', authData.sessionToken);
          setIsLoggedIn(true);
          setUserData(authData.item);
          toast.success(
            'Logged In successfully',
            SUCCESS_TOAST_OPTIONS
          );
        }
      },
      onError: (err) => {
        toast.error(
          <small>{err.message}</small>,
          ERROR_TOAST_OPTIONS
        );
      },
    });
  }

  return {
    login,
    loading,
  };
}

export default useLogin;
