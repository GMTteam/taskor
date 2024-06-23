import React, { useEffect, useState, useCallback } from 'react';
import { View, useColorModeValue } from 'native-base';
import { Calendar, DateData } from 'react-native-calendars';
import AnimatedColorBox from '../components/animated-color-box';
import useTaskStore from '../store/userTasksStore';
import { useNavigation } from '@react-navigation/native';
import { CalendarScreenNavigationProp } from '../store/types';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const { initializeTaskStore } = useTaskStore();

  useEffect(() => {
    initializeTaskStore();
  }, [initializeTaskStore]);

  const onDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);
    navigation.navigate('TaskList', { selectedDate: day.dateString });
  }, [navigation]);

  return (
    <AnimatedColorBox flex={1} bg={useColorModeValue('warmGray.50', 'primary.900')} w="full">
      <View flex={1}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: 'blue' }
          }}
        />
      </View>
    </AnimatedColorBox>
  );
};

export default CalendarScreen;