import React, { useState, useEffect } from 'react';
import { Task, TaskCreate, TaskUpdate, taskApi } from '@/services/api';

interface TaskFormProps {
  task?: Task;
  onSubmit: () => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(5);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      if (task) {
        const taskUpdate: TaskUpdate = {
          title,
          description: description || null,
          priority
        };
        await taskApi.updateTask(task.id, taskUpdate);
      } else {
        const newTask: TaskCreate = {
          title,
          description: description || undefined,
          priority
        };
        await taskApi.createTask(newTask);
      }

      resetForm();
      onSubmit();
    } catch (error) {
      console.error('Failed to save task:', error);
      setError('Failed to save task. Please try again.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(5);
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {task ? 'Edit Task' : 'Add New Task'}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 mb-4 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task description"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority: {priority}
          </label>
          <input
            id="priority"
            type="range"
            min="1"
            max="10"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low (1)</span>
            <span>High (10)</span>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {task ? 'Update' : 'Add'} Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
