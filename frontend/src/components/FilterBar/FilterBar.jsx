import React from 'react';
import Card from '../Card/Card';
import Input from '../Input/Input';
import Select from '../Select/Select';
import Button from '../Button/Button';

export const FilterBar = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  onAddTask,
}) => {
  return (
    <Card style={styles.filterBarContainer}>
      <div style={styles.filterInputsGroup}>
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.filterSearchInput}
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.filterSelect}
          options={[
            { value: 'All', label: 'All Status' },
            { value: 'Pending', label: 'Pending' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
          ]}
        />

        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={styles.filterSelect}
          options={[
            { value: 'All', label: 'All Priority' },
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
          ]}
        />

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={styles.filterSelect}
          options={[
            { value: 'createdAt:desc', label: 'Created Date (Newest)' },
            { value: 'createdAt:asc', label: 'Created Date (Oldest)' },
            { value: 'dueDate:asc', label: 'Due Date (Soonest)' },
            { value: 'dueDate:desc', label: 'Due Date (Latest)' },
            { value: 'priority:desc', label: 'Priority (High to Low)' },
            { value: 'priority:asc', label: 'Priority (Low to High)' },
          ]}
        />
      </div>

      <Button
        variant="primary"
        onClick={onAddTask}
        style={styles.filterAddBtn}
      >
        Add Task
      </Button>
    </Card>
  );
};

const styles = {
  filterBarContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterInputsGroup: {
    display: 'flex',
    gap: '12px',
    flexGrow: 1,
    flexWrap: 'wrap',
  },
  filterSearchInput: {
    flexGrow: 1,
    minWidth: '160px',
    padding: '8px 12px',
  },
  filterSelect: {
    width: 'auto',
    padding: '8px 12px',
  },
  filterAddBtn: {
    width: 'auto',
    padding: '10px 20px',
    whiteSpace: 'nowrap',
  }
};

export default FilterBar;
