import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Box,
  VStack,
  Icon,
  useColorModeValue,
  Button,
  IconButton,
  Modal,
  FormControl,
  Input,
  Text,
  Avatar,
} from 'native-base';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedColorBox from '../components/animated-color-box';
import Navbar from '../components/navbar';
import Masthead from '../components/masthead';
import useUserStore from '../store/userStore';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';


const MASTHEAD_IMAGE_KEY = 'masthead_image';
const AVATAR_IMAGE_KEY = 'avatar_image';
const NAME_KEY = 'user_name';

const SettingScreen = () => {
  const bgColor = useColorModeValue('blueGray.200', 'warmGray.900');
  const borderColor = useColorModeValue('blueGray.200', 'primary.900');
  const { setName } = useUserStore();
  const [isModalOpen, setModalOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const avatarImage = useUserStore((state) => state.avatarImage);
  const setAvatarImage = useUserStore((state) => state.setAvatarImage);
  const mastheadImage = useUserStore((state) => state.mastheadImage);
  const setMastheadImage = useUserStore((state) => state.setMastheadImage);

  const editButtonStyle = {
    bg: 'gray.300',
    borderColor: 'gray.800',
    borderWidth: 1,
    borderRadius: 12,
    shadow: 8,
    transform: [
      { translateX: 0 },
    ],
    _pressed: {
      bg: 'gray.150',
      shadow: 0,
      transform: [
        { translateX: 2 },
      ],
    },
  };

  const handleSave = async () => {
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Success',
      textBody: 'Congrats! Your name has been updated successfully.',
      button: 'close',
    })
    setName(newName);
    setModalOpen(false);
    
    try {
      await AsyncStorage.setItem(NAME_KEY, newName);
    } catch (error) {
      console.error('Failed to save user name', error);
    }
  };

  const handleSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0];
        setAvatarImage(imageUri.uri);
        await AsyncStorage.setItem(AVATAR_IMAGE_KEY, imageUri.uri);
      }
    } catch (error) {
      console.error('Failed to pick avatar image', error);
    }
  };

  const handleSelectMastheadImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });
  
      if (!result.canceled) {
        const imageUri = result.assets[0];
        setMastheadImage(imageUri.uri);
        await AsyncStorage.setItem(MASTHEAD_IMAGE_KEY, imageUri.uri);
      }
    } catch (error) {
      console.error('Failed to pick masthead image', error);
    }
  };

  return (
    <AnimatedColorBox flex={1} bg={bgColor} w="full">
      
      <Masthead
        title="Settings Yourself!"
        image={mastheadImage ? {uri:mastheadImage} : require('../assets/masthead.png')}
      >
        <Navbar />
      </Masthead>
      <IconButton
        icon={<Icon as={Feather} name="camera" size="md" color="white" />}
        position="absolute"
        top={180}
        right={2}
        borderRadius="full"
        bg="black"
        opacity={0.7}
        onPress={handleSelectMastheadImage}
      />
      
      <ScrollView
        borderTopLeftRadius="20px"
        borderTopRightRadius="20px"
        bg={borderColor}
        mt="-20px"
        pt="30px"
        p={4}
      >
        <VStack flex={1} space={6}>
          <Box alignItems="center">
            <Box position="relative">
              <Avatar
                source={avatarImage ? {uri: avatarImage} : require('../assets/profile-image.png')}
                size="120"
                borderRadius={100}
                mb={6}
                borderColor="secondary.600"
                borderWidth={3}
              />
              <IconButton
                icon={<Icon as={Feather} name="camera" size="md" color="white" />}
                position="absolute"
                bottom={6}
                right={0}
                borderRadius="full"
                bg="black"
                opacity={0.6}
                onPress={handleSelectImage}
              />
            </Box>
          </Box>

          <Button
            {...editButtonStyle}
            onPress={() => setModalOpen(true)}
          >
            <Text color="black">Edit Name</Text>
          </Button>

          <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
            <Modal.Content maxWidth="400px" borderRadius="15px" p={4}>
              <Modal.CloseButton />
              <Modal.Header>Edit Name</Modal.Header>
              <Modal.Body>
                <FormControl>
                  <FormControl.Label>Enter new name:</FormControl.Label>
                  <Input
                    value={newName}
                    onChangeText={setNewName}
                    placeholder="Your new name"
                  />
                </FormControl>
              </Modal.Body>
              <Modal.Footer>
                <AlertNotificationRoot>
                  <Button onPress={handleSave}>Save</Button>
                </AlertNotificationRoot>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </VStack>
      </ScrollView>
    </AnimatedColorBox>
  );
};

export default SettingScreen;
