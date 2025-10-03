import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Use environment variable in production
});

// Task types
export interface Task {
  id: number;
  title: string;
  description: string | null;
  is_done: boolean;
  priority: number;
  created_at: string;
  updated_at: string | null;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  is_done?: boolean;
  priority?: number;
}

// Task API functions
export const taskApi = {
  getTasks: async (
    status?: string,
    sortByPriority?: string,
    search?: string
  ): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (sortByPriority) params.append('sort_by_priority', sortByPriority);
    if (search) params.append('search', search);

    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (task: TaskCreate): Promise<Task> => {
    const response = await api.post('/tasks', task);
    return response.data;
  },

  updateTask: async (id: number, task: TaskUpdate): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, task);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  markTaskDone: async (id: number): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}/done`);
    return response.data;
  }
};

export default api;
