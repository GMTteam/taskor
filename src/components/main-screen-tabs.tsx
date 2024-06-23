import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'native-base';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import MainScreen from '../screens/main-screen';
import CalendarScreen from '../screens/calendar-screen';
import Masthead from '../components/masthead';
import NavBar from '../components/navbar';
import useUserStore from '../store/userStore';

const Tab = createBottomTabNavigator();

const MainScreenTabs = () => {
  const [currentTab, setCurrentTab] = React.useState<string>('Your Day');
  const { mastheadImage } = useUserStore();
  
  return (
    <>
      <Masthead
        title={currentTab} 
        image={mastheadImage ? {uri: mastheadImage} : require('../assets/masthead.png')}
      >
        <NavBar />
      </Masthead>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Your Day') {
              return <AntDesign name="home" size={size} color={color} />;
            } else if (route.name === 'Calendar') {
              return <MaterialIcons name="calendar-today" size={size} color={color} />;
            }
            return null;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarLabel: () => null,
          headerShown: false,
        })}
        screenListeners={{
          state: (e) => {
            const tabName = e.data.state.routes[e.data.state.index].name;
            setCurrentTab(tabName);
          }
        }}
      >
        <Tab.Screen name="Your Day" component={MainScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
      </Tab.Navigator>
    </>
  );
};

export default MainScreenTabs;
