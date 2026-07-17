import React, { useState } from 'react';
import Card from '../Card/Card';
import Badge from '../Badge/Badge';
import { formatDate } from '../../utils/formatDate';
import { getPriorityColor, getPriorityCardStyle } from '../../utils/priorityColor';

const ActionIconBtn = ({ onClick, children, title }) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      title={title}
      style={{
        ...styles.actionButton,
        ...(hovered ? styles.actionButtonHover : {}),
        ...(active ? styles.actionButtonActive : {}),
      }}
    >
      {children}
    </button>
  );
};

export const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [cardHovered, setCardHovered] = useState(false);
  const isCompleted = task.status === 'Completed';
  const priorityColor = getPriorityColor(task.priority);
  const formattedDate = formatDate(task.dueDate);
  const formattedCreatedAt = formatDate(task.createdAt);
  const priorityCardStyle = getPriorityCardStyle(task.priority, isCompleted);

  const cardStyle = {
    ...styles.taskCard,
    ...priorityCardStyle,
    borderTop: `6px solid ${isCompleted ? '#10b981' : priorityColor}`,
    ...(isCompleted ? styles.taskCardCompleted : {}),
    ...(cardHovered ? styles.taskCardHovered : {}),
  };

  const titleStyle = {
    ...styles.taskTitle,
    ...(isCompleted ? styles.taskTitleCompleted : {}),
  };

  return (
    <Card 
      style={cardStyle}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
    >
      {/* Top Header Row (Priority and Action Icons) */}
      <div style={styles.topHeader}>
        <Badge style={styles.priorityBadge}>
          {task.priority}
        </Badge>
        
        {/* Action Button Icons (Top Right) */}
        <div style={styles.actionsBar}>
          <ActionIconBtn 
            onClick={() => onToggleComplete(task)}
            title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
          >
            {isCompleted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
          </ActionIconBtn>

          <ActionIconBtn 
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
          </ActionIconBtn>

          <ActionIconBtn 
            onClick={() => onDelete(task._id)}
            title="Delete Task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </ActionIconBtn>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={styles.contentArea}>
        <h3 style={titleStyle}>
          {task.title}
        </h3>
        
        {task.description && (
          <p style={styles.taskDescription}>
            {task.description}
          </p>
        )}

        {task.user && typeof task.user === 'object' && task.user.name && (
          <div style={styles.assigneeContainer}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span style={styles.assigneeLabel}>User:</span> <strong style={styles.assigneeName}>{task.user.name}</strong>
          </div>
        )}
      </div>

      {/* Footer Details (Dates on Left, Status Badge on Right) */}
      <div style={styles.footerContainer}>
        <div style={styles.taskDates}>
          {formattedCreatedAt && (
            <div style={styles.dateRow}>
              <span style={styles.dateLabel}>Created:</span> {formattedCreatedAt}
            </div>
          )}
          {formattedDate && (
            <div style={styles.dateRow}>
              <span style={styles.dateLabel}>Due:</span> {formattedDate}
            </div>
          )}
        </div>

        <Badge style={styles.statusBadge}>
          {task.status}
        </Badge>
      </div>
    </Card>
  );
};

const styles = {
  taskCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px',
    borderRadius: '24px',
    minHeight: '210px',
    boxSizing: 'border-box',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid transparent',
    overflow: 'hidden',
  },
  taskCardCompleted: {
    opacity: 0.85,
  },
  taskCardHovered: {
    transform: 'translateY(-6px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  priorityBadge: {
    background: 'rgba(0, 0, 0, 0.05)',
    color: '#111827',
    fontSize: '11px',
    fontWeight: '700',
    borderRadius: '8px',
    padding: '4px 10px',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  contentArea: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '16px',
  },
  taskTitle: {
    fontSize: '18px',
    fontWeight: '700',
    margin: 0,
    color: '#111827',
    lineHeight: '1.25',
    letterSpacing: '-0.3px',
  },
  taskTitleCompleted: {
    textDecoration: 'line-through',
    color: 'rgba(17, 24, 39, 0.6)',
  },
  taskDescription: {
    fontSize: '13px',
    color: 'rgba(17, 24, 39, 0.8)',
    margin: '4px 0 0',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.4',
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: '12px',
    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
    marginTop: 'auto',
  },
  taskDates: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  dateRow: {
    fontSize: '11px',
    color: 'rgba(17, 24, 39, 0.75)',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  dateLabel: {
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    background: 'rgba(255, 255, 255, 0.65)',
    color: '#111827',
    fontSize: '11px',
    fontWeight: '600',
    borderRadius: '12px',
    padding: '4px 12px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
    alignSelf: 'flex-end',
    marginBottom: '2px',
  },
  actionsBar: {
    display: 'flex',
    gap: '6px',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.05)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  actionButtonHover: {
    background: 'rgba(0, 0, 0, 0.12)',
    transform: 'scale(1.08)',
  },
  actionButtonActive: {
    transform: 'scale(0.95)',
  },
  assigneeContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '11px',
    color: '#1f2937',
    marginTop: '10px',
    opacity: 0.85,
  },
  assigneeLabel: {
    fontWeight: '600',
    marginRight: '4px',
    color: '#111827',
  },
  assigneeName: {
    fontWeight: '600',
  },
};

export default TaskCard;
