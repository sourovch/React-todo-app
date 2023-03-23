import React, { useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../context/authContext';

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

const coverImg = `/images/login_page_img.webp`;

const Login = () => {
  const [reqLogin, { loading, error }] = useMutation(LOGIN_MUTATION);

  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    document.title = 'Login';

    return () => (document.title = '');
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target['email'].value;
    const password = e.target['password'].value;

    reqLogin({
      variables: {
        email,
        password,
      },
      onCompleted: ({ authenticateUserWithPassword: authData }) => {
        if (
          authData.__typename ===
          'UserAuthenticationWithPasswordFailure'
        ) {
          // setError
          console.log(authData.message);
        } else if (
          authData.__typename ===
          'UserAuthenticationWithPasswordSuccess'
        ) {
          localStorage.setItem('token', authData.sessionToken);
          setIsLoggedIn(true);
          // setUserData
        }
      },
    });
  };

  return (
    <>
      <div>
        <hgroup>
          <h1>ToDos</h1>
          <h2>An awesome way to manage your daily doings</h2>
        </hgroup>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">
            <input
              type="text"
              id="email"
              name="name"
              placeholder="Enter email"
              required
            />
          </label>
          <label htmlFor="password">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </label>
          <button aria-busy={loading} type="submit">
            Login
          </button>
        </form>
        <Link to={'/register'}>
          <small>New? Register</small>
        </Link>
      </div>
      <div
        style={{
          backgroundImage: `url(${coverImg})`,
        }}
      ></div>
    </>
  );
};

export default Login;
