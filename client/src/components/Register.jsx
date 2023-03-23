import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

const coverImg = '/images/reg_page_img.webp';
const uploadPlaceholder = '/images/upload_placeholder.webp';

const CREATE_USER_QUERY = gql`
  mutation createUser($data: UserCreateInput!) {
    createUser(data: $data) {
      email
      name
    }
  }
`;

const Register = () => {
  const [selectedImg, setSelectedImg] = useState(undefined);
  const [uploadPreview, setUploadPriview] =
    useState(uploadPlaceholder);
  const navigate = useNavigate();

  // Register query
  const [reqCreateUser, { data, loading, error }] =
    useMutation(CREATE_USER_QUERY);

  useEffect(() => {
    if (!selectedImg) return;

    console.log(selectedImg);
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

    reqCreateUser({
      variables: {
        data: {
          name,
          email,
          password,
          image: {
            upload: selectedImg,
          },
        },
      },
      onCompleted: () => {
        // try to impliment login

        navigate('/login');
      },

      onError: (err) => {
        console.log(err);
      },
    });
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
                required
              />
            </label>
          </div>
          <button type="submit" className="w-auto">
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
