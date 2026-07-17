import { TASK_PRIORITY } from '../constants/taskConstants';

const priorityWeight = {
  [TASK_PRIORITY.HIGH]: 3,
  [TASK_PRIORITY.MEDIUM]: 2,
  [TASK_PRIORITY.LOW]: 1,
};

export const sortTasks = (tasks, sortBy) => {
  if (!tasks) return [];
  
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'createdAt:desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
        
      case 'createdAt:asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
        
      case 'dueDate:asc':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
        
      case 'dueDate:desc':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate) - new Date(a.dueDate);
        
      case 'priority:desc': {
        const wA = priorityWeight[a.priority] || 0;
        const wB = priorityWeight[b.priority] || 0;
        return wB - wA;
      }
      
      case 'priority:asc': {
        const wA = priorityWeight[a.priority] || 0;
        const wB = priorityWeight[b.priority] || 0;
        return wA - wB;
      }
      
      default:
        return 0;
    }
  });
};
