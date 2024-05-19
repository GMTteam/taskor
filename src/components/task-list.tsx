import React, { useCallback, useRef } from 'react'
import { AnimatePresence, View } from 'moti'
import {
  PanGestureHandlerProps,
  ScrollView
} from 'react-native-gesture-handler'
import TaskItem from './task-item'
import { makeStyledComponent } from '../utils/styled'
import  {
  NestableDraggableFlatList,
  NestableScrollContainer,
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
const StyledView = makeStyledComponent(View)
const StyledScrollView = makeStyledComponent(ScrollView)

interface TaskItemData {
  id: string
  subject: string
  done: boolean
}

interface TaskListProps {
  data: Array<TaskItemData>
  editingItemId: string | null
  onToggleItem: (item: TaskItemData) => void
  onChangeSubject: (item: TaskItemData, newSubject: string) => void
  onFinishEditing: (item: TaskItemData) => void
  onPressLabel: (item: TaskItemData) => void
  onRemoveItem: (item: TaskItemData) => void
  onUpdateItem: (item: TaskItemData[]) => void
  onDeleteAlarm?: () => void
  // showAlarmDeletedToast?: () => void
}

interface TaskItemProps
  extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  data: TaskItemData
  isEditing: boolean
  onToggleItem: (item: TaskItemData) => void
  onChangeSubject: (item: TaskItemData, newSubject: string) => void
  onFinishEditing: (item: TaskItemData) => void
  onPressLabel: (item: TaskItemData) => void
  onRemove: (item: TaskItemData) => void
  onLongPress?: () => void
  isActiveDrop? : boolean
  onDeleteAlarm?: () => void
  // showAlarmDeletedToast?: () => void
}

export const AnimatedTaskItem = (props: TaskItemProps) => {
  const {
    simultaneousHandlers,
    data,
    isEditing,
    onToggleItem,
    onChangeSubject,
    onFinishEditing,
    onPressLabel,
    onRemove,
    onLongPress,
    isActiveDrop,
    // showAlarmDeletedToast
  } = props
  const handleToggleCheckbox = useCallback(() => {
    onToggleItem(data)
  }, [data, onToggleItem])
  const handleChangeSubject = useCallback(
    (subject: string) => {
      onChangeSubject(data, subject)
    },
    [data, onChangeSubject]
  )
  const handleFinishEditing = useCallback(() => {
    onFinishEditing(data)
  }, [data, onFinishEditing])
  const handlePressLabel = useCallback(() => {
    onPressLabel(data)
  }, [data, onPressLabel])
  const handleRemove = useCallback(() => {
    onRemove(data)
  }, [data, onRemove])
  const handleLongPress = useCallback(() => {
    onLongPress && onLongPress()
  }, [data,onLongPress])
  return (
    <StyledView
      w="full"
      from={{
        opacity: 0,
        scale: 0.5,
        marginBottom: -46
      }}
      animate={{
        opacity: 1,
        scale: 1,
        marginBottom: 0
      }}
      exit={{
        opacity: 0,
        scale: 0.5,
        marginBottom: -46
      }}
    >
      <TaskItem
        taskId={data.id}
        simultaneousHandlers={simultaneousHandlers}
        subject={data.subject}
        isDone={data.done}
        isEditing={isEditing}
        onToggleCheckbox={handleToggleCheckbox}
        onChangeSubject={handleChangeSubject}
        onFinishEditing={handleFinishEditing}
        onPressLabel={handlePressLabel}
        onRemove={handleRemove}
        onLongPress={handleLongPress}
        isActiveDrop = {isActiveDrop}
        // onDeleteAlarm={showAlarmDeletedToast}
      />
    </StyledView>
  )
}

export default function TaskList(props: TaskListProps) {
  const {
    data,
    editingItemId,
    onToggleItem,
    onChangeSubject,
    onFinishEditing,
    onPressLabel,
    onRemoveItem,
    onUpdateItem,
    // showAlarmDeletedToast
  } = props
  const refScrollView = useRef(null)

  const handleUpdateDragAndDrop = (newList : TaskItemData[]) => {
    onUpdateItem(newList)
  }

  // const handleDeleteAlarm = () => {
  //   if (showAlarmDeletedToast) {
  //     showAlarmDeletedToast();
  //   }
  // };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<TaskItemData>) => {
    return (
      <ScaleDecorator
        activeScale={1.1}
      >
        <AnimatedTaskItem
            key={item.id}
            data={item}
            simultaneousHandlers={refScrollView}
            isEditing={item.id === editingItemId}
            onToggleItem={onToggleItem}
            onChangeSubject={onChangeSubject}
            onFinishEditing={onFinishEditing}
            onPressLabel={onPressLabel}
            onRemove={() => {onRemoveItem(item)}}
            onLongPress={drag}
            isActiveDrop = {isActive}
            // onDeleteAlarm={handleDeleteAlarm}
        />
      </ScaleDecorator>
    );
  };
  return (
    <NestableScrollContainer>
    <NestableDraggableFlatList
    data={data}
    onDragEnd={({ data }) => handleUpdateDragAndDrop(data)}
    keyExtractor={(item) => item.id}
    renderItem={renderItem}
  />
    </NestableScrollContainer>
  )
}