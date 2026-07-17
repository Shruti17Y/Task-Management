import React, { createContext } from 'react';
import { useTasksState } from '../hooks/useTasks';

export const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const taskState = useTasksState();

  return (
    <TaskContext.Provider value={taskState}>
      {children}
    </TaskContext.Provider>
  );
};
