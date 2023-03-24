import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';

const coverImg = `/images/login_page_img.webp`;

const Login = () => {
  const { loading, login } = useLogin();
  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    document.title = 'Login';

    return () => (document.title = '');
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    login(formValue.email, formValue.password);
  };

  const handleInputChange = (e) => {
    const element = e.target;

    setFormValue((v) => ({ ...v, [element.name]: element.value }));
  };

  return (
    <>
      <div>
        <hgroup>
          <h1>ToDos</h1>
          <h2>An awesome way to manage your daily doings</h2>
        </hgroup>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter email"
              value={formValue.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <label htmlFor="password">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formValue.password}
              onChange={handleInputChange}
              required
            />
          </label>
          <button
            aria-busy={loading}
            type="submit"
            disabled={loading}
          >
            Login
          </button>
        </form>
        <Link to={'/register'}>
          <small>New? Register</small>
        </Link>
      </div>
      <div
        style={{
          backgroundImage: `url(${coverImg})`,
        }}
      ></div>
    </>
  );
};

export default Login;
