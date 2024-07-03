import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, Button, useColorModeValue, Fab, Modal, Icon, Input, Box, Pressable, VStack, IconButton, HStack, Center } from 'native-base';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Dimensions, Animated } from 'react-native';
import useTaskStore from '../store/userTasksStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import AnimatedColorBox from '../components/animated-color-box';

type TaskListScreenRouteProp = RouteProp<{ TaskList: { selectedDate: string } }, 'TaskList'>;

const TaskListScreen = () => {
  const route = useRoute<TaskListScreenRouteProp>();
  const navigation = useNavigation();
  const { selectedDate } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedTask, setSelectedTask] = useState<{ task: string; description?: string; notification?: { type: '12hours' | '1day'; time: Date } } | null>(null);
  const [isDetailViewVisible, setIsDetailViewVisible] = useState(false);
  const { tasks, addTask, initializeTaskStore, removeTask, updateTask, setTaskNotification } = useTaskStore();
  const screenWidth = Dimensions.get('window').width;
  const detailViewAnimated = useRef(new Animated.Value(screenWidth)).current;
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [notificationType, setNotificationType] = useState<'12 Hours' | '1 Day'>('12 Hours');

  useEffect(() => {
    initializeTaskStore();
    navigation.setOptions({ headerTitle: `${selectedDate}`});
  }, [initializeTaskStore, navigation, selectedDate]);

  const handleRemoveTask = useCallback((task: string) => {
    removeTask(selectedDate, task);
    handleBackToList();
  }, [removeTask, selectedDate]);

  const handleAddTask = useCallback(() => {
    if (newTask.trim()) {
      addTask(selectedDate, newTask, newTaskDescription);
      setNewTask('');
      setNewTaskDescription('');
      setModalVisible(false);
    }
  }, [newTask, newTaskDescription, addTask, selectedDate]);

  const handleEditTask = useCallback(() => {
    if (selectedTask) {
      updateTask(selectedDate, selectedTask.task, newTask, newTaskDescription);
      setSelectedTask({ task: newTask, description: newTaskDescription });
      setEditModalVisible(false);
      handleBackToList();
    }
  }, [selectedDate, selectedTask, newTask, newTaskDescription, updateTask]);

  const handleTaskPress = useCallback((task) => {
    setSelectedTask(task);
    setNewTask(task.task);
    setNewTaskDescription(task.description || '');
    setIsDetailViewVisible(true);
    Animated.timing(detailViewAnimated, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [detailViewAnimated]);

  const handleBackToList = useCallback(() => {
    Animated.timing(detailViewAnimated, {
      toValue: screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsDetailViewVisible(false);
      setSelectedTask(null);
    });
  }, [screenWidth, detailViewAnimated]);

  const handleSetNotification = useCallback(() => {
    if (selectedTask) {
      setTaskNotification(selectedDate, selectedTask.task, {
        time: notificationTime,
        type: notificationType,
      });
      setNotificationModalVisible(false);
    }
  }, [selectedTask, selectedDate, notificationTime, notificationType, setTaskNotification]);

  return (
    <AnimatedColorBox flex={1} bg={useColorModeValue('warmGray.50', 'primary.900')} w="full">
      <View flex={1} p={4} mt={0} bg={useColorModeValue('warmGray.50', 'primary.900')}>
        {!isDetailViewVisible ? (
          <>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Tasks:
            </Text>
            <FlatList
              data={tasks.get(selectedDate) || []}
              renderItem={({ item, index }) => (
                <Pressable onPress={() => handleTaskPress(item)}>
                  {({ isPressed }) => (
                    <Box
                      py={4}
                      px={4}
                      mb={4}
                      borderRadius="md"
                      bg={useColorModeValue('white', 'gray.700')}
                      shadow={2}
                      style={{
                        transform: [{ scale: isPressed ? 0.96 : 1 }],
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}
                    >
                      <Text fontWeight="bold">{item.task}</Text>
                    </Box>
                  )}
                </Pressable>
              )}
              keyExtractor={(item, index) => `${selectedDate}-${index}`}
              ListEmptyComponent={<Text>No tasks for this day.</Text>}
            />
            <Fab
              position="absolute"
              renderInPortal={false}
              size="sm"
              icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
              colorScheme={useColorModeValue('blue', 'darkBlue')}
              bg={useColorModeValue('blue.500', 'blue.400')}
              onPress={() => setModalVisible(true)}
            />
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
              <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Add Task</Modal.Header>
                <Modal.Body>
                  <Input
                    placeholder="Enter task"
                    value={newTask}
                    onChangeText={setNewTask}
                    mb={2}
                  />
                  <Input
                    placeholder="Enter description (optional)"
                    value={newTaskDescription}
                    onChangeText={setNewTaskDescription}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button onPress={handleAddTask}>Add</Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </>
        ) : (
          <Animated.View style={{ transform: [{ translateX: detailViewAnimated }], flex: 1 }}>
            <HStack justifyContent="space-between">
              <Text fontSize="lg" fontWeight="bold" mb={4}>
                Task Detail
              </Text>
              <HStack>
                <IconButton 
                  icon={<Icon as={Feather} name="edit" size="md" />}
                  onPress={() => setEditModalVisible(true)}
                />
                
              </HStack>
            </HStack>
            <Text fontWeight="bold">Task:</Text>
            <Text mb={4}>{selectedTask?.task}</Text>
            {selectedTask?.description && (
              <>
                <Text fontWeight="bold">Description:</Text>
                <Text mb={4}>{selectedTask.description}</Text>
              </>
            )}
            <VStack backgroundColor={useColorModeValue("gray.300", "gray.600")} borderRadius={10} mt={6}>
              <HStack alignItems="center" justifyContent="space-between">
                <Button ml={2} mt={2} background="transparent" onPress={() => setNotificationModalVisible(true)}>
                  <Text mb={2}>
                    {selectedTask?.notification ? notificationTime.toLocaleString() : 'Set Notification'}
                  </Text>
                </Button>
                <HStack mr={4}>
                  {selectedTask?.notification ? (
                    <Text mr={2} onPress={() => setNotificationModalVisible(true)}>
                      {notificationType === '12 Hours' ? '12 Hours before' : '1 Day before'}
                    </Text>
                  ) : (
                    <Icon
                      as={Feather} name='clock' size="md" onPress={() => setNotificationModalVisible(true)}
                    />
                  )}
                </HStack>
              </HStack>
            </VStack>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <VStack mb={4} backgroundColor={useColorModeValue("gray.300", "gray.600")} borderRadius={10}  >
                <Button mb={2} ml={2} mr={2} onPress={() => handleRemoveTask(selectedTask!.task)} background="transparent" borderBottomWidth={1} borderBottomColor="gray.400">
                  <Text color="red.600" mt={2} mb={2}>
                    Delete Task
                  </Text>
                </Button>
                <Button onPress={handleBackToList} background="transparent" >
                  <Text color="black" mb={2}>
                    Back to List
                  </Text>
                </Button>
              </VStack>
            </View>
            <Modal isOpen={editModalVisible} onClose={() => setEditModalVisible(false)}>
              <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Edit Task</Modal.Header>
                <Modal.Body>
                  <Input
                    placeholder="Edit task"
                    value={newTask}
                    onChangeText={setNewTask}
                    mb={2}
                  />
                  <Input
                    placeholder="Edit description (optional)"
                    value={newTaskDescription}
                    onChangeText={setNewTaskDescription}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button onPress={handleEditTask}>Save</Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
            <Modal isOpen={notificationModalVisible} onClose={() => setNotificationModalVisible(false)}>
              <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Set Notification</Modal.Header>
                <Modal.Body>
                  <DateTimePicker
                    value={notificationTime}
                    mode="datetime"
                    display="default"
                    onChange={(event, date) => date && setNotificationTime(date)}
                  />
                  <VStack mt={4}>
                    <Pressable onPress={() => setNotificationType('12 Hours')}>
                      <HStack alignItems="center">
                        <Icon as={Feather} name={notificationType === '12 Hours' ? 'check-circle' : 'circle'} size="sm" />
                        <Text ml={2}>Notify 12 Hours before</Text>
                      </HStack>
                    </Pressable>
                    <Pressable onPress={() => setNotificationType('1 Day')} mt={2}>
                      <HStack alignItems="center">
                        <Icon as={Feather} name={notificationType === '1 Day' ? 'check-circle' : 'circle'} size="sm" />
                        <Text ml={2}>Notify 1 Day before</Text>
                      </HStack>
                    </Pressable>
                  </VStack>
                </Modal.Body>
                <Modal.Footer>
                  <Button onPress={handleSetNotification}>Save</Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Animated.View>
        )}
      </View>
    </AnimatedColorBox>
  );
};

export default TaskListScreen;
