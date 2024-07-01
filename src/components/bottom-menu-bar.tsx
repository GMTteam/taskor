import React, { useState, useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Animated } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import MainScreen from '../screens/main-screen';
import CalendarScreen from '../screens/calendar-screen';
import TimelineScreen from '../screens/timeline-screen';
import Masthead from './masthead';
import NavBar from './navbar';
import useUserStore from '../store/userStore';

const Tab = createBottomTabNavigator();

const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign);
const AnimatedMaterialIcons = Animated.createAnimatedComponent(MaterialIcons);

const BottomMenuBar = () => {
  const [currentTab, setCurrentTab] = useState('Your Day');
  const { mastheadImage } = useUserStore();

  const yourDayScale = useRef(new Animated.Value(1)).current;
  const calendarScale = useRef(new Animated.Value(1)).current;
  const timelineScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animateIcon = (focusedTab, otherTab, otherTab1) => {
      Animated.parallel([
        Animated.timing(otherTab, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(focusedTab, {
          toValue: 1.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(otherTab1, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };

    if (currentTab === 'Your Day') {
      animateIcon(yourDayScale, calendarScale, timelineScale);
    } else if (currentTab === 'Calendar'){
      animateIcon(calendarScale, yourDayScale, timelineScale);
    } else {
      animateIcon(timelineScale, yourDayScale, calendarScale);
    }
  }, [currentTab, yourDayScale, calendarScale, timelineScale]);

  return (
    <>
      <Masthead
        title={currentTab}
        image={mastheadImage ? { uri: mastheadImage } : require('../assets/masthead.png')}
      >
        <NavBar />
      </Masthead>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let scale;
            if (route.name === 'Your Day') {
              scale = yourDayScale;
              return (
                <AnimatedAntDesign
                  name="checkcircleo"
                  size={size}
                  color={color}
                  style={{ transform: [{ scale }] }}
                />
              );
            } else if (route.name === 'Calendar') {
              scale = calendarScale;
              return (
                <AnimatedMaterialIcons
                  name="calendar-today"
                  size={size}
                  color={color}
                  style={{ transform: [{ scale }] }}
                />
              );
            } else if (route.name === 'Timeline') {
              scale = timelineScale;
              return (
                <AnimatedMaterialIcons
                  name="list"
                  size={size}
                  color={color}
                  style={{ transform: [{ scale }] }}
                />
              );
            }
            return null;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarLabel: () => null,
          tabBarStyle: {
            backgroundColor: 'transparent',
            position: 'absolute',
            borderTopWidth: 0,
            elevation: 0,
          },
          headerShown: false,
        })}
        screenListeners={{
          state: ({ data }) => {
            const tabName = data.state.routes[data.state.index].name;
            setCurrentTab(tabName);
          }
        }}
      > 
        <Tab.Screen name="Timeline" component={TimelineScreen} />
        <Tab.Screen name="Your Day" component={MainScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
      </Tab.Navigator>
    </>
  );
};

export default BottomMenuBar;
