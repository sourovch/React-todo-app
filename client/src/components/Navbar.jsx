import {
  BsFillLightbulbFill,
  BsFillLightbulbOffFill,
} from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/themeContex';

const Navbar = () => {
  const [theme, setTheme] = useTheme();

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
