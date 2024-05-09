import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TaskAlarmStoreState {
  alarmTimes: Record<string, string>; // Lưu thời gian báo thức theo ID của TaskItem
  setAlarmTime: (taskId: string, time: string) => void;
  deleteAlarmTime: (taskId: string) => void; // Thêm chức năng xoá
  initializeAlarmStore: () => void;
}

const ALARM_TIME_KEY = 'alarm_times'; // Key để lưu trữ thời gian báo thức

const useTaskAlarmStore = create<TaskAlarmStoreState>((set) => ({
  alarmTimes: {},

  setAlarmTime: (taskId: string, time: string) => {
    set((state) => {
      const newAlarmTimes = { ...state.alarmTimes, [taskId]: time };
      AsyncStorage.setItem(ALARM_TIME_KEY, JSON.stringify(newAlarmTimes)); // Lưu vào AsyncStorage
      return { alarmTimes: newAlarmTimes };
    });
  },

  deleteAlarmTime: (taskId: string) => {
    set((state) => {
      // Tạo một bản sao của alarmTimes và xóa thời gian báo thức của taskId
      const newAlarmTimes = { ...state.alarmTimes };
      delete newAlarmTimes[taskId];

      // Lưu lại vào AsyncStorage
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
