import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TaskAlarmStoreState {
  alarmTimes: Record<string, string>;
  setAlarmTime: (taskId: string, time: string) => void;
  deleteAlarmTime: (taskId: string) => void;
  initializeAlarmStore: () => void;
}

const ALARM_TIME_KEY = 'alarm_times';

const useTaskAlarmStore = create<TaskAlarmStoreState>((set) => ({
  alarmTimes: {},

  setAlarmTime: (taskId: string, time: string) => {
    set((state) => {
      const newAlarmTimes = { ...state.alarmTimes, [taskId]: time };
      AsyncStorage.setItem(ALARM_TIME_KEY, JSON.stringify(newAlarmTimes));
      return { alarmTimes: newAlarmTimes };
    });
  },

  deleteAlarmTime: (taskId: string) => {
    set((state) => {
     
      const newAlarmTimes = { ...state.alarmTimes };
      delete newAlarmTimes[taskId];

     
      AsyncStorage.setItem(ALARM_TIME_KEY, JSON.stringify(newAlarmTimes));

      return { alarmTimes: newAlarmTimes };
    });
  },

  initializeAlarmStore: async () => {
    try {
      const storedAlarmTimes = await AsyncStorage.getItem(ALARM_TIME_KEY);
      const alarmTimes = storedAlarmTimes ? JSON.parse(storedAlarmTimes) : {};
      set({ alarmTimes });
    } catch (error) {
      console.error('Failed to initialize alarm store', error);
    }
  },
}));

export default useTaskAlarmStore;
