import React from 'react';
import Card from '../Card/Card';
import Input from '../Input/Input';
import Select from '../Select/Select';
import Button from '../Button/Button';

export const TaskForm = ({
  view,
  formData,
  onChange,
  onSubmit,
  onCancel,
  submitting,
}) => {
  return (
    <div style={styles.taskFormWrapper}>
      <Card className="auth-card" style={styles.taskFormCard}>
        <h2>{view === 'create' ? 'Create Task' : 'Edit Task'}</h2>
        <p className="auth-subtitle">Fill in the fields to save your task details.</p>
        
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
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onCancel}
              style={styles.formActionBtnFull}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={submitting}
              style={styles.formActionBtnFull}
            >
              {submitting ? 'Saving...' : 'Save Task'}
            </Button>
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
    padding: '20px 0',
  },
  taskFormCard: {
    maxWidth: '500px',
    width: '100%',
    margin: 0,
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
    gap: '12px',
    marginTop: '32px',
  },
  formActionBtnFull: {
    flex: 1,
    padding: '12px',
  }
};

export default TaskForm;
