import React from 'react';
import TaskCard from '../TaskCard/TaskCard';
import Loader from '../Loader/Loader';
import EmptyState from '../EmptyState/EmptyState';
import Button from '../Button/Button';

import Pagination from '../Pagination/Pagination';

export const TaskList = ({
  tasks = [],
  loadingTasks,
  taskError,
  loadTasks,
  onToggleComplete,
  onEdit,
  onDelete,
  hasTotalTasks = false,
  currentPage = 1,
  onPageChange,
}) => {
  if (loadingTasks) {
    return <Loader text="Fetching tasks..." />;
  }

  if (taskError) {
    return (
      <div className="alert alert-error" style={styles.taskListError}>
        <span>{taskError}</span>
        <Button variant="secondary" onClick={loadTasks} style={styles.taskRetryBtn}>
          Retry
        </Button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No Tasks Found"
        description={
          hasTotalTasks
            ? 'No tasks match the selected filters.'
            : "You haven't created any tasks yet. Click 'Add Task' to get started!"
        }
      />
    );
  }

  const itemsPerPage = 10;
  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  // Paginated slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = tasks.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div style={styles.taskListContainer}>
        {paginatedTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

const styles = {
  taskListContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  taskListError: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskRetryBtn: {
    padding: '4px 8px',
    fontSize: '12px',
  }
};

export default TaskList;
