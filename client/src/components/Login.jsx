import React, { useEffect} from 'react';
import { Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import { useFormik } from 'formik';
import * as yup from 'yup';

const coverImg = `/images/login_page_img.webp`;

const Login = () => {
  const { loading, login } = useLogin();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit(values) {
      login(values.email, values.password);
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email('Invalid email')
        .required('Email is required'),
      password: yup
        .string()
        .min(8, 'Invalid password')
        .required('Password is required'),
    }),
  });

  useEffect(() => {
    document.title = 'Login';

    return () => (document.title = '');
  }, []);

  return (
    <>
      <div>
        <hgroup>
          <h1>ToDos</h1>
          <h2>An awesome way to manage your daily doings</h2>
        </hgroup>
        <form onSubmit={formik.handleSubmit}>
          <label
            htmlFor="email"
            aria-invalid={
              formik.touched.email && !!formik.errors.email
            }
          >
            {formik.touched.email && formik.errors.email
              ? formik.errors.email
              : 'Email'}
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={
                formik.touched.email && !!formik.errors.email
              }
            />
          </label>
          <label
            htmlFor="password"
            aria-invalid={
              formik.touched.password && !!formik.errors.password
            }
          >
            {formik.touched.password && formik.errors.password
              ? formik.errors.password
              : 'Password'}
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={
                formik.touched.password && !!formik.errors.password
              }
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
