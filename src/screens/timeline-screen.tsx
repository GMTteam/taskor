import React, { useEffect, useState } from 'react';
import { FlatList, Box, Text, VStack, HStack, Icon, useColorModeValue, View } from 'native-base';
import { Feather } from '@expo/vector-icons';
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
    <Box key={task.id} p={3} borderRadius={8} mb={2} bg={task.done ? "gray.400" : "white"} shadow={2}>
      <HStack justifyContent="space-between">
        <Text color={task.done ? "gray.500" : "blue.500"}>{alarmTimes[task.id]}</Text>
        <Text color={task.done ? "gray.500" : "gray.600"} italic>{task.categoryName}</Text>
      </HStack>
      <Text color={task.done ? "gray.500" : "black"} fontSize={16} bold>{task.subject}</Text>
      <Text color="gray.400">{task.description}</Text>
    </Box>
  );

  const renderHourSlot = ({ item: hour, index: hourIndex }) => {
    if (!tasks[hour] || tasks[hour].length === 0) {
      return null;
    }
  
    const lastHourWithTasks = Object.keys(tasks).reverse().find(key => tasks[key].length > 0);
    const isLastHour = lastHourWithTasks === hour;
  
    return (
      <HStack key={hour} alignItems="flex-start" style={{ position: 'relative' }}>
        <VStack width="50px" alignItems="center" mt={2}>
          <Text color="gray.500" fontSize={16}>{hour}</Text>
        </VStack>
        <VStack flex={1} space={0}>
          {tasks[hour].map((task, taskIndex) => {
            const isLastTask = isLastHour && taskIndex === tasks[hour].length - 1;
            return (
              <HStack key={task.id} mb={2} opacity={1}>
                <VStack alignItems="center" mt={2} ml={1}>
                  <Icon
                    as={Feather}
                    name={task.done ? "check-circle" : "circle"}
                    size="sm"
                    color={task.done ? "green.600" : "gray.400"}
                    mt={1}
                  />
                  {!isLastTask && (
                    <View
                      style={{
                        flex: 1,
                        width: 1,
                        backgroundColor: "#A0AEC0",
                        zIndex: -1,
                        marginTop: 4,
                        marginBottom: -14,
                      }}
                    />
                  )}
                </VStack>
                <Box ml={4} flex={1}>
                  {renderTask(task)}
                </Box>
              </HStack>
            );
          })}
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
      ItemSeparatorComponent={() => <View style={{ backgroundColor: 'transparent' }} />}
    />
  );
}
