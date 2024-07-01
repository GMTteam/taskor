import React, { useEffect, useState } from 'react';
import { FlatList, Box, Text, VStack, HStack, Icon, useColorModeValue, View } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import useAlarmStore from '../store/datetimeStore';
import useCategoryStore from '../store/categoryStore';
import { TaskItemData } from '../store/types';

export default function TimelineScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { alarmTimes } = useAlarmStore();
  const { categories } = useCategoryStore();
  const [tasks, setTasks] = useState<{ [hour: string]: (TaskItemData & { categoryName: string })[] }>({});

  useEffect(() => {
    let allTasks: (TaskItemData & { categoryName: string })[] = [];
    categories.forEach(category => {
      const tasksWithCategory = category.listTask.map(task => ({ ...task, categoryName: category.name }));
      allTasks = [...allTasks, ...tasksWithCategory];
    });

    const groupedTasks: { [hour: string]: (TaskItemData & { categoryName: string })[] } = {};

    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = hour.toString().padStart(2, '0') + ':00';
      groupedTasks[formattedHour] = [];
    }

    allTasks.forEach(task => {
      const time = alarmTimes[task.id];
      if (time) {
        const hour = time.split(':')[0].padStart(2, '0') + ':00';
        if (groupedTasks[hour]) {
          groupedTasks[hour].push(task);
        } else {
          groupedTasks[hour] = [task];
        }
      }
    });

    setTasks(groupedTasks);
  }, [categories, alarmTimes]);

  const renderTask = (task: TaskItemData & { categoryName: string }) => (
    <Box key={task.id} p={3} borderRadius={8} mb={2} bg={task.done ? "gray.300" : "white"} shadow={2}>
        <HStack justifyContent="space-between">
            <Text color={task.done ? "gray.400" : "blue.500"}>{alarmTimes[task.id]}</Text>
            <Text color={task.done ? "gray.400" : "gray.500"} italic>{task.categoryName}</Text>
        </HStack>
        <Text color={task.done ? "gray.400" : "black"} fontSize={16} bold>{task.subject}</Text>
        <Text color="gray.400">{task.description}</Text>
    </Box>
  );

  const renderHourSlot = ({ item: hour }) => {
    if (!tasks[hour] || tasks[hour].length === 0) {
      return null;
    }

    const allTasksDone = tasks[hour].every(task => task.done);
    return (
        <HStack key={hour}>
            <VStack width="50px" alignItems="center">
                <Text color="gray.500" fontSize={16}>{hour}</Text>
                {tasks[hour].length > 0 && (
                    <View style={{ height: '100%', width: 2, backgroundColor: 'gray.300', position: 'absolute', top: 0 }} />
                )}
            </VStack>
            <VStack flex={1} space={1}>
            {tasks[hour].map((task) => (
                <HStack key={task.id} alignItems="flex-start" mb={2} opacity={allTasksDone ? 0.5 : 1}>
                    <VStack alignItems="center">
                        <Icon
                            as={AntDesign}
                            name={task.done ? "checkcircle" : "checkcircleo"}
                            size="sm"
                            color={task.done ? "green.500" : "gray.400"}
                            mt={1}
                        />
                    </VStack>
                    <Box ml={4} flex={1}>
                        {renderTask(task)}
                    </Box>
                </HStack>
            ))}
            </VStack>
        </HStack>
    );
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');

  return (
    <FlatList
      data={hours}
      renderItem={renderHourSlot}
      keyExtractor={(item) => item}
      contentContainerStyle={{ padding: 16 }}
      bg={useColorModeValue('blueGray.200', 'primary.900')}
    />
  );
}
