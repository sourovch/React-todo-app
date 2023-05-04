import { useContext } from 'react';
import { authContext } from '../context/authContext';

const useAuth = () => {
  const { userData, setUserData, isLoggedIn, setIsLoggedIn } =
    useContext(authContext);

  return {
    userData,
    setUserData,
    isLoggedIn,
    setIsLoggedIn,
  };
};

export default useAuth;
