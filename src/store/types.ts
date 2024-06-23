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

export type TaskListScreenRouteProp = RouteProp<
  CalendarStackParamList,
  'TaskList'
>;

export interface CategoriesType {
    id : string,
    name : string
    listTask : TaskItemData[]
}

export interface TaskItemDetail {
  id: string;
  subject: string;
  description?: string;
  done: boolean;
}

export interface TaskItemData {
    id: string
    subject: string
    done: boolean
}


export interface CategoryType {
    id: string
    name: string
    listTask: TaskItemData[]
}

