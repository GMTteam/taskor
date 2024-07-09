import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Button, useColorModeValue, Icon, IconButton, Input, Center, Pressable } from 'native-base';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import useAlarmStore from '../store/datetimeStore';
import useCategoryStore from '../store/categoryStore';
import { RootStackParamList, TaskItemData } from '../store/types';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';

type TaskDetailScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

const priorityLevels = [
  { label: 'Urgent - Important', value: 'I', color: 'red.500' },
  { label: 'Not Urgent - Important', value: 'II', color: 'yellow.500' },
  { label: 'Urgent - Unimportant', value: 'III', color: 'blue.500' },
  { label: 'Not Urgent - Unimportant', value: 'IV', color: 'green.500' }
];

const TaskDetailScreen = () => {
  const route = useRoute<TaskDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { task } = route.params;
  const { alarmTimes, setAlarmTime, deleteAlarmTime } = useAlarmStore();
  const { updateTask, categories } = useCategoryStore();

  const category = categories.find(cat => cat.listTask.some(t => t.id === task.id));

  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState(task.subject);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isPriorityListVisible, setPriorityListVisibility] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(task.priorityLevel || priorityLevels[0].value);

  const scale = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

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

  const handleSave = () => {
    if (category) {
      const updatedTask: TaskItemData = {
        ...task,
        subject: editedSubject,
        description: editedDescription,
        priorityLevel: selectedPriority
      };
      updateTask(category.id, updatedTask);
    }
    setIsEditing(false);
    navigation.goBack();
  };

  const handlePriorityButtonPress = () => {
    if (isPriorityListVisible) {
      scale.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(setPriorityListVisibility)(false);
      });
    } else {
      setPriorityListVisibility(true);
      scale.value = withTiming(1, { duration: 300 });
    }
  };

  const handlePrioritySelect = (priority: string) => {
    setSelectedPriority(priority);
    handlePriorityButtonPress();
  };

  const getPriorityColor = (priority: string) => {
    const priorityItem = priorityLevels.find(item => item.value === priority);
    return priorityItem ? priorityItem.color : 'gray.500';
  };

  return (
    <Box flex={1} p={4} bg={useColorModeValue('warmGray.50', 'primary.900')}>
      <HStack justifyContent="space-between" alignItems="center" mb={4}>
        <IconButton 
            icon={<Icon as={MaterialIcons} name="arrow-back" size="lg" />} 
            onPress={() => navigation.goBack()}
        />
        <Text fontSize="2xl" fontWeight="bold">
          Task Details
        </Text>
        <IconButton
          icon={<Icon as={Feather} name="edit" size="sm" />}
          onPress={() => setIsEditing(true)}
        />
      </HStack>
      <VStack space={4}>
        {isEditing ? (
          <>
            <Input
              value={editedSubject}
              onChangeText={setEditedSubject}
              fontSize="2xl"
              fontWeight="bold"
            />
            <Input
              value={editedDescription}
              onChangeText={setEditedDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </>
        ) : (
          <>
            <Text fontSize="2xl" fontWeight="bold">
              {task.subject}
            </Text>
            <Text fontSize="md">
              {task.description}
            </Text>
          </>
        )}
        <VStack backgroundColor={useColorModeValue("gray.200", "gray.500")} borderRadius={10} mt={6}>
          <HStack alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderBottomColor={useColorModeValue("gray.300", "gray.400")} ml={2} mr={2}>
            {alarmTime ? (
              <Button mt={2} onPress={handleDeleteAlarm} size="sm" background="transparent">
                <Text mb={2} color="red.600">Delete Alarm</Text>
              </Button>
            ) : (
              <Button mt="2" onPress={showDatePicker} size="sm" background="transparent" >
                <Text mb={2} >Set Alarm</Text>
              </Button>
            )}
            <HStack mr={4}>
              {alarmTime ? (
              <Text ml={-2} fontSize="md" onPress={showDatePicker}>
                {alarmTime}
              </Text>
              ) : (
                <Icon mt="1" ml={5} as={MaterialIcons} name="alarm" size="md" onPress={showDatePicker}/>
              )}    
            </HStack>
          </HStack>
          <HStack justifyContent="space-between" alignItems="center">
            <Button mt="2" ml={2} background="transparent" onPress={handlePriorityButtonPress}>
              <Text mb={2}>Priority Level</Text>
            </Button>
            <HStack>
              <Box
                borderWidth={2}
                borderColor={getPriorityColor(selectedPriority)}
                borderRadius="full"
                p={0}
                alignItems="center"
                justifyContent="center"
                width={30}
                height={30}
              >
                <Text onPress={handlePriorityButtonPress} color={getPriorityColor(selectedPriority)}>
                  {selectedPriority}
                </Text>
              </Box>
              <Icon ml={2} as={MaterialIcons} name="arrow-drop-down" size="md" onPress={handlePriorityButtonPress} />
            </HStack>
          </HStack>
        </VStack>
      </VStack>
      {isPriorityListVisible && (
        <Animated.View style={[{ position: 'absolute', right: 16, top: 300 }, animatedStyle]}>
          <VStack space={2} mt={2} p={4} bg="gray.300" borderRadius={10} width={220}>
            {priorityLevels.map(priority => (
              <Pressable key={priority.value} onPress={() => handlePrioritySelect(priority.value)} borderBottomWidth={1} borderBottomColor={priority.color}>
                <Text ml={2} color={priority.color} >{priority.label}</Text>
              </Pressable>
            ))}
          </VStack>
        </Animated.View>
      )}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Button onPress={handleSave} mt={350} bg={useColorModeValue("gray.300", "gray.500")}  borderRadius={8}>
        <Text>Save</Text>
      </Button>
    </Box>
  );
};

export default TaskDetailScreen;
