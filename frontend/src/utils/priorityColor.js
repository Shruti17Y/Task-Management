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
      background: 'var(--priority-completed-bg, #a8f2c6)',
      color: 'var(--priority-text, #111827)',
      borderColor: 'var(--priority-completed-border, rgba(0, 0, 0, 0.05))',
      boxShadow: '0 8px 16px rgba(168, 242, 198, 0.05)',
    };
  }

  switch (priority) {
    case TASK_PRIORITY.HIGH:
      return {
        background: 'var(--priority-high-bg, #ffcbc6)',
        color: 'var(--priority-text, #111827)',
        borderColor: 'var(--priority-high-border, rgba(0, 0, 0, 0.05))',
        boxShadow: '0 8px 16px rgba(255, 203, 198, 0.05)',
      };
    case TASK_PRIORITY.MEDIUM:
      return {
        background: 'var(--priority-medium-bg, #ffd8be)',
        color: 'var(--priority-text, #111827)',
        borderColor: 'var(--priority-medium-border, rgba(0, 0, 0, 0.05))',
        boxShadow: '0 8px 16px rgba(255, 216, 190, 0.05)',
      };
    case TASK_PRIORITY.LOW:
    default:
      return {
        background: 'var(--priority-low-bg, #bfeeff)',
        color: 'var(--priority-text, #111827)',
        borderColor: 'var(--priority-low-border, rgba(0, 0, 0, 0.05))',
        boxShadow: '0 8px 16px rgba(191, 238, 255, 0.05)',
      };
  }
};
