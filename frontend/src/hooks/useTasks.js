import { useState, useCallback, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { taskService } from '../services/taskService';

// This hook manages the state and logic for tasks.
// It is instantiated once in TaskProvider to share state globally.
export const useTasksState = () => {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [taskError, setTaskError] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoadingTasks(true);
    setTaskError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
      return { success: true };
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTaskError(error.message || 'Failed to load tasks');
      return { success: false, error: error.message };
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  const createTask = useCallback(async (formData) => {
    try {
      const response = await taskService.createTask(formData);
      await loadTasks();
      return { success: true, task: response.task };
    } catch (error) {
      console.error('Error creating task:', error);
      return { success: false, error: error.message };
    }
  }, [loadTasks]);

  const updateTask = useCallback(async (taskId, formData) => {
    try {
      const response = await taskService.updateTask(taskId, formData);
      await loadTasks();
      return { success: true, task: response.task };
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, error: error.message };
    }
  }, [loadTasks]);

  const toggleTaskComplete = useCallback(async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    // Optimistic Update
    setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    
    try {
      await taskService.toggleTaskStatus(task._id, newStatus);
      return { success: true };
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert on error
      await loadTasks();
      return { success: false, error: error.message };
    }
  }, [loadTasks]);

  const deleteTask = useCallback(async (taskId) => {
    // Optimistic Update
    setTasks(prev => prev.filter(t => t._id !== taskId));
    
    try {
      await taskService.deleteTask(taskId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      // Revert on error
      await loadTasks();
      return { success: false, error: error.message };
    }
  }, [loadTasks]);

  return {
    tasks,
    loadingTasks,
    taskError,
    loadTasks,
    createTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
  };
};

// This hook is used by components to consume the shared tasks context.
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
export default useTasks;
