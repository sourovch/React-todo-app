import { gql, useQuery } from '@apollo/client';
import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { ERROR_TOAST_OPTIONS } from '../utils/tostOptions';

const authContext = createContext();

const TOKEN_VALIDATE_QUERY = gql`
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

export const useAuth = () => {
  const { userData, setUserData, isLoggedIn, setIsLoggedIn } =
    useContext(authContext);

  return {
    userData,
    setUserData,
    isLoggedIn,
    setIsLoggedIn,
  };
};

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState();
  const { loading, error } = useQuery(TOKEN_VALIDATE_QUERY, {
    onCompleted: ({ authenticatedItem }) => {
      if (!authenticatedItem) {
        setIsLoggedIn(false);
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
          toast.warning(
            'Previous login expired',
            ERROR_TOAST_OPTIONS
          );
        }
        return;
      }
      setIsLoggedIn(true);
      setUserData(authenticatedItem);
    },
  });

  if (error) {
    toast.error(error.message, ERROR_TOAST_OPTIONS);
  }

  if (loading)
    return (
      <div className="load-container h-100" aria-busy={true}></div>
    );

  return (
    <authContext.Provider
      value={{ userData, setUserData, isLoggedIn, setIsLoggedIn }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
