import React, { useMemo } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useColorModeValue } from 'native-base';
import BottomMenuBar from '../components/bottom-menu-bar';
import SettingScreen from '../screens/setting-screen';
import Sidebar from '../components/sidebar';
import CategoriesScreen from '../screens/categories-screen';
import TaskListScreen from '../screens/tasks-list-screen';
import CalendarScreen from '../screens/calendar-screen';
import TimelineScreen from '../screens/timeline-screen';
import TaskDetailScreen from '../screens/tasks-detail-screen';
import { enableScreens } from 'react-native-screens';
import { TransitionPresets } from '@react-navigation/stack';

enableScreens(); // Improve memory usage and performance

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainDrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Main"
    drawerContent={(props) => <Sidebar {...props} />}
    screenOptions={{
      headerShown: false,
      drawerType: 'back',
      overlayColor: '#00000000',
    }}
  >
    <Drawer.Screen name="Main" component={BottomMenuBar} />
    <Drawer.Screen name="Setting" component={SettingScreen} />
    <Drawer.Screen name="Category" component={CategoriesScreen} />
    <Drawer.Screen name="Calendar" component={CalendarScreen} />
    <Drawer.Screen name="Timeline" component={TimelineScreen} />
  </Drawer.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainDrawer" component={MainDrawerNavigator} />
    <Stack.Screen
      name="TaskList"
      component={TaskListScreen}
      options={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: true,
        headerBackTitleVisible: false,
        presentation: 'modal',
        headerStyle: {
          backgroundColor: useColorModeValue('white', 'gray'),
        },
      }}
    />
    <Stack.Screen
      name="TaskDetail"
      component={TaskDetailScreen}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
        presentation: 'modal',
      }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
