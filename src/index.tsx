import React from 'react';
import { DrawerContentComponentProps, createDrawerNavigator } from '@react-navigation/drawer';
import MainScreen from './screens/main-screen';
import AboutScreen from './screens/about-screen';
import Sidebar from './components/sidebar';
import CategoriesScreen from './screens/categories-screen';

const Drawer = createDrawerNavigator();

const App = () => {
  const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    return <Sidebar {...props} />;
  };

  return (
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerType: 'back',
        overlayColor: '#00000000'
      }}
    >
      <Drawer.Screen name="Main" component={MainScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen name="Category" component={CategoriesScreen} />
    </Drawer.Navigator>
  );
};

export default App;
