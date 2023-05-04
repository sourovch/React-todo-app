import { useQuery } from "@apollo/client";
import { createContext, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { ERROR_TOAST_OPTIONS } from "../utils/tostOptions";
import { TOKEN_VALIDATE_QUERY } from "../utils/gqlQuerys";

export const authContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState();
  const contextData = useMemo(
    () => ({ isLoggedIn, setIsLoggedIn, userData, setUserData }),
    [isLoggedIn, userData]
  );
  const { loading, error } = useQuery(TOKEN_VALIDATE_QUERY, {
    onCompleted: ({ authenticatedItem }) => {
      if (!authenticatedItem) {
        setIsLoggedIn(false);
        if (localStorage.getItem("token")) {
          localStorage.removeItem("token");
          toast.warning("Previous login expired", ERROR_TOAST_OPTIONS);
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
    return <div className="load-container h-100" aria-busy={true}></div>;

  return (
    <authContext.Provider value={contextData}>{children}</authContext.Provider>
  );
};

export default AuthProvider;
