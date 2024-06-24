import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, useColorModeValue, Pressable } from 'native-base';
import { Calendar, DateData } from 'react-native-calendars';
import AnimatedColorBox from '../components/animated-color-box';
import useTaskStore from '../store/userTasksStore';
import { useNavigation } from '@react-navigation/native';
import { CalendarScreenNavigationProp } from '../store/types';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const { tasks, initializeTaskStore } = useTaskStore();

  useEffect(() => {
    initializeTaskStore();
  }, [initializeTaskStore]);

  const onDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);
    navigation.navigate('TaskList', { selectedDate: day.dateString });
  }, [navigation]);

  const markedDates = {};
  tasks.forEach((taskList, date) => {
    markedDates[date] = {
      marked: true,
      dotColor: 'blue',
      customStyles: {
        container: {
          backgroundColor: selectedDate === date ? 'blue' : 'white',
        },
        text: {
          color: selectedDate === date ? 'white' : 'black',
        },
      },
    };
  });

  return (
    <AnimatedColorBox flex={1} bg={useColorModeValue('warmGray.50', 'primary.900')} w="full">
      <View flex={1}>
        <Calendar
          onDayPress={onDayPress}
          markingType={'custom'}
          markedDates={markedDates}
          renderArrow={(direction) => (
            <Text>{direction === 'left' ? '<' : '>'}</Text>
          )}
          dayComponent={({ date, state }) => {
            const dayTasks = tasks.get(date.dateString) || [];
            return (
              <Pressable onPress={() => onDayPress(date)} key={date.dateString}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black' }}>
                    {date.day}
                  </Text>
                  {dayTasks.slice(0, 3).map((task, index) => (
                    <Text key={`${date.dateString}-${index}`} style={{ fontSize: 10, color: 'gray' }}>
                      {task.task}
                    </Text>
                  ))}
                  {dayTasks.length > 3 && (
                    <Text key={`${date.dateString}-more`} style={{ fontSize: 10, color: 'gray' }}>
                      +{dayTasks.length - 3} more
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </AnimatedColorBox>
  );
};

export default CalendarScreen;
