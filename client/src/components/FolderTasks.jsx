import { useQuery } from '@apollo/client';
import {
  CREATE_FOLDER_TASK_MUTATION,
  FOLDER_TASK_QUERY,
} from '../utils/gqlQuerys';
import { useParams } from 'react-router-dom';
import { RiTodoFill } from 'react-icons/ri';
import Todo from './Todo';
import FolderOptions from './FolderOptions';
import { useState } from 'react';
import moment from 'moment';

const FolderTasks = () => {
  const { id } = useParams();
  const { data, error, loading, refetch } = useQuery(
    FOLDER_TASK_QUERY,
    {
      variables: {
        where: {
          id: {
            equals: id,
          },
        },
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
      {(() => {
        const folders = data?.authenticatedItem?.folders;

        return (
          !loading &&
          (folders?.length === 1 ? (
            <>
              <div className="text-banner">
                <h1>{folders[0]?.name}</h1>
                <p>
                  {/* • */}
                  <RiTodoFill /> {folders[0]?.todosCount}
                </p>
              </div>
              <FolderOptions
                setGrid={setGrid}
                grid={grid}
                setSort={setSort}
                refetch={refetch}
                folderId={folders[0]?.id}
                taskCreateMutation={CREATE_FOLDER_TASK_MUTATION}
              />
              <div
                className="task-cont hide-scrallbar"
                style={{ display: grid ? 'grid' : 'block' }}
              >
                {folders[0]?.todos?.length > 0 ? (
                  [...folders[0]?.todos]
                    ?.sort(handleSort)
                    .map(({ id, ...rest }) => (
                      <Todo
                        {...rest}
                        id={id}
                        key={id}
                        refetch={refetch}
                      />
                    ))
                ) : (
                  <p>Nothing is hare</p>
                )}
              </div>
            </>
          ) : (
            <p>Somthing went wrong</p>
          ))
        );
      })()}
    </div>
  );
};

export default FolderTasks;
