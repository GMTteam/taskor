import React, { useCallback } from 'react';
import { PanGestureHandlerProps } from 'react-native-gesture-handler';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
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
  VStack
} from 'native-base';
import AnimatedTaskLabel from './animated-task-label';
import SwipableView from './swipable-view';
import { Feather, MaterialIcons, Entypo } from '@expo/vector-icons';
import useAlarmStore from '../store/datetimeStore';
import CustomCheckbox from './custom-checkbox';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, TaskItemData } from '../store/types';

interface Props extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  task: TaskItemData;
  isEditing: boolean;
  onToggleCheckbox?: () => void;
  onPressLabel?: () => void;
  onRemove?: () => void;
  onChangeSubject?: (subject: string) => void;
  onFinishEditing?: () => void;
  onLongPress?: () => void;
  isActiveDrop?: boolean;
}

const TaskItem = (props: Props) => {
  const {
    task,
    isEditing,
    onToggleCheckbox,
    onPressLabel,
    onRemove,
    onChangeSubject,
    onFinishEditing,
    onLongPress,
    simultaneousHandlers,
    isActiveDrop,
  } = props;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  if (!task) {
    return null;
  }

  const { id, subject, done } = task;
  const doneTextColor = useToken('colors', useColorModeValue('darkText', 'lightText'));
  const activeTextColor = useToken('colors', useColorModeValue('muted.400', 'muted.600'));

  const handleChangeSubject = useCallback(
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      onChangeSubject && onChangeSubject(e.nativeEvent.text);
    },
    [onChangeSubject]
  );

  const { alarmTimes } = useAlarmStore();
  const alarmTime = alarmTimes[id];
  
  const handlePressItem = () => {
    navigation.navigate('TaskDetail', { task });
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
      <Pressable onPress={handlePressItem}>
        <HStack
          alignItems="center"
          w="full"
          px={4}
          py={2}
          bg={useColorModeValue('warmGray.50', 'primary.900')}
          borderColor={!isActiveDrop ? useColorModeValue('warmGray.50', 'primary.900') : useColorModeValue('primary.900', 'warmGray.50')}
          shadow={!isActiveDrop ? -1 : 6}
        >
          <Box width={30} height={30} mr={2}>
            <Pressable onPress={onToggleCheckbox}>
              <CustomCheckbox checked={done} onPress={onToggleCheckbox} />
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
                strikeThrough={done}
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
                    {alarmTime && (
                      <VStack alignItems="center" marginRight={3} marginTop={1}>
                      <Icon
                        as={MaterialIcons}
                        name="alarm"
                        size={alarmTime ? 4 : 5}
                        color="red.600"
                        mt={alarmTime ? -0 : 2.5}
                      />
                      {alarmTime && <Text fontSize="xs" mt={0} ml={-2} mr={-2}>{alarmTime}</Text>}
                    </VStack>
                    )}    
                    <IconButton
                      onPressOut={() => {
                        onLongPress && onLongPress();
                      }}
                      borderRadius={100}
                      variant="transparent"
                      borderColor={useColorModeValue('black', 'white')}
                      _icon={{
                        as: MaterialIcons,
                        name: 'dehaze',
                        size: 5,
                        color: useColorModeValue('gray.400', 'white')
                      }}
                    />
                  </HStack>
                </>
              )}
            </>
          )}
        </HStack>
      </Pressable>
    </SwipableView>
  );
};

export default TaskItem;
