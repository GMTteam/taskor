import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Icon, VStack, useColorModeValue, Fab, HStack, Pressable, Box, Text, Modal, Button, FormControl, Input } from 'native-base';
import { FlatList, Alert } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import AnimatedColorBox from '../components/animated-color-box';
import TaskList from '../components/task-list';
import shortid from 'shortid';
import useCategoryStore from '../store/categoryStore';
import { CategoriesType, CategoryType, TaskItemData } from '../store/types';
import { makeStyledComponent } from '../utils/styled';
import { View, MotiView } from 'moti';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import useAlarmStore from '../store/datetimeStore';

const StyledView = makeStyledComponent(View);

export default function MainScreen() {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const { categories, addTaskToCategory, removeTaskFromCategory, updateDragAndDrop, toggleTask } = useCategoryStore();
  const { alarmTimes, setAlarmTime } = useAlarmStore();
  const [data, setData] = useState<TaskItemData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>();
  const flatListRef = useRef<FlatList>(null);
  const [styleViewKey, setStyleViewKey] = useState<number>();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({ subject: '', description: '', alarmTime: '' });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const bgColorSelected = useColorModeValue('blueGray.300', 'primary.900');
  const bgColorUnselected = useColorModeValue('blueGray.100', 'black');
  const borderColor = useColorModeValue('blueGray.400', 'blueGray.700');

  useEffect(() => {
    if (categories && categories.length !== 0) {
      setSelectedCategory(categories[0]);
      setData(categories[0].listTask);
    } else {
      setSelectedCategory(undefined);
      setData([]);
    }
  }, []);

  
  const handleToggleTaskItem = useCallback((item: TaskItemData) => {
    setData((prevData) => {
      const newData = [...prevData];
      const index = prevData.findIndex((i) => i.id === item.id);
      newData[index] = {
        ...item,
        done: !item.done,
      };
      return newData;
    });
    selectedCategory && toggleTask(selectedCategory.id, { ...item, done: !item.done });
  }, [selectedCategory]);

  const handleChangeTaskItemSubject = useCallback((item: { id: string; subject: string; done: boolean }, newSubject: any) => {
    setData((prevData) => {
      const newData = [...prevData];
      const index = prevData.indexOf(item);
      newData[index] = {
        ...item,
        subject: newSubject,
      };
      return newData;
    });
  }, []);

  const handleFinishEditingTaskItem = useCallback((_item: any) => {
    setEditingItemId(null);
    selectedCategory && addTaskToCategory(selectedCategory?.id, _item);
  }, [selectedCategory]);

  const handlePressTaskItemLabel = useCallback((item: { id: React.SetStateAction<string | null> }) => {
    setEditingItemId(item.id);
  }, []);

  const handleRemoveItem = useCallback((item: { id: string; subject: string; done: boolean }) => {
    setData((prevData) => {
      const newData = prevData.filter((i) => i !== item);
      return newData;
    });
    selectedCategory && removeTaskFromCategory(selectedCategory?.id, item.id);
  }, [selectedCategory]);

  const handleUpdateNewList = useCallback((newList: TaskItemData[]) => {
    setData(newList);
    selectedCategory && updateDragAndDrop(selectedCategory?.id, newList);
  }, [selectedCategory]);

  const handleCategorySelect = useCallback((category: CategoriesType, index: number) => {
    setStyleViewKey(index);
    setSelectedCategory(category);
    setData(category.listTask);
  }, [categories]);

  const renderItem = (item: CategoriesType, index: number) => {
    const isSelected = selectedCategory?.id === item.id;
    
    return (
      <Pressable key={item.id} onPress={() => handleCategorySelect(item, index)}>
        <MotiView
          from={{ scale: 0.5, opacity: 0.7 }}
          animate={{ scale: isSelected ? 1 : 0.7, opacity: isSelected ? 1 : 0.6 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          <Box 
            p={2} 
            borderWidth={1} 
            borderRadius={8} 
            ml={1} 
            borderBottomWidth={isSelected ? 0 : 1} 
            borderBottomRadius={isSelected ? 0 : 8}
            bg={isSelected ? bgColorSelected : bgColorUnselected}
            borderColor={borderColor}
          >
            <Text fontSize={18} bold>
              {item.name}
            </Text>
          </Box>
        </MotiView>
      </Pressable>
    );
  };
  

  const handleShowDatePicker = () => setDatePickerVisibility(true);
  const handleHideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirmDatePicker = (time: Date) => {
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNewTask({ ...newTask, alarmTime: formattedTime });
    handleHideDatePicker();
  };

  const scheduleNotification = async (time: Date, task: { subject: string }) => {
    const trigger = new Date(time);
    trigger.setSeconds(0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Alarm',
        body: `It's time for your task: ${task.subject}`,
        sound: 'assets/mixkit-long-pop-2358.wav',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: [0, 250, 250, 250],
      },
      trigger,
    });
  };

  const handleAddNewTask = () => {
    if (newTask.subject.trim()) {
      const id = shortid.generate();
      const task = {
        id,
        subject: newTask.subject,
        description: newTask.description,
        done: false,
      };
      setData([task, ...data]);
      selectedCategory && addTaskToCategory(selectedCategory?.id, task);
      newTask.alarmTime && setAlarmTime(id, newTask.alarmTime);

      if (newTask.alarmTime) {
        const alarmDate = new Date();
        const [hours, minutes] = newTask.alarmTime.split(':').map(Number);
        alarmDate.setHours(hours);
        alarmDate.setMinutes(minutes);
        scheduleNotification(alarmDate, task);
      }

      setModalVisible(false);
      setNewTask({ subject: '', description: '', alarmTime: '' });
    } else {
      Alert.alert('Error', 'Please enter the subject of the task.');
    }
  };

  return (
    <AnimatedColorBox flex={1} bg={useColorModeValue('warmGray.50', 'primary.900')} w="full">
      <VStack flex={1} bg={useColorModeValue('blueGray.300', 'primary.900')} mt="-20px" borderTopLeftRadius="20px" borderTopRightRadius="20px" pt="20px">
        <HStack paddingLeft={1.5} paddingRight={1.5} bg={useColorModeValue('blueGray.200', 'primary.900')}>
          <FlatList ref={flatListRef} horizontal contentContainerStyle={{ width: 'auto' }} showsHorizontalScrollIndicator={false} data={categories} renderItem={({ item, index }) => renderItem(item, index)} keyExtractor={(item) => item.id} />
        </HStack>
        {categories.length !== 0 ? (
          <StyledView
            key={styleViewKey}
            w="full"
            from={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            marginTop={-1}
          ></StyledView>
        ) : (
          <Box alignSelf="center" background={'amber.400'} p={2} borderRadius={8} mt={3}>
            <Text bold fontSize={18}>Add some task or category</Text>
          </Box>
        )}
        <TaskList
          data={data}
          onToggleItem={handleToggleTaskItem}
          onChangeSubject={handleChangeTaskItemSubject}
          onFinishEditing={handleFinishEditingTaskItem}
          onPressLabel={handlePressTaskItemLabel}
          onRemoveItem={handleRemoveItem}
          editingItemId={editingItemId}
          onUpdateItem={handleUpdateNewList}
        />
      </VStack>
      <Fab
        position="absolute"
        renderInPortal={false}
        size="sm"
        icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
        colorScheme={useColorModeValue('blue', 'darkBlue')}
        bg={useColorModeValue('blue.500', 'blue.400')}
        bottom={99}
        onPress={() => {
          if (categories.length !== 0) {
            setModalVisible(true);
          } else {
            Alert.alert('Confirmation', 'You need to create a category', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'OK', onPress: () => navigation.navigate('Category') },
            ]);
          }
        }}
      />
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>New Task</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Subject</FormControl.Label>
              <Input value={newTask.subject} onChangeText={(text) => setNewTask({ ...newTask, subject: text })} />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Description</FormControl.Label>
              <Input value={newTask.description} onChangeText={(text) => setNewTask({ ...newTask, description: text })} />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Alarm Time</FormControl.Label>
              <Pressable onPress={handleShowDatePicker}>
                <Input placeholder="Set Alarm Time" value={newTask.alarmTime} isReadOnly InputRightElement={<Icon as={<MaterialIcons name="access-time" />} size={5} mr="2" />} />
              </Pressable>
              <DateTimePickerModal isVisible={isDatePickerVisible} mode="time" onConfirm={handleConfirmDatePicker} onCancel={handleHideDatePicker} />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button flex="1" onPress={handleAddNewTask}>
              Save
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </AnimatedColorBox>
  );
}
