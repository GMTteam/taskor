import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, useColorModeValue, Pressable, Image } from 'native-base';
import { Calendar, DateData } from 'react-native-calendars';
import AnimatedColorBox from '../components/animated-color-box';
import useTaskStore from '../store/userTasksStore';
import { useNavigation } from '@react-navigation/native';
import { CalendarScreenNavigationProp } from '../store/types';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const { tasks, initializeTaskStore } = useTaskStore();

  const textColor = useColorModeValue('black', 'white');
  const bgColor = useColorModeValue('blueGray.200', 'primary.900');
  const disabledTextColor = useColorModeValue('gray', 'darkgray');
  const todayTextColor = useColorModeValue('red', 'lightpink');

  useEffect(() => {
    initializeTaskStore();
  }, [initializeTaskStore]);

  const onDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);
    navigation.navigate('TaskList', { selectedDate: day.dateString });
  }, [navigation]);

  const markedDates = {};
  tasks.forEach((taskList, date) => {
    const isToday = date === new Date().toISOString().split('T')[0];
    markedDates[date] = {
      marked: true,
      dotColor: 'blue',
      customStyles: {
        container: {
          backgroundColor: selectedDate === date ? 'blue' : 'transparent',
        },
        text: {
          color: selectedDate === date ? 'white' : (isToday ? todayTextColor : textColor),
        },
      },
    };
  });

  return (
    <AnimatedColorBox flex={1} bg={bgColor} w="full">
      <View flex={1}>
        <Calendar
          theme={{
            calendarBackground: 'transparent',
            textSectionTitleColor: "green",
            dayTextColor: textColor,
            todayTextColor: todayTextColor,
            monthTextColor: "green",
            textDisabledColor: disabledTextColor,
            arrowColor: textColor,
            indicatorColor: textColor,
          }}
          onDayPress={onDayPress}
          markingType={'custom'}
          markedDates={markedDates}
          renderArrow={(direction) => (
            <Text style={{ color: textColor }}>{direction === 'left' ? '<' : '>'}</Text>
          )}
          dayComponent={({ date, state }) => {
            const dayTasks = tasks.get(date.dateString) || [];
            const isToday = date.dateString === new Date().toISOString().split('T')[0];
            return (
              <Pressable onPress={() => onDayPress(date)}>
                <View style={{ alignItems: 'center', position: 'relative' }}>
                  <Text style={{ textAlign: 'center', color: state === 'disabled' ? disabledTextColor : (isToday ? todayTextColor : textColor) }}>
                    {date.day}
                  </Text>
                  {dayTasks.length > 0 && (
                    <Image
                      source={require('../assets/circle-mark.png')}
                      alt="task indicator"
                      size="xs"
                      style={{ position: 'absolute', top: -2, right: 0, width: 40, height: 25 }}
                    />
                  )}
                  {dayTasks.slice(0, 3).map((task, index) => (
                    <Text key={`${date.dateString}-${index}`} style={{ fontSize: 11, color: 'gray' }}>
                      {task.task}
                    </Text>
                  ))}
                  {dayTasks.length > 3 && (
                    <Text style={{ fontSize: 10, color: 'gray' }}>
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
