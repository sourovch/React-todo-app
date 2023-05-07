import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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

  const themeData = useMemo(() => ({theme, setTheme}), [theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [debaunceValue]);

  return (
    <themeContext.Provider value={themeData}>
      {children}
    </themeContext.Provider>
  );
}

export default ThemeProvider;
