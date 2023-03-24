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
import 'react-toastify/dist/ReactToastify.css';

import App from './App.jsx';
import StartPage from './components/StartPage';
import Login from './components/Login';
import Register from './components/Register';
import client from './utils/apolloClinet';
import AuthProvider, { useAuth } from './context/authContext';
import ThemeProvider, { useTheme } from './context/themeContex';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));

const Protected = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to="/login" />;
};

const Toast = () => {
  const [theme] = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme}
    />
  );
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
  <ThemeProvider>
    <ApolloProvider client={client}>
      <AuthProvider>
        <Toast />
        <RouterProvider router={router} />
      </AuthProvider>
    </ApolloProvider>
  </ThemeProvider>
);
