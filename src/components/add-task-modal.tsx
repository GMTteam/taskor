import React, { useState } from 'react';
import { Modal, Button, FormControl, Input, VStack, HStack, Text } from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subject: string, description: string, alarmTime: Date | null) => void;
}

const AddTaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [alarmTime, setAlarmTime] = useState<Date | null>(null);

  const handleConfirm = (time: Date) => {
    setAlarmTime(time);
    setDatePickerVisibility(false);
  };

  const handleSave = () => {
    onSave(subject, description, alarmTime);
    setSubject('');
    setDescription('');
    setAlarmTime(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Create New Task</Modal.Header>
        <Modal.Body>
          <VStack space={4}>
            <FormControl>
              <FormControl.Label>Subject</FormControl.Label>
              <Input value={subject} onChangeText={setSubject} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Description</FormControl.Label>
              <Input value={description} onChangeText={setDescription} />
            </FormControl>
            <HStack alignItems="center">
              <Text mr={2}>Alarm Time:</Text>
              <Button onPress={() => setDatePickerVisibility(true)}>
                {alarmTime ? alarmTime.toLocaleTimeString() : 'Set Time'}
              </Button>
            </HStack>
          </VStack>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="time"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisibility(false)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default AddTaskModal;
