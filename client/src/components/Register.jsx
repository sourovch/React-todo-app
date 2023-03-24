import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import useLogin from '../hooks/useLogin';
import { toast } from 'react-toastify';

import { ERROR_TOAST_OPTIONS } from '../utils/tostOptions';
import { CREATE_USER_QUERY } from '../utils/gqlQuerys';

const coverImg = '/images/reg_page_img.webp';
const uploadPlaceholder = '/images/upload_placeholder.webp';

const Register = () => {
  const { loading: loginLoad, login } = useLogin();
  const [selectedImg, setSelectedImg] = useState(undefined);
  const [uploadPreview, setUploadPriview] =
    useState(uploadPlaceholder);
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: '',
    conformation: '',
  });
  const [reqCreateUser, { loading: regLoad }] =
    useMutation(CREATE_USER_QUERY);

  useEffect(() => {
    if (!selectedImg) return;

    const objectUrl = URL.createObjectURL(selectedImg);
    setUploadPriview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImg]);

  useEffect(() => {
    document.title = 'Register';

    return () => (document.title = '');
  }, []);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0)
      return setSelectedImg(undefined);

    setSelectedImg(e.target.files[0]);
  };

  const fromSubmitHandler = (e) => {
    e.preventDefault();

    const name = e.target['name'].value;
    const email = e.target['email'].value;
    const password = e.target['password'].value;

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
  };

  const handleInputChange = (e) => {
    const element = e.target;

    setFormValue((v) => ({ ...v, [element.name]: element.value }));
  };

  return (
    <>
      <div>
        <hgroup>
          <h1>Welcome to ToDos</h1>
          <h2>Start tracking your daily doings</h2>
        </hgroup>
        <form autoComplete="off" onSubmit={fromSubmitHandler}>
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
          <label htmlFor="name">
            Name
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formValue.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label htmlFor="email">
            Email
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              value={formValue.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <div className="grid">
            <label htmlFor="password">
              Password
              <input
                type="password"
                id="password"
                name="password"
                placeholder="New password"
                value={formValue.password}
                onChange={handleInputChange}
                required
              />
            </label>
            <label htmlFor="conformation">
              Confirm password
              <input
                type="password"
                id="conformation"
                name="conformation"
                placeholder="Confirm password"
                value={formValue.conformation}
                onChange={handleInputChange}
                required
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
