import React, { useState, useMemo, useCallback } from 'react';
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

export const Dashboard = () => {
  const { user } = useAuth();
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

  // Navigation View State
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '',
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
    });
    setView('edit');
  }, []);

  // Submit Create or Edit Form
  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Task title cannot be empty');
      return;
    }

    if (formData.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const chosenDate = new Date(formData.dueDate);
      const chosenDateMidnight = new Date(chosenDate.getUTCFullYear(), chosenDate.getUTCMonth(), chosenDate.getUTCDate());
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (chosenDateMidnight < todayMidnight) {
        alert('Due date cannot be in the past');
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
    } else {
      alert(result.error || 'Error saving task');
    }
  }, [view, formData, editingTaskId, createTask, updateTask]);

  // Toggle Task Completion Button
  const handleToggleComplete = useCallback(async (task) => {
    const result = await toggleTaskComplete(task);
    if (!result.success) {
      alert(result.error || 'Error updating status');
    }
  }, [toggleTaskComplete]);

  // Delete a Task
  const handleDeleteTask = useCallback(async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    const result = await deleteTask(taskId);
    if (!result.success) {
      alert(result.error || 'Error deleting task');
    }
  }, [deleteTask]);

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

      {view === 'list' ? (
        <>
          <StatsCards
            totalTasks={stats.totalTasks}
            pendingTasks={stats.pendingTasks}
            completedTasks={stats.completedTasks}
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
          />
        </>
      ) : (
        <TaskForm
          view={view}
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleFormSubmit}
          onCancel={() => setView('list')}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default Dashboard;
