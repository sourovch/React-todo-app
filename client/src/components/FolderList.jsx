import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  DELATE_TASK_MUTATION,
  FOLDER_DELATE_MUTATION,
  GET_FOLDERS_QUERY,
} from '../utils/gqlQuerys';
import { ERROR_TOAST_OPTIONS } from '../utils/tostOptions';

const FolderList = ({ setRefetchFn, ...props }) => {
  const { data, loading, error, refetch } = useQuery(
    GET_FOLDERS_QUERY,
    {
      onError: (err) => {
        toast.error(err.message, ERROR_TOAST_OPTIONS);
      },
    }
  );
  const [reqDelate] = useMutation(FOLDER_DELATE_MUTATION);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      refetch();
    }

    setRefetchFn(() => refetch);
  }, []);

  const handleDelate = (id) => (e) => {
    reqDelate({
      variables: {
        where: {
          id,
        },
      },
      onError(err) {
        toast.error(err.message, ERROR_TOAST_OPTIONS);
      },
      onCompleted(data) {
        refetch();
        navigate('/');
      },
    });
  };

  if (error) return <small>{error.message}</small>;

  return (
    <ul {...props} aria-busy={loading}>
      {!loading && (
        <li>
          <NavLink to={'/'}>Root</NavLink>
        </li>
      )}
      {!loading && !!data.authenticatedItem
        ? data.authenticatedItem.folders.map(({ id, name }) => {
            return (
              <li key={id}>
                <NavLink to={`folder/${id}`}>{name}</NavLink>
                <small>
                  <AiFillDelete
                    className="icon"
                    onClick={handleDelate(id)}
                  />
                </small>
              </li>
            );
          })
        : ''}
    </ul>
  );
};

export default FolderList;
