import { gql, useQuery } from '@apollo/client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

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
    onCompleted: (data) => {
      if (!data.authenticatedItem) {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        // setError
        console.log('somthing is wrong: authContext');
        return;
      }
      setIsLoggedIn(true);
      // setUserData
    },
  });

  if (error) {
    // setError
    console.log(error);
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
