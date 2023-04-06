import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import {
  CREATE_ROOT_TASK_MUTATION,
  ROOT_TASK_QUERY,
} from '../utils/gqlQuerys';
import { useOutletContext } from 'react-router-dom';
import { RiTodoFill } from 'react-icons/ri';
import Todo from './Todo';
import FolderOptions from './FolderOptions';
import moment from 'moment';

const RootTasks = () => {
  const { data, error, loading, refetch } = useQuery(
    ROOT_TASK_QUERY,
    {
      variables: {
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      },
    }
  );
  const [grid, setGrid] = useState(true);
  const [sort, setSort] = useState(0);

  const handleSort = (a, b) => {
    const isAMissed = moment().isBefore(a.due);
    const isBMissed = moment().isBefore(b.due);

    if (isAMissed && isBMissed) return 0;
    if (isAMissed) return sort;
    if (isBMissed) return sort * -1;

    return 0;
  };

  if (error)
    return (
      <p>
        <small>{error.message}</small>
      </p>
    );
  return (
    <div className="load-container task-sec" aria-busy={loading}>
      {!loading && (
        <div className="text-banner">
          <h1>Root</h1>
          <p>
            {/* • */}
            <RiTodoFill /> {data?.authenticatedItem?.todosCount || 0}
          </p>
        </div>
      )}
      <FolderOptions
        setGrid={setGrid}
        grid={grid}
        setSort={setSort}
        refetch={refetch}
        taskCreateMutation={CREATE_ROOT_TASK_MUTATION}
      />
      <div
        className="task-cont hide-scrallbar"
        style={{ display: grid ? 'grid' : 'block' }}
      >
        {!loading &&
          (data?.authenticatedItem?.todos?.length > 0 ? (
            [...data?.authenticatedItem?.todos]
              ?.sort(handleSort)
              .map(({ id, ...rest }) => (
                <Todo {...rest} id={id} key={id} refetch={refetch} />
              ))
          ) : (
            <p>Nothing is hare</p>
          ))}
      </div>
    </div>
  );
};

export default RootTasks;
