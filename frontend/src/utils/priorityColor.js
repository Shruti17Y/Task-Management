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

export const getPriorityCardStyle = (priority, isCompleted) => {
  if (isCompleted) {
    return {
      background: '#a8f2c6', // Soft Mint/Green
      color: '#111827',
      borderColor: 'rgba(0, 0, 0, 0.05)',
      boxShadow: '0 8px 16px rgba(168, 242, 198, 0.15)',
    };
  }

  switch (priority) {
    case TASK_PRIORITY.HIGH:
      return {
        background: '#ffcbc6', // Soft Coral/Pink
        color: '#111827',
        borderColor: 'rgba(0, 0, 0, 0.05)',
        boxShadow: '0 8px 16px rgba(255, 203, 198, 0.15)',
      };
    case TASK_PRIORITY.MEDIUM:
      return {
        background: '#ffd8be', // Soft Peach/Orange
        color: '#111827',
        borderColor: 'rgba(0, 0, 0, 0.05)',
        boxShadow: '0 8px 16px rgba(255, 216, 190, 0.15)',
      };
    case TASK_PRIORITY.LOW:
    default:
      return {
        background: '#bfeeff', // Soft Blue
        color: '#111827',
        borderColor: 'rgba(0, 0, 0, 0.05)',
        boxShadow: '0 8px 16px rgba(191, 238, 255, 0.15)',
      };
  }
};
