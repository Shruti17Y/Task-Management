import React, { useState, useMemo, useCallback, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useTasks from '../../hooks/useTasks';
import useConnectivity from '../../hooks/useConnectivity';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import StatsCards from '../../components/StatsCards/StatsCards';
import FilterBar from '../../components/FilterBar/FilterBar';
import TaskList from '../../components/TaskList/TaskList';
import TaskForm from '../../components/TaskForm/TaskForm';
import { filterTasks } from '../../utils/filterTasks';
import { sortTasks } from '../../utils/sortTasks';
import { fetchFromAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const {
    tasks,
    loadingTasks,
    taskError,
    loadTasks,
    createTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
  } = useTasks();

  const {
    connStatus,
    latency,
    dbDetails,
    checkConnectivity,
  } = useConnectivity();

  // Filters & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt:desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Fetch users if logged in as admin
  useEffect(() => {
    if (user && user.email === 'admin@example.com') {
      const fetchUsers = async () => {
        try {
          const data = await fetchFromAPI('/auth/users');
          setUsers(data || []);
        } catch (e) {
          console.error('Error fetching users:', e.message);
        }
      };
      fetchUsers();
    }
  }, [user]);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, priorityFilter, sortBy]);

  // Navigation View State
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '',
    assignedUser: '',
  });

  // Form Submitting indicator
  const [submitting, setSubmitting] = useState(false);

  // Handle Form Inputs
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Open Create Form
  const openCreateForm = useCallback(() => {
    setEditingTaskId(null);
    setFormData({
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
      dueDate: '',
      assignedUser: '',
    });
    setView('create');
  }, []);

  // Open Edit Form
  const openEditForm = useCallback((task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status || 'Pending',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().substr(0, 10) : '',
      assignedUser: task.user ? (task.user._id || task.user) : '',
    });
    setView('edit');
  }, []);

  // Submit Create or Edit Form
  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Task title cannot be empty', 'error');
      return;
    }

    if (formData.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const chosenDate = new Date(formData.dueDate);
      const chosenDateMidnight = new Date(chosenDate.getUTCFullYear(), chosenDate.getUTCMonth(), chosenDate.getUTCDate());
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (chosenDateMidnight < todayMidnight) {
        showToast('Due date cannot be in the past', 'error');
        return;
      }
    }

    setSubmitting(true);
    let result;
    if (view === 'create') {
      result = await createTask(formData);
    } else {
      result = await updateTask(editingTaskId, formData);
    }

    setSubmitting(false);
    if (result.success) {
      setView('list');
      showToast(view === 'create' ? 'Task created successfully' : 'Task updated successfully', 'success');
    } else {
      showToast(result.error || 'Error saving task', 'error');
    }
  }, [view, formData, editingTaskId, createTask, updateTask, showToast]);

  // Toggle Task Completion Button
  const handleToggleComplete = useCallback(async (task) => {
    const result = await toggleTaskComplete(task);
    if (!result.success) {
      showToast(result.error || 'Error updating status', 'error');
    } else {
      const isNowCompleted = task.status !== 'Completed';
      showToast(isNowCompleted ? 'Task marked as Completed' : 'Task marked as Pending', 'success');
    }
  }, [toggleTaskComplete, showToast]);

  // Delete a Task
  const handleDeleteTask = useCallback(async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    const result = await deleteTask(taskId);
    if (!result.success) {
      showToast(result.error || 'Error deleting task', 'error');
    } else {
      showToast('Task deleted successfully', 'success');
    }
  }, [deleteTask, showToast]);

  // Stats Calculations
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    return {
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: total - completed,
    };
  }, [tasks]);

  // Filter & Search Logic (Client-side for seamless UX)
  const filteredTasksList = useMemo(() => {
    return filterTasks(tasks, searchQuery, statusFilter, priorityFilter);
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // Sort Logic (Due Date, Created Date, Priority)
  const sortedTasksList = useMemo(() => {
    return sortTasks(filteredTasksList, sortBy);
  }, [filteredTasksList, sortBy]);

  return (
    <div className="dashboard-container">
      <DashboardHeader
        user={user}
        connStatus={connStatus}
        dbDetails={dbDetails}
        latency={latency}
        onCheckConnectivity={checkConnectivity}
      />

      <StatsCards
        totalTasks={stats.totalTasks}
        pendingTasks={stats.pendingTasks}
        completedTasks={stats.completedTasks}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onAddTask={openCreateForm}
      />

      <TaskList
        tasks={sortedTasksList}
        loadingTasks={loadingTasks}
        taskError={taskError}
        loadTasks={loadTasks}
        onToggleComplete={handleToggleComplete}
        onEdit={openEditForm}
        onDelete={handleDeleteTask}
        hasTotalTasks={tasks.length > 0}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {(view === 'create' || view === 'edit') && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <TaskForm
              view={view}
              formData={formData}
              onChange={handleInputChange}
              onSubmit={handleFormSubmit}
              onCancel={() => setView('list')}
              submitting={submitting}
              users={users}
              isAdmin={user && user.email === 'admin@example.com'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(11, 15, 25, 0.5)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    boxSizing: 'border-box',
    padding: '20px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '500px',
    animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  }
};

export default Dashboard;
