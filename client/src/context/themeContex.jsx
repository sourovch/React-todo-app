import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import React from 'react';
import useDebaunce from '../hooks/useDebaunce';

// context
const themeContext = createContext();

// useContext hook
export const useTheme = () => {
  const { theme, setTheme } = useContext(themeContext);

  return [theme, setTheme];
};

// context provider
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  );

  const debaunceValue = useDebaunce(theme, 1000);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [debaunceValue]);

  return (
    <themeContext.Provider value={{ theme, setTheme }}>
      {children}
    </themeContext.Provider>
  );
}

export default ThemeProvider;
