import React from 'react';
import { Task, taskApi } from '@/services/api';
import { FaCheck, FaTrash, FaEdit } from 'react-icons/fa';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
  onEditTask: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdated, onEditTask }) => {
  const handleDelete = async () => {
    try {
      await taskApi.deleteTask(task.id);
      onTaskUpdated();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleToggleStatus = async () => {
    try {
      if (!task.is_done) {
        await taskApi.markTaskDone(task.id);
      } else {
        await taskApi.updateTask(task.id, { is_done: false });
      }
      onTaskUpdated();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-500';
    if (priority >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`border rounded-lg p-4 mb-2 shadow-sm ${task.is_done ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={handleToggleStatus}
            className={`p-2 rounded-full ${task.is_done ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            {task.is_done && <FaCheck />}
          </button>

          <div className="flex-1">
            <h3 className={`font-medium ${task.is_done ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-sm ${task.is_done ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Priority</span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full text-white ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEditTask(task)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
          >
            <FaEdit />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
