import React, { useCallback, useState, useEffect } from 'react';
import { PanGestureHandlerProps } from 'react-native-gesture-handler';
import { NativeSyntheticEvent, TextInputChangeEventData, Alert, Platform } from 'react-native';
import {
  Pressable,
  Box,
  HStack,
  useColorModeValue,
  Icon,
  Input,
  useToken,
  IconButton,
  Text,
  VStack,
  Button
} from 'native-base';
import AnimatedTaskLabel from './animated-task-label';
import SwipableView from './swipable-view';
import { Feather, Entypo, MaterialIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import useAlarmStore from '../store/datetimeStore';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import CustomCheckbox from './custom-checkbox';

interface Props extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  taskId: string;
  isEditing: boolean;
  isDone: boolean;
  onToggleCheckbox?: () => void;
  onPressLabel?: () => void;
  onRemove?: () => void;
  onChangeSubject?: (subject: string) => void;
  onFinishEditing?: () => void;
  onLongPress?: () => void;
  subject: string;
  isActiveDrop?: boolean;
  onDeleteAlarm?: () => void;
}

const TaskItem = (props: Props) => {
  const {
    taskId,
    isEditing,
    isDone,
    onToggleCheckbox,
    subject,
    onPressLabel,
    onRemove,
    onChangeSubject,
    onFinishEditing,
    onLongPress,
    simultaneousHandlers,
    isActiveDrop
  } = props;

  const highlightColor = useToken(
    'colors',
    useColorModeValue('blue.500', 'blue.400')
  );

  const boxStroke = useToken(
    'colors',
    useColorModeValue('muted.300', 'muted.500')
  );

  const checkmarkColor = useToken('colors', useColorModeValue('black', 'white'));

  const doneTextColor = useToken(
    'colors',
    useColorModeValue('darkText', 'lightText')
  );

  const activeTextColor = useToken(
    'colors',
    useColorModeValue('muted.400', 'muted.600')
  );

  const handleChangeSubject = useCallback(
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      onChangeSubject && onChangeSubject(e.nativeEvent.text);
    },
    [onChangeSubject]
  );

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { alarmTimes, setAlarmTime, deleteAlarmTime } = useAlarmStore();
  const alarmTime = alarmTimes[taskId];

  const backgroundColor = alarmTime ? 'rgba(255, 0, 0, 0.5)' : 'transparent';

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const scheduleNotification = async (time: Date) => {
    const trigger = new Date(time);
    trigger.setSeconds(0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Alarm",
        body: `It's time for your task: ${subject}`,
        sound: 'assets/mixkit-long-pop-2358.wav',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: [0, 250, 250, 250],
      },
      trigger,
    });
  };

  const handleConfirm = (time: Date) => {
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlarmTime(taskId, formattedTime);
    hideDatePicker();
    scheduleNotification(time);
  };

  const handleDeleteAlarm = () => {
    deleteAlarmTime(taskId);
    hideDatePicker();
    if (props.onDeleteAlarm) {
      props.onDeleteAlarm();
    }
  };

  return (
    <SwipableView
      simultaneousHandlers={simultaneousHandlers}
      onSwipeLeft={onRemove}
      backView={
        <Box
          w="full"
          h="full"
          bg="red.500"
          alignItems="flex-end"
          justifyContent="center"
          pr={4}
        >
          <Icon color="white" as={<Feather name="trash-2" />} size="sm" />
        </Box>
      }
    >
      <HStack
        alignItems="center"
        w="full"
        px={4}
        py={2}
        bg={useColorModeValue('warmGray.50', 'primary.900')}
        borderColor={!isActiveDrop ? useColorModeValue('warmGray.50', 'primary.900') : useColorModeValue('primary.900', 'warmGray.50')}
        borderWidth={1}
      >
        <Box width={30} height={30} mr={2}>
          <Pressable onPress={onToggleCheckbox}>
            <CustomCheckbox checked={isDone} onPress={onToggleCheckbox} />
          </Pressable>
        </Box>
        {isEditing ? (
          <Input
            placeholder="Task"
            value={subject}
            variant="unstyled"
            fontSize={19}
            px={1}
            py={0}
            autoFocus
            blurOnSubmit
            onChange={handleChangeSubject}
            onBlur={onFinishEditing}
          />
        ) : (
          <>
            <AnimatedTaskLabel
              textColor={activeTextColor}
              inactiveTextColor={doneTextColor}
              strikeThrough={isDone}
              onPress={onPressLabel}
            >
              {subject}
            </AnimatedTaskLabel>
            {isActiveDrop ? (
              <Box
                flexDirection={'row'}
                borderRadius={100}
                variant="outline"
                borderColor={useColorModeValue('black', 'white')}
                position={'absolute'}
                right={3}
              >
                <Icon as={<Entypo name='align-bottom' />} size="sm" />
                <Icon as={<Entypo name='align-top' />} size="sm" />
              </Box>
            ) : (
              <>
                <HStack position="absolute" right={3} space={2}>
                  <IconButton
                    onPressOut={showDatePicker}
                    borderRadius={100}
                    variant="outline"
                    borderColor={useColorModeValue('black', 'white')}
                    bg={backgroundColor}
                    size={10}
                  >
                    <VStack alignItems="center">
                      <Icon
                        as={MaterialIcons}
                        name="alarm"
                        size={alarmTime ? 3 : 5}
                        color={useColorModeValue('black', 'white')}
                        mt={alarmTime ? -2 : -0.5}
                      />
                      {alarmTime && <Text fontSize="xs" mt={0} ml={-2} mr={-2}>{alarmTime}</Text>}
                    </VStack>
                  </IconButton>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="time"
                    textColor='black'
                    onConfirm={handleConfirm}
                    onDelete={handleDeleteAlarm}
                    onCancel={hideDatePicker}
                  />
                  <IconButton
                    onPressOut={() => {
                      onLongPress && onLongPress();
                    }}
                    borderRadius={100}
                    variant="outline"
                    borderColor={useColorModeValue('black', 'white')}
                    _icon={{
                      as: MaterialIcons,
                      name: 'touch-app',
                      size: 5,
                      color: useColorModeValue('black', 'white')
                    }}
                  />
                </HStack>
              </>
            )}
          </>
        )}
      </HStack>
    </SwipableView>
  );
};

export default TaskItem;