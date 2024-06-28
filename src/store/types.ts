import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type CalendarStackParamList = {
  Calendar: undefined;
  TaskList: { selectedDate: string };
};

export type CalendarScreenNavigationProp = StackNavigationProp<
  CalendarStackParamList,
  'Calendar'
>;

export type TaskScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type TaskListScreenRouteProp = RouteProp<
  CalendarStackParamList,
  'TaskList'
>;

export type RootStackParamList = {
  Home: undefined;
  TaskDetail: { task: TaskItemData };
};

export type TaskDetailScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;
export type TaskDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TaskDetail'
>;

export interface TaskItemData {
  id: string;
  subject: string;
  description?: string;
  priorityLevel?: string;
  done: boolean;
}

export interface CategoriesType {
  id: string;
  name: string;
  listTask: TaskItemData[];
}

export interface CategoryType {
  id: string;
  name: string;
  listTask: TaskItemData[];
}
