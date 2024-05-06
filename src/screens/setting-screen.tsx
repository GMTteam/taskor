import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Box,
  VStack,
  Icon,
  Image,
  useColorModeValue,
  Button,
  IconButton,
  Modal,
  FormControl,
  Input,
} from 'native-base';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedColorBox from '../components/animated-color-box';
import Navbar from '../components/navbar';
import Masthead from '../components/masthead';
import useUserStore from '../store/userStore';
import { color } from 'native-base/lib/typescript/theme/styled-system';

const MASTHEAD_IMAGE_KEY = 'masthead_image';
const AVATAR_IMAGE_KEY = 'avatar_image';
const NAME_KEY = 'user_name';

const SettingScreen = () => {
  const bgColor = useColorModeValue('warmGray.50', 'warmGray.900');
  const borderColor = useColorModeValue('warmGray.50', 'primary.900');
  const { setName } = useUserStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const avatarImage = useUserStore((state) => state.avatarImage);
  const setAvatarImage = useUserStore((state) => state.setAvatarImage);
  const mastheadImage = useUserStore((state) => state.mastheadImage);
  const setMastheadImage = useUserStore((state) => state.setMastheadImage);

  const editButtonStyle = {
    bg: 'darkblue.300',
    borderColor: 'gray.800',
    borderWidth: 0.8,
    shadow: 6,
    _pressed: {
      bg: 'gray.150',
      shadow: 0,
    },
  };
  
  const handleSave = async () => {
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
        top={230}
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
              <Image
                source={avatarImage ? {uri: avatarImage} : require('../assets/profile-image.png')}
                borderRadius="full"
                resizeMode="cover"
                w={120}
                h={120}
                alt="author"
              />
              <IconButton
                icon={<Icon as={Feather} name="camera" size="md" color="white" />}
                position="absolute"
                bottom={0}
                right={0}
                borderRadius="full"
                bg="black"
                opacity={0.8}
                onPress={handleSelectImage}
              />
            </Box>
          </Box>

          <Button {...editButtonStyle} onPress={() => setModalOpen(true) }>
            Edit Name
          </Button>

          <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Edit Name</Modal.Header>
              <Modal.Body>
                <FormControl>
                  <FormControl.Label>New Name</FormControl.Label>
                  <Input value={newName} onChangeText={setNewName} />
                </FormControl>
              </Modal.Body>
              <Modal.Footer>
                <Button flex={1} onPress={handleSave}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </VStack>
      </ScrollView>
    </AnimatedColorBox>
  );
};

export default SettingScreen;
