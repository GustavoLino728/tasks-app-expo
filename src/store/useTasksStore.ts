import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  addTask,
  deleteTask,
  getAllTasks,
  updateTask,
  TaskItem,
} from '../utils/handle-api';

type Filter = 'all' | 'completed' | 'pending';

type TaskState = {
  tasks: TaskItem[];
  loading: boolean;
  filter: Filter;

  setFilter: (filter: Filter) => void;

  fetchTasks: () => Promise<void>;
  createTask: (
    text: string,
    completed: boolean,
    dueDate: string | null
  ) => Promise<void>;
  editTask: (
    id: string,
    text: string,
    completed: boolean,
    dueDate: string | null
  ) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  clearAllTasks: () => void;
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,
      filter: 'all',

      setFilter: (filter) => set({ filter }),

      fetchTasks: async () => {
        set({ loading: true });
        await getAllTasks(
          (tasksFromApi) => set({ tasks: tasksFromApi }),
          (loading) => set({ loading })
        );
      },

      createTask: async (text, completed, dueDate) => {
        await addTask(text, completed, dueDate, (tasksFromApi) =>
          set({ tasks: tasksFromApi })
        );
      },

      editTask: async (id, text, completed, dueDate) => {
        await updateTask(id, text, completed, dueDate, (tasksFromApi) =>
          set({ tasks: tasksFromApi })
        );
      },

      removeTask: async (id) => {
        await deleteTask(id, (tasksFromApi) => set({ tasks: tasksFromApi }));
      },

      clearAllTasks: () => {
        set({ tasks: [] });
      },
    }),
    {
      name: 'tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);