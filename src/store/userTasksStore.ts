import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

interface Task {
  task: string;
  description?: string;
  notification?: {
    type: '12 Hours' | '1 Day';
    time: Date;
  };
}

interface TaskStoreState {
  tasks: Map<string, Task[]>;
  addTask: (date: string, task: string, description?: string, notification?: Task['notification']) => void;
  removeTask: (date: string, task: string) => void;
  updateTask: (date: string, oldTask: string, newTask: string, newDescription?: string) => void;
  setTaskNotification: (date: string, task: string, notification: Task['notification']) => void;
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

const scheduleNotification = async (task: string, notification: Task['notification']) => {
  let trigger = (notification.time.getTime() - Date.now()) / 1000; // Convert milliseconds to seconds

  if (notification.type === '12 Hours') {
    trigger -= 12 * 60 * 60;
  } else if (notification.type === '1 Day') {
    trigger -= 24 * 60 * 60;
  }

  if (trigger > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task Reminder',
        body: `It's ${notification.type} left before: ${task} at ${notification.time}` ,
      },
      trigger: {
        seconds: trigger,
      },
    });
  }
};

const userTasksStore = create<TaskStoreState>((set) => ({
  tasks: new Map(),

  addTask: (date: string, task: string, description?: string, notification?: Task['notification']) => {
    set((state) => {
      const newTasks = new Map(state.tasks);
      const dateTasks = newTasks.get(date) || [];
      const newTask = { task, description, notification };

      if (notification) {
        scheduleNotification(task, notification);
      }

      newTasks.set(date, [...dateTasks, newTask]);
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

  updateTask: (date: string, oldTask: string, newTask: string, newDescription?: string) => {
    set((state) => {
      const newTasks = new Map(state.tasks);
      const dateTasks = newTasks.get(date) || [];
      const taskIndex = dateTasks.findIndex(t => t.task === oldTask);
      if (taskIndex > -1) {
        dateTasks[taskIndex] = { task: newTask, description: newDescription };
        newTasks.set(date, [...dateTasks]);
      }
      saveTasksToStorage(newTasks);
      return { tasks: newTasks };
    });
  },

  setTaskNotification: (date: string, task: string, notification: Task['notification']) => {
    set((state) => {
      const newTasks = new Map(state.tasks);
      const dateTasks = newTasks.get(date) || [];
      const taskIndex = dateTasks.findIndex(t => t.task === task);
      if (taskIndex > -1) {
        dateTasks[taskIndex].notification = notification;
        scheduleNotification(task, notification);
        newTasks.set(date, [...dateTasks]);
      }
      saveTasksToStorage(newTasks);
      return { tasks: newTasks };
    });
  },

  initializeTaskStore: async () => {
    try {
      const tasksString = await AsyncStorage.getItem(TASKS_KEY);
      if (tasksString) {
        set({ tasks: new Map(JSON.parse(tasksString)) });
      }
    } catch (error) {
      console.error('Failed to load tasks from storage', error);
    }
  },
}));

export default userTasksStore;
