import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {
  BsFillLightbulbFill,
  BsFillLightbulbOffFill,
} from 'react-icons/bs';
import { Link } from 'react-router-dom';
import useDebaunce from '../hooks/useDebaunce';

const Navbar = () => {
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

  const themeToggle = (e) => {
    e.preventDefault();

    setTheme((currTheme) =>
      currTheme === 'dark' ? 'light' : 'dark'
    );
  };

  const themeIcons = {
    dark: <BsFillLightbulbOffFill />,
    light: <BsFillLightbulbFill />,
  };

  return (
    <nav className="container-fluid">
      <ul>
        <li>
          <Link to={'/'} className="contrast">
            <strong>Todo</strong>
          </Link>
        </li>
      </ul>
      <ul className="rtl">
        <li onClick={themeToggle} className="contrast c-point">
          {themeIcons[theme]}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
