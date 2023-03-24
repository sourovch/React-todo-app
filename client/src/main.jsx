import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './utils/apolloClinet';

import './styles/pico.min.css';
import './styles/modify.css';
import 'react-toastify/dist/ReactToastify.css';

import App from './App.jsx';
import StartPage from './components/StartPage';
import Login from './components/Login';
import Register from './components/Register';
import Protected from './components/Protected';
import Toast from './components/Toast';

import AuthProvider from './context/authContext';
import ThemeProvider from './context/themeContex';

const root = ReactDOM.createRoot(document.getElementById('root'));

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
  <ThemeProvider>
    <ApolloProvider client={client}>
      <AuthProvider>
        <Toast />
        <RouterProvider router={router} />
      </AuthProvider>
    </ApolloProvider>
  </ThemeProvider>
);
