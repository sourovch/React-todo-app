import { HiDotsVertical } from 'react-icons/hi';
import { AiOutlinePlus, AiOutlineCloseCircle } from 'react-icons/ai';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useModal from '../hooks/useModal';
import useAuth from '../hooks/useAuth';
import FolderList from './FolderList';
import { useMutation } from '@apollo/client';
import { CREATE_FOLDER_MUTATION } from '../utils/gqlQuerys';
import { toast } from 'react-toastify';
import { ERROR_TOAST_OPTIONS } from '../utils/tostOptions';

const Aside = forwardRef(
  ({ userData, smallScreen, ...rest }, ref) => {
    const modalRef = useRef();
    const { toggleModal, setModal } = useModal(modalRef.current);
    const { setIsLoggedIn } = useAuth();
    const [refetchFn, setRefetchFn] = useState();
    const [reqCreateFolder, { loading }] = useMutation(
      CREATE_FOLDER_MUTATION
    );
    const formik = useFormik({
      initialValues: {
        name: '',
      },
      validationSchema: yup.object({
        name: yup.string().min(3).required('Name required'),
      }),
      onSubmit({ name }, actions) {
        reqCreateFolder({
          variables: {
            where: {
              id: userData.id,
            },
            data: {
              folders: {
                create: [
                  {
                    name,
                  },
                ],
              },
            },
          },
          onCompleted() {
            refetchFn();
            toggleModal();
            actions.resetForm({
              values: {
                name: '',
              },
            });
            actions.setFieldTouched(name, false);
          },
          onError(err) {
            toast.error(err.message, ERROR_TOAST_OPTIONS);
          },
        });
      },
    });
    const menuRef = useRef();

    useEffect(() => {
      const documentClickHandler = (e) => {
        const menu = menuRef.current;
        const clickedElm = e.target;

        if (clickedElm.parentElement?.isSameNode(menu?.parentElement))
          return;

        if (menu?.classList.contains('active'))
          menu?.classList.remove('active');
      };

      document.addEventListener('click', documentClickHandler);

      setModal(modalRef.current);

      return () =>
        document.removeEventListener('click', documentClickHandler);
    }, []);

    const logOut = () => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    };

    const menuExtend = () => {
      const menu = menuRef.current;

      menu?.classList.toggle('active');
    };

    const closeAside = () => {
      const aside = ref?.current;

      aside?.classList.remove('active');
    };

    const handleCreateBtnClk = () => {
      toggleModal();
      modalRef.current.querySelector("input[type='text']").focus();
    };

    return (
      <>
        <aside
          {...rest}
          ref={ref}
          className={
            smallScreen ? 'small-screen-aside' : 'desktop_aside'
          }
        >
          <div className="userInfo">
            <div className="cover-img">
              <img
                src="\images\cover_index_2.webp"
                alt="cover illastration"
              />
            </div>
            <div className="top-bar">
              <HiDotsVertical
                onClick={menuExtend}
                className="c-point menu-btn"
              />
              {smallScreen ? (
                <AiOutlineCloseCircle
                  className="c-point aside-close-btn"
                  onClick={closeAside}
                />
              ) : (
                ''
              )}
              <ul ref={menuRef}>
                <li onClick={logOut}>Log-Out</li>
                <li>Info</li>
              </ul>
            </div>
            <div className="img-r aside-img">
              <img
                src={
                  userData.image?.url || '/images/dp_placeholder.webp'
                }
                alt={`${userData.name}'s`}
              />
            </div>
            <h5>{userData.name}</h5>
          </div>
          <nav className="aside-nav hide-scrallbar">
            <summary>
              <small>Folders</small>
            </summary>
            <FolderList
              onClick={closeAside}
              setRefetchFn={setRefetchFn}
            />
          </nav>
          <div
            className="bottom-bar c-point"
            onClick={handleCreateBtnClk}
          >
            <AiOutlinePlus />
            Add Folder
          </div>
        </aside>
        <dialog ref={modalRef}>
          <article>
            <a
              href="#close"
              aria-label="Close"
              className="close"
              onClick={toggleModal}
            ></a>
            <form onSubmit={formik.handleSubmit}>
              <label
                htmlFor="name"
                aria-invalid={
                  formik.touched.name && !!formik.errors.name
                }
              >
                {formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : 'Folder name'}
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Folder name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  aria-invalid={
                    formik.touched.name && !!formik.errors.name
                  }
                />
              </label>
              <div className="grid">
                <button type="submit" aria-busy={loading}>
                  Add
                </button>
                <button
                  className="secondary"
                  onClick={toggleModal}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </article>
        </dialog>
      </>
    );
  }
);

export default Aside;
