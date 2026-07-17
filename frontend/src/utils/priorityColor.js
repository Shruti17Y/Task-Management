import { TASK_PRIORITY } from '../constants/taskConstants';

export const getPriorityColor = (priority) => {
  switch (priority) {
    case TASK_PRIORITY.HIGH:
      return '#ef4444';
    case TASK_PRIORITY.MEDIUM:
      return '#f59e0b';
    case TASK_PRIORITY.LOW:
    default:
      return '#3b82f6';
  }
};

export const getPriorityBadgeStyle = (priority) => {
  switch (priority) {
    case TASK_PRIORITY.HIGH:
      return {
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
      };
    case TASK_PRIORITY.MEDIUM:
      return {
        background: 'rgba(245, 158, 11, 0.1)',
        color: '#f59e0b',
      };
    case TASK_PRIORITY.LOW:
    default:
      return {
        background: 'rgba(59, 130, 246, 0.1)',
        color: '#3b82f6',
      };
  }
};
