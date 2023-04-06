import React from 'react';
import { useMutation, gql } from '@apollo/client';
import useAuth from './useAuth';
import { toast } from 'react-toastify';

import { ERROR_TOAST_OPTIONS } from '../utils/tostOptions';
import { SUCCESS_TOAST_OPTIONS } from '../utils/tostOptions';
import { LOGIN_MUTATION } from '../utils/gqlQuerys';

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
          toast.error(
            <small>incorrect Email or Password</small>,
            ERROR_TOAST_OPTIONS
          );
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
