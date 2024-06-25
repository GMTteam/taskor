import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Button, useColorModeValue, Icon } from 'native-base';
import { RouteProp, useRoute } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import useAlarmStore from '../store/datetimeStore';
import { RootStackParamList, TaskItemData } from '../store/types';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

type TaskDetailScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

const TaskDetailScreen = () => {
  const route = useRoute<TaskDetailScreenRouteProp>();
  const { task } = route.params;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { alarmTimes, setAlarmTime, deleteAlarmTime } = useAlarmStore();
  
  const alarmTime = alarmTimes[task.id];

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const scheduleNotification = async (time: Date) => {
    const trigger = new Date(time);
    trigger.setSeconds(0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Alarm",
        body: `It's time for your task: ${task.subject}`,
        sound: 'assets/mixkit-long-pop-2358.wav',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: [0, 250, 250, 250],
      },
      trigger,
    });
  };

  const handleConfirm = (time: Date) => {
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlarmTime(task.id, formattedTime);
    hideDatePicker();
    scheduleNotification(time);
  };

  const handleDeleteAlarm = () => {
    deleteAlarmTime(task.id);
    hideDatePicker();
  };

  return (
    <Box flex={1} p={4} bg={useColorModeValue('warmGray.50', 'primary.900')}>
      <VStack space={4}>
        <Text fontSize="2xl" fontWeight="bold">
          {task.subject}
        </Text>
        <Text fontSize="md" color={useColorModeValue('gray.800', 'gray.200')}>
          {task.description || 'No description provided.'}
        </Text>
        <HStack space={2} alignItems="center">
          <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
            Status:
          </Text>
          <Text fontSize="lg" color={useColorModeValue('green.600', 'green.400')}>
            {task.done ? 'Completed' : 'Pending'}
          </Text>
        </HStack>
        <Button 
          leftIcon={<Icon as={MaterialIcons} name="alarm" size="sm" />} 
          onPress={showDatePicker}
          colorScheme="blue"
        >
          {alarmTime ? `Change Alarm Time (${alarmTime})` : 'Set Alarm Time'}
        </Button>
        {alarmTime && (
          <Button 
            leftIcon={<Icon as={MaterialIcons} name="delete" size="sm" />} 
            onPress={handleDeleteAlarm}
            colorScheme="red"
            variant="outline"
          >
            Delete Alarm
          </Button>
        )}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onDelete={handleDeleteAlarm}
          onCancel={hideDatePicker}
        />
      </VStack>
    </Box>
  );
};

export default TaskDetailScreen;
