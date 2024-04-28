import React, { useCallback, useState } from 'react'
import { PanGestureHandlerProps } from 'react-native-gesture-handler'
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
import {
  Pressable,
  Box,
  HStack,
  useColorModeValue,
  Icon,
  Input,
  useToken,
  IconButton
} from 'native-base'
import AnimatedCheckbox from 'react-native-checkbox-reanimated'
import AnimatedTaskLabel from './animated-task-label'
import SwipableView from './swipable-view'
import { Feather, Entypo, MaterialIcons } from '@expo/vector-icons'

interface Props extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  isEditing: boolean
  isDone: boolean
  onToggleCheckbox?: () => void
  onPressLabel?: () => void
  onRemove?: () => void
  onChangeSubject?: (subject: string) => void
  onFinishEditing?: () => void
  onLongPress?: () => void
  subject: string
  isActiveDrop?: boolean
}

const TaskItem = (props: Props) => {
  const {
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
  } = props
  const highlightColor = useToken(
    'colors',
    useColorModeValue('blue.500', 'blue.400')
  )
  const boxStroke = useToken(
    'colors',
    useColorModeValue('muted.300', 'muted.500')
  )

  const checkmarkColor = useToken('colors', useColorModeValue('black', 'white'))

  const doneTextColor = useToken(
    'colors',
    useColorModeValue('darkText', 'lightText')
  )
  const activeTextColor = useToken(
    'colors',
    useColorModeValue('muted.400', 'muted.600')
  )

  const handleChangeSubject = useCallback(
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      onChangeSubject && onChangeSubject(e.nativeEvent.text)
    },
    [onChangeSubject]
  )

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
        borderColor={!isActiveDrop ? useColorModeValue('warmGray.50', 'primary.900') : useColorModeValue('primary.900', 'warmGray.50') }
        borderWidth={1}
      >
        <Box width={30} height={30} mr={2}>
          <Pressable onPress={onToggleCheckbox}>
            <AnimatedCheckbox
              highlightColor={highlightColor}
              checkmarkColor={checkmarkColor}
              boxOutlineColor={boxStroke}
              checked={isDone}
              
            />
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
          {
            isActiveDrop ? (
              <Box flexDirection={'row'}
                borderRadius={100}
                variant="outline"
                borderColor={useColorModeValue('black', 'white')}
                position={'absolute'}
                right={3}
          >
          <Icon as={<Entypo name='align-bottom' />} size="sm"/>
          <Icon as={<Entypo name='align-top' />} size="sm"/>
          </Box>
            ) : (
              <IconButton
            onPressOut={() =>  {
              onLongPress && onLongPress()
            }}
            borderRadius={100}
            variant="outline"
            borderColor={useColorModeValue('black', 'white')}
            position={'absolute'}
            right={3}
            _icon={{
              as: MaterialIcons,
              name: 'touch-app',
              size: 3,
              color: useColorModeValue('black', 'white')
            }}
          />
            )
          }
          </>
        )}
      </HStack>
    </SwipableView>
  )
}

export default TaskItem