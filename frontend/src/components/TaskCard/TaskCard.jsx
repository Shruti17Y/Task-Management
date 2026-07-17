import React from 'react';
import Card from '../Card/Card';
import Badge from '../Badge/Badge';
import Button from '../Button/Button';
import { formatDate } from '../../utils/formatDate';
import { getPriorityColor, getPriorityBadgeStyle } from '../../utils/priorityColor';

export const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const isCompleted = task.status === 'Completed';
  const priorityColor = getPriorityColor(task.priority);
  const formattedDate = formatDate(task.dueDate);
  const formattedCreatedAt = formatDate(task.createdAt);
  const priorityBadgeStyle = getPriorityBadgeStyle(task.priority);

  const cardStyle = {
    ...styles.taskCard,
    borderLeft: `5px solid ${isCompleted ? 'var(--border)' : priorityColor}`,
    ...(isCompleted ? styles.taskCardCompleted : {}),
  };

  const titleStyle = {
    ...styles.taskTitle,
    ...(isCompleted ? styles.taskTitleCompleted : {}),
  };

  const statusBadgeStyle = isCompleted 
    ? styles.statusBadgeCompleted 
    : styles.statusBadgePending;

  return (
    <Card style={cardStyle}>
      <div style={styles.taskCardBody}>
        <div style={styles.taskInfoSection}>
          <h3 style={titleStyle}>
            {task.title}
          </h3>
          {task.description && (
            <p style={styles.taskDescription}>
              {task.description}
            </p>
          )}
        </div>

        <div style={styles.taskBadgesSection}>
          <Badge style={priorityBadgeStyle}>
            {task.priority}
          </Badge>
          <Badge style={statusBadgeStyle}>
            {task.status}
          </Badge>
        </div>
      </div>

      <div style={styles.taskMetadataActions}>
        <div style={styles.taskDates}>
          {formattedCreatedAt && (
            <div style={styles.taskDateText}>Created: {formattedCreatedAt}</div>
          )}
          {formattedDate && (
            <div style={styles.taskDateText}>Due: {formattedDate}</div>
          )}
        </div>

        <div style={styles.taskActions}>
          <Button 
            variant="secondary" 
            onClick={() => onToggleComplete(task)}
            style={styles.taskActionBtn}
          >
            {isCompleted ? 'Mark Pending' : 'Mark Completed'}
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => onEdit(task)}
            style={styles.taskActionBtn}
          >
            Edit
          </Button>
          <Button 
            variant="danger" 
            onClick={() => onDelete(task._id)}
            style={styles.taskActionBtn}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

const styles = {
  taskCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  taskCardCompleted: {
    opacity: 0.75,
  },
  taskCardBody: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  },
  taskInfoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flexGrow: 1,
  },
  taskTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: 'var(--text-h)',
  },
  taskTitleCompleted: {
    textDecoration: 'line-through',
    color: 'var(--text)',
  },
  taskDescription: {
    fontSize: '14px',
    color: 'var(--text)',
    margin: '4px 0 0',
    whiteSpace: 'pre-wrap',
  },
  taskBadgesSection: {
    display: 'flex',
    gap: '6px',
    flexShrink: 0,
  },
  statusBadgeCompleted: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
  },
  statusBadgePending: {
    background: 'var(--code-bg)',
    color: 'var(--text)',
  },
  taskMetadataActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--border)',
    paddingTop: '12px',
    marginTop: '4px',
  },
  taskDates: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  taskDateText: {
    fontSize: '13px',
    color: 'var(--text)',
  },
  taskActions: {
    display: 'flex',
    gap: '8px',
  },
  taskActionBtn: {
    padding: '6px 12px',
    fontSize: '13px',
  }
};

export default TaskCard;
