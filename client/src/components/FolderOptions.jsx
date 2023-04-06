import { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { BsFillGridFill, BsViewList } from 'react-icons/bs';

import useModal from '../hooks/useModal';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { ERROR_TOAST_OPTIONS } from '../utils/tostOptions';

const FolderOptions = ({
  setGrid,
  grid,
  setSort,
  refetch,
  folderId,
  taskCreateMutation,
  ...rest
}) => {
  const modalRef = useRef();
  const { userData } = useAuth();
  const [reqCreateTask, { loading }] = useMutation(
    taskCreateMutation
  );
  const { toggleModal, setModal } = useModal(modalRef.current);
  const formik = useFormik({
    initialValues: {
      task: '',
      dueDate: moment().format('YYYY-MM-DD'),
      dueTime: moment().add(20, 'minutes').format('HH:mm'),
    },
    validationSchema: yup.object({
      task: yup
        .string()
        .min(3, 'Too short')
        .max(35, 'Too big')
        .required('Required'),
      dueDate: yup
        .date()
        .min(moment().subtract(1, 'day').format(), 'Invalid date')
        .required('Please enter due date'),
      dueTime: yup
        .string()
        .required('Please enter due time')
        .test('after-curr', 'Invalid Time', (value) =>
          moment(value, 'HH:mm').isSameOrAfter(
            moment().add(10, 'minutes')
          )
        ),
    }),
    onSubmit({ task, dueDate, dueTime }, actions) {
      reqCreateTask({
        variables: {
          where: {
            id: folderId || userData.id,
          },
          data: (() => {
            let createObj = {
              due: moment(`${dueDate} ${dueTime}`).utc().format(),
              isDone: false,
              task: task,
            };

            if (folderId) {
              createObj = {
                ...createObj,
                folder: {
                  connect: {
                    id: folderId,
                  },
                },
              };
            }
            return {
              todos: {
                create: [createObj],
              },
            };
          })(),
        },
        onCompleted() {
          refetch();
          toggleModal();
          actions.resetForm({
            values: {
              task: '',
              dueDate: moment().format('YYYY-MM-DD'),
              dueTime: moment().add(20, 'minutes').format('HH:mm'),
            },
          });
          actions.setTouched({
            task: false,
            dueDate: false,
            dueTime: false,
          });
        },
        onError(err) {
          toast.error(err.message, ERROR_TOAST_OPTIONS);
        },
      });
    },
  });

  useEffect(() => {
    setModal(modalRef.current);
  }, []);

  return (
    <>
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
              htmlFor="task"
              aria-invalid={
                formik.touched.task && !!formik.errors.task
              }
            >
              {formik.touched.task && formik.errors.task
                ? formik.errors.task
                : 'Task name'}
              <input
                type="text"
                name="task"
                id="task"
                placeholder="Task name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.task}
                aria-invalid={
                  formik.touched.task && !!formik.errors.task
                }
              />
            </label>
            <div className="grid">
              <label
                htmlFor="dueDate"
                aria-invalid={
                  formik.touched.dueDate && !!formik.errors.dueDate
                }
              >
                {formik.touched.dueDate && formik.errors.dueDate
                  ? formik.errors.dueDate
                  : 'Due date'}

                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.dueDate}
                  aria-invalid={
                    formik.touched.dueDate && !!formik.errors.dueDate
                  }
                />
              </label>
              <label
                htmlFor="dueTime"
                aria-invalid={
                  formik.touched.dueTime && !!formik.errors.dueTime
                }
              >
                {formik.touched.dueTime && formik.errors.dueTime
                  ? formik.errors.dueTime
                  : 'Time'}

                <input
                  type="time"
                  name="dueTime"
                  id="dueTime"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.dueTime}
                  aria-invalid={
                    formik.touched.dueTime && !!formik.errors.dueTime
                  }
                />
              </label>
            </div>
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
      <nav className="folder-options" {...rest}>
        <ul>
          <li>
            <button
              onClick={(e) => {
                toggleModal(e);
                modalRef.current
                  .querySelector("input[type='text']")
                  .focus();
              }}
            >
              Add Task
            </button>
          </li>
        </ul>
        <ul>
          <li>
            <details role="list" dir="rtl">
              <summary aria-haspopup="listbox" role="link">
                sort by
              </summary>
              <ul role="listbox">
                <li
                  onClick={() => {
                    setSort(-1);
                  }}
                >
                  <a>Active tasks</a>
                </li>
                <li
                  onClick={() => {
                    setSort(1);
                  }}
                >
                  <a>Missed task</a>
                </li>
                <li
                  onClick={() => {
                    setSort(0);
                  }}
                >
                  <a>Default</a>
                </li>
              </ul>
            </details>
          </li>
          <li onClick={() => setGrid((v) => !v)}>
            <big>{grid ? <BsViewList /> : <BsFillGridFill />}</big>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default FolderOptions;
