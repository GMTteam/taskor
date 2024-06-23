import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  task: string;
  description?: string;
}

interface TaskStoreState {
  tasks: Map<string, Task[]>;
  addTask: (date: string, task: string, description?: string) => void;
  removeTask: (date: string, task: string) => void;
  initializeTaskStore: () => void;
}

const TASKS_KEY = 'tasks';

const saveTasksToStorage = async (tasks: Map<string, Task[]>) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(Array.from(tasks.entries())));
  } catch (error) {
    console.error('Failed to save tasks to storage', error);
  }
};

const userTasksStore = create<TaskStoreState>((set) => ({
  tasks: new Map(),

  addTask: (date: string, task: string, description?: string) => {
    set((state) => {
      const newTasks = new Map(state.tasks);
      const dateTasks = newTasks.get(date) || [];
      newTasks.set(date, [...dateTasks, { task, description }]);
      saveTasksToStorage(newTasks);
      return { tasks: newTasks };
    });
  },

  removeTask: (date: string, task: string) => {
    set((state) => {
      const newTasks = new Map(state.tasks);
      const dateTasks = newTasks.get(date) || [];
      newTasks.set(date, dateTasks.filter(t => t.task !== task));
      saveTasksToStorage(newTasks);
      return { tasks: newTasks };
    });
  },

  initializeTaskStore: async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(TASKS_KEY);
      const tasks = storedTasks ? new Map(JSON.parse(storedTasks)) : new Map();
      set({ tasks });
    } catch (error) {
      console.error('Failed to initialize task store', error);
    }
  },
}));

export default userTasksStore;
