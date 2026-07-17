export const filterTasks = (tasks, searchQuery, statusFilter, priorityFilter) => {
  if (!tasks) return [];
  
  const query = searchQuery.trim().toLowerCase();
  
  return tasks.filter(task => {
    const matchesSearch = !query
      || task.title.toLowerCase().includes(query)
      || (task.description && task.description.toLowerCase().includes(query));
    
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });
};
