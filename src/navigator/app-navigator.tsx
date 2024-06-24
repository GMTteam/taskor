import React, { useMemo } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import BottomMenuBar from '../components/bottom-menu-bar';
import SettingScreen from '../screens/setting-screen';
import Sidebar from '../components/sidebar';
import CategoriesScreen from '../screens/categories-screen';
import TaskListScreen from '../screens/tasks-list-screen';
import CalendarScreen from '../screens/calendar-screen';

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
  </Drawer.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainDrawer" component={MainDrawerNavigator} />
    <Stack.Screen
      name="TaskList"
      component={TaskListScreen}
      options={{
        headerShown: true,
        headerBackTitleVisible: false,
        presentation: 'modal',
      }}
    />
  </Stack.Navigator>
);

export default AppNavigator;