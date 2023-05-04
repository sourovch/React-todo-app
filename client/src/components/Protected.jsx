import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Protected = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default Protected;
