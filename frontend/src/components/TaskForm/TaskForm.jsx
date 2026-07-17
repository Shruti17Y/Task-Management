import React, { useState } from 'react';
import Card from '../Card/Card';
import Input from '../Input/Input';
import Select from '../Select/Select';

const CloseIconBtn = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.closeBtn,
        ...(hovered ? styles.closeBtnHover : {})
      }}
      title="Close"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
};

const FormActionBtn = ({ type, onClick, disabled, isSubmit, children }) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const btnStyle = isSubmit ? styles.submitBtn : styles.cancelBtn;
  const hoverStyle = isSubmit ? styles.submitBtnHover : styles.cancelBtnHover;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        ...btnStyle,
        ...(hovered ? hoverStyle : {}),
        ...(active ? styles.btnActive : {}),
        ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {})
      }}
    >
      {children}
    </button>
  );
};

export const TaskForm = ({
  view,
  formData,
  onChange,
  onSubmit,
  onCancel,
  submitting,
  users = [],
  isAdmin = false,
}) => {
  return (
    <div style={styles.taskFormWrapper}>
      <Card className="auth-card" style={styles.taskFormCard}>
        <div style={styles.cardHeader}>
          <h2>{view === 'create' ? 'Create Task' : 'Edit Task'}</h2>
          <CloseIconBtn onClick={onCancel} />
        </div>
        <p className="auth-subtitle" style={styles.subtitle}>Fill in the fields to save your task details.</p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Task Title <span style={{ color: '#ef4444' }}>*</span></label>
            <Input
              type="text"
              name="title"
              required
              placeholder="E.g., Complete project report"
              value={formData.title}
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              placeholder="Enter details about this task..."
              value={formData.description}
              onChange={onChange}
              className="form-input"
              style={styles.taskFormTextarea}
              rows="4"
            />
          </div>

          <div style={styles.formGridRow}>
            <div className="form-group" style={styles.formGridCol}>
              <label className="form-label">Priority</label>
              <Select
                name="priority"
                value={formData.priority}
                onChange={onChange}
                className="form-input"
                style={styles.formSelectFull}
                options={[
                  { value: 'Low', label: 'Low' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'High', label: 'High' },
                ]}
              />
            </div>

            <div className="form-group" style={styles.formGridCol}>
              <label className="form-label">Status</label>
              <Select
                name="status"
                value={formData.status}
                onChange={onChange}
                className="form-input"
                style={styles.formSelectFull}
                options={[
                  { value: 'Pending', label: 'Pending' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Completed', label: 'Completed' },
                ]}
              />
            </div>
          </div>

          {isAdmin && users.length > 0 && (
            <div className="form-group">
              <label className="form-label">Assign To User</label>
              <Select
                name="assignedUser"
                value={formData.assignedUser}
                onChange={onChange}
                className="form-input"
                style={styles.formSelectFull}
                options={[
                  { value: '', label: 'Select assignee user...' },
                  ...users.map(u => ({ value: u._id, label: `${u.name} (${u.email})` }))
                ]}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <Input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={onChange}
            />
          </div>

          <div style={styles.formActionsRow}>
            <FormActionBtn
              type="button"
              onClick={onCancel}
            >
              Cancel
            </FormActionBtn>
            <FormActionBtn
              type="submit"
              disabled={submitting}
              isSubmit
            >
              {submitting ? 'Saving...' : 'Add Task'}
            </FormActionBtn>
          </div>
        </form>
      </Card>
    </div>
  );
};

const styles = {
  taskFormWrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '0',
    width: '100%',
  },
  taskFormCard: {
    maxWidth: '500px',
    width: '100%',
    margin: 0,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    border: '1px solid var(--border)',
    background: 'var(--card-bg)',
    position: 'relative',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text)',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
  },
  closeBtnHover: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: 'var(--text-h)',
  },
  subtitle: {
    margin: '0 0 24px 0',
  },
  taskFormTextarea: {
    minHeight: '100px',
    resize: 'vertical',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  formGridRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '20px',
  },
  formGridCol: {
    marginBottom: 0,
  },
  formSelectFull: {
    width: '100%',
  },
  formActionsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '32px',
  },
  cancelBtn: {
    width: 'auto',
    padding: '10px 24px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text-h)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cancelBtnHover: {
    background: 'rgba(255, 255, 255, 0.1)',
  },
  submitBtn: {
    width: 'auto',
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #ffa05e 0%, #ff791a 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px rgba(255, 121, 26, 0.25)',
  },
  submitBtnHover: {
    background: 'linear-gradient(135deg, #ffae75 0%, #ff8933 100%)',
    boxShadow: '0 6px 20px rgba(255, 121, 26, 0.35)',
    transform: 'translateY(-1px)',
  },
  btnActive: {
    transform: 'scale(0.97)',
  }
};

export default TaskForm;
