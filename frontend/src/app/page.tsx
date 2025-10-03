'use client';

import { useState, useEffect } from 'react';
import { Task, taskApi } from '@/services/api';
import TaskItem from '@/components/TaskItem';
import TaskForm from '@/components/TaskForm';
import { FaPlus, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, searchQuery, sortDirection]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await taskApi.getTasks(
        statusFilter !== 'all' ? statusFilter : undefined,
        sortDirection,
        searchQuery || undefined
      );
      setTasks(fetchedTasks);
      setError('');
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSort = () => {
    if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortDirection(undefined);
    } else {
      setSortDirection('asc');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    setShowForm(false);
    setEditingTask(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const getStatusButtonClass = (status: string) => {
    return statusFilter === status
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800">TODO Task Manager</h1>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <FaPlus className="mr-2" />
              Add Task
            </button>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <div className="flex space-x-1">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-md text-sm ${getStatusButtonClass('all')}`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('done')}
                  className={`px-3 py-1 rounded-md text-sm ${getStatusButtonClass('done')}`}
                >
                  Done
                </button>
                <button
                  onClick={() => setStatusFilter('undone')}
                  className={`px-3 py-1 rounded-md text-sm ${getStatusButtonClass('undone')}`}
                >
                  Undone
                </button>
              </div>
            </div>

            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              <button
                onClick={handleToggleSort}
                className={`p-2 rounded-md ${
                  sortDirection ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
                title="Sort by priority"
              >
                {sortDirection === 'asc' ? (
                  <FaSortAmountUp />
                ) : sortDirection === 'desc' ? (
                  <FaSortAmountDown />
                ) : (
                  <FaSortAmountDown className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {showForm && (
            <div className="mb-6">
              <TaskForm
                task={editingTask || undefined}
                onSubmit={handleTaskUpdated}
                onCancel={handleCancelForm}
              />
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 p-3 rounded-md text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-3 text-gray-600">Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No tasks found</p>
                {(statusFilter !== 'all' || searchQuery) && (
                  <p className="text-sm text-gray-400 mt-1">
                    Try changing your filters
                  </p>
                )}
              </div>
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onTaskUpdated={handleTaskUpdated}
                  onEditTask={handleEditTask}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
