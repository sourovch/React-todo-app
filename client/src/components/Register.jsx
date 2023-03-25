import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import useLogin from '../hooks/useLogin';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup';
import YupPassword from 'yup-password';

import { ERROR_TOAST_OPTIONS } from '../utils/tostOptions';
import { CREATE_USER_QUERY } from '../utils/gqlQuerys';
YupPassword(yup);

const coverImg = '/images/reg_page_img.webp';
const uploadPlaceholder = '/images/upload_placeholder.webp';

const Register = () => {
  const [reqCreateUser, { loading: regLoad }] =
    useMutation(CREATE_USER_QUERY);
  const { loading: loginLoad, login } = useLogin();
  const [uploadPreview, setUploadPriview] =
    useState(uploadPlaceholder);
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      conformation: '',
      selectedImg: undefined,
    },
    onSubmit({ name, email, password, selectedImg }) {
      let qureyData = {
        name,
        email,
        password,
      };

      if (selectedImg) {
        qureyData = {
          ...qureyData,
          image: {
            upload: selectedImg,
          },
        };
      }

      reqCreateUser({
        variables: {
          data: qureyData,
        },
        onCompleted: ({ createUser: user }) => {
          login(user.email, password);
        },

        onError: (err) => {
          toast.error(err.message, ERROR_TOAST_OPTIONS);
        },
      });
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .min(3, "Name can't be that small")
        .max(20, 'To large for a name')
        .required('Please enter your name'),
      email: yup
        .string()
        .email('Invalid email')
        .required('Please enter your email'),
      password: yup
        .string()
        .min(8, 'Password must contain 8+ characters')
        .minLowercase(
          1,
          'Password must contain at least 1 lower case letter'
        )
        .minUppercase(
          1,
          'Password must contain at least 1 upper case letter'
        )
        .minNumbers(1, 'Password must contain at least 1 number')
        .minSymbols(
          1,
          'Password must contain at least 1 special character'
        )
        .required('Password Is required'),
      conformation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm'),
    }),
  });

  useEffect(() => {
    if (!formik.values.selectedImg) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setUploadPriview(reader.result);
    };

    reader.readAsDataURL(formik.values.selectedImg);
  }, [formik.values.selectedImg]);

  useEffect(() => {
    document.title = 'Register';

    return () => (document.title = '');
  }, []);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0)
      return formik.setFieldValue('selectedImg', undefined);

    formik.setFieldValue('selectedImg', e.target.files[0]);
  };

  return (
    <>
      <div>
        <hgroup>
          <h1>Welcome to ToDos</h1>
          <h2>Start tracking your daily doings</h2>
        </hgroup>
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          <label htmlFor="display_image">
            Set display image
            <div className="upload_preview_wrapper">
              <img src={uploadPreview} alt="" />
              <input
                type="file"
                id="display_image"
                name="display_image"
                accept="image/jpeg, image/jpg, image/png, image/webp"
                onChange={onSelectFile}
              />
            </div>
          </label>
          <label
            htmlFor="name"
            aria-invalid={formik.touched.name && !!formik.errors.name}
          >
            {formik.touched.name && formik.errors.name
              ? formik.errors.name
              : 'Name'}
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={
                formik.touched.name && !!formik.errors.name
              }
            />
          </label>
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
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={
                formik.touched.email && !!formik.errors.email
              }
            />
          </label>
          <div className="grid">
            <label
              htmlFor="password"
              aria-invalid={
                formik.touched.password && !!formik.errors.password
              }
            >
              Password
              <input
                type="password"
                id="password"
                name="password"
                placeholder="New password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={
                  formik.touched.password && !!formik.errors.password
                }
              />
              <small>
                {formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : '*write a strong password for account safty'}
              </small>
            </label>
            <label
              htmlFor="conformation"
              aria-invalid={
                formik.touched.conformation &&
                !!formik.errors.conformation
              }
            >
              {formik.touched.conformation &&
              formik.errors.conformation
                ? formik.errors.conformation
                : 'Confirm password'}
              <input
                type="password"
                id="conformation"
                name="conformation"
                placeholder="Confirm password"
                value={formik.values.conformation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={
                  formik.touched.conformation &&
                  !!formik.errors.conformation
                }
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-auto"
            aria-busy={loginLoad || regLoad}
            disabled={loginLoad || regLoad}
          >
            Create your account
          </button>
        </form>
        <Link to={'/login'}>
          <small>Already registerd? Login.</small>
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

export default Register;
