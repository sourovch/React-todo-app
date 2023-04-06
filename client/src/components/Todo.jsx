import React from 'react';
import { TbCalendarDue } from 'react-icons/tb';
import moment from 'moment';
import { useState, useEffect } from 'react';
import useDebaunce from '../hooks/useDebaunce';
import { useRef } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { AiFillDelete } from 'react-icons/ai';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import {
  DELATE_TASK_MUTATION,
  EDIT_TASK_MUTATION,
} from '../utils/gqlQuerys';
import {
  ERROR_TOAST_OPTIONS,
  SUCCESS_TOAST_OPTIONS,
} from '../utils/tostOptions';

const Todo = ({
  task,
  due,
  isDone: doneValue,
  createdAt,
  id,
  refetch,
}) => {
  const [delReq] = useMutation(DELATE_TASK_MUTATION, {
    variables: {
      where: {
        id,
      },
    },
    onCompleted(data) {
      toast.success(
        <small>{'Deleted: ' + data.deleteTodo.task}</small>,
        SUCCESS_TOAST_OPTIONS
      );
      refetch();
    },
    onError(err) {
      toast.error(err.message, ERROR_TOAST_OPTIONS);
    },
  });
  const [editREq] = useMutation(EDIT_TASK_MUTATION);
  const [isDone, setIsDone] = useState(doneValue);
  const debaunceValue = useDebaunce(isDone, 800);
  const runEditReq = useRef();
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

    () => document.removeEventListener('click', documentClickHandler);
  }, []);

  useEffect(() => {
    if (!runEditReq.current) {
      runEditReq.current = true;
      return;
    }
    editREq({
      variables: {
        data: {
          isDone,
        },
        where: {
          id,
        },
      },
      onCompleted() {
        refetch();
      },
      onError(err) {
        runEditReq.current = false;
        setIsDone((v) => !v);
        toast.error(err.message, ERROR_TOAST_OPTIONS);
      },
    });
  }, [debaunceValue]);

  const handleChange = (e) => {
    setIsDone(e.target.checked);
  };

  const menuExtend = () => {
    const menu = menuRef.current;

    menu?.classList.toggle('active');
  };

  const handleDelateTask = () => {
    delReq();
  };

  return (
    <div className="todo_card">
      <div className="top-bar">
        <HiDotsVertical
          onClick={menuExtend}
          className="c-point menu-btn"
        />
        <ul ref={menuRef}>
          <li onClick={handleDelateTask}>
            <AiFillDelete />
          </li>
        </ul>
      </div>
      <p>
        <big>
          <TbCalendarDue
            style={{
              color:
                moment().isAfter(due) && !isDone ? 'red' : 'green',
            }}
          />
        </big>{' '}
        <small>
          {moment(due).fromNow()}{' '}
          {moment().isAfter(due) && !isDone && (
            <span style={{ color: 'red' }}>(missed)</span>
          )}
        </small>
      </p>
      <fieldset>
        <label htmlFor="switch_disabled">
          <input
            type="checkbox"
            id="switch"
            name="switch"
            role="switch"
            checked={isDone}
            onChange={handleChange}
          />
          {task}
        </label>
      </fieldset>
      <div className="createdAt">
        Tracking since {moment(createdAt).format('MM Do YYYY')}
      </div>
    </div>
  );
};

export default Todo;
