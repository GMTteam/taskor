import React from 'react';
import { DrawerContentComponentProps, createDrawerNavigator } from '@react-navigation/drawer';
import MainScreen from './screens/main-screen';
import SettingScreen from './screens/setting-screen';
import Sidebar from './components/sidebar';
import CategoriesScreen from './screens/categories-screen';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={(props: DrawerContentComponentProps) => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'back',
        overlayColor: '#00000000'
      }}
    >
      <Drawer.Screen name="Main" component={MainScreen} />
      <Drawer.Screen name="Setting" component={SettingScreen} />
      <Drawer.Screen name="Category" component={CategoriesScreen} />
    </Drawer.Navigator>
  );
};

export default App;
