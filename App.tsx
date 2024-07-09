import React, { useEffect } from 'react';
import AppContainer from './src/components/app-container';
import AppNavigator from './src/navigator/app-navigator';
import useCategoryStore from './src/store/categoryStore';
import useUserStore from './src/store/userStore';
import useTaskAlarmStore from './src/store/datetimeStore';
import { NativeBaseProvider, useColorMode, extendTheme } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const { initializeStore } = useCategoryStore();
  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  const initializeUserStore = useUserStore((state) => state.initializeUserStore);
  useEffect(() => {
    initializeUserStore();
  }, [initializeUserStore]);

  const { initializeAlarmStore } = useTaskAlarmStore();
  useEffect(() => {
    initializeAlarmStore();
  }, [initializeAlarmStore]);

  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    const loadColorMode = async () => {
      const savedColorMode = await AsyncStorage.getItem('colorMode');
      if (savedColorMode) {
        setColorMode(savedColorMode);
      }
    };
    loadColorMode();
  }, []);

  return (
    <NativeBaseProvider>
      <AppContainer>
        <AppNavigator />
      </AppContainer>
    </NativeBaseProvider>
  );
};

export default App;
