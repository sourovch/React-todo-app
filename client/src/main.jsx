import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import './styles/pico.min.css';
import './styles/modify.css';

import App from './App.jsx';
import StartPage from './components/StartPage';
import Login from './components/Login';
import Register from './components/Register';
import client from './utils/apolloClinet';
import AuthProvider, { useAuth } from './context/authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

const Protected = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Protected>
        <App />
      </Protected>
    ),
  },
  {
    path: '/login',
    element: (
      <StartPage>
        <Login />
      </StartPage>
    ),
  },
  {
    path: '/register',
    element: (
      <StartPage>
        <Register />
      </StartPage>
    ),
  },
]);

root.render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ApolloProvider>
);
