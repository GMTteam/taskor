import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, Button, useColorModeValue, Fab, Modal, Icon, Input, Box, Pressable } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Dimensions, Animated } from 'react-native';
import useTaskStore from '../store/userTasksStore';
import AnimatedColorBox from '../components/animated-color-box';

type TaskListScreenRouteProp = RouteProp<{ TaskList: { selectedDate: string } }, 'TaskList'>;

const TaskListScreen = () => {
  const route = useRoute<TaskListScreenRouteProp>();
  const navigation = useNavigation();
  const { selectedDate } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedTask, setSelectedTask] = useState<{ task: string; description?: string } | null>(null);
  const [isDetailViewVisible, setIsDetailViewVisible] = useState(false);
  const { tasks, addTask, initializeTaskStore, removeTask } = useTaskStore();
  const screenWidth = Dimensions.get('window').width;
  const detailViewAnimated = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    initializeTaskStore();
    navigation.setOptions({ headerTitle: `${selectedDate}` });
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

  const handleTaskPress = useCallback((task) => {
    setSelectedTask(task);
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

  return (
    <AnimatedColorBox flex={1} bg={useColorModeValue('warmGray.50', 'primary.900')} w="full">
      <View flex={1} p={4} mt={1}>
        {!isDetailViewVisible ? (
          <>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Tasks:
            </Text>
            <FlatList
              data={tasks.get(selectedDate) || []}
              renderItem={({ item }) => (
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
                      {/* {item.description ? <Text mt={2}>{item.description}</Text> : null} */}
                    </Box>
                  )}
                </Pressable>
              )}
              keyExtractor={(index) => index.toString()}
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
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Task Detail
            </Text>
            <Text fontWeight="bold">Task:</Text>
            <Text mb={4}>{selectedTask?.task}</Text>
            {selectedTask?.description && (
              <>
                <Text fontWeight="bold">Description:</Text>
                <Text mb={4}>{selectedTask.description}</Text>
              </>
            )}
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                  onPress={handleBackToList}
                  variant="unstyled"
                >
                  <Text style={{ color: 'blue', fontWeight: 'bold', fontSize: 18}}>
                    Back
                  </Text>
                </Button>
                <Button
                  onPress={() => handleRemoveTask(selectedTask?.task || '')}
                  variant="unstyled"
                >
                  <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 18 }}>
                    Delete
                  </Text>
                </Button>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </AnimatedColorBox>
  );
};

export default TaskListScreen;
