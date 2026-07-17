import { fetchFromAPI } from './api';

export const taskService = {
  getTasks: async () => {
    const data = await fetchFromAPI('/tasks?limit=1000');
    return data.tasks || [];
  },

  createTask: async (formData) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
    };
    return fetchFromAPI('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateTask: async (taskId, formData) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
    };
    return fetchFromAPI(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  toggleTaskStatus: async (taskId, newStatus) => {
    return fetchFromAPI(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
    });
  },

  deleteTask: async (taskId) => {
    return fetchFromAPI(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  checkHealth: async () => {
    return fetchFromAPI('/health');
  },
};
