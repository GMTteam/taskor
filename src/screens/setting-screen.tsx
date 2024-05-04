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
import { useSetting } from '../contexts/settingContext';

const MASTHEAD_IMAGE_KEY = 'masthead_image';
const PROFILE_IMAGE_KEY = 'profile_image';
const NAME_KEY = 'user_name';

const SettingScreen = () => {
  const bgColor = useColorModeValue('warmGray.50', 'warmGray.900');
  const borderColor = useColorModeValue('warmGray.50', 'primary.900');
  const { setName } = useSetting();
  const [isModalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mastheadImage, setMastheadImage] = useState<string | null>(null);
  
  useEffect(() => {
    const loadMastheadImage = async () => {
      try {
        const storedMastheadImage = await AsyncStorage.getItem(MASTHEAD_IMAGE_KEY);
        if (storedMastheadImage) {
          setMastheadImage(storedMastheadImage);
        }
      } catch (error) {
        console.error('Failed to load masthead image from storage', error);
      }
    };

    const loadProfileImage = async () => {
      try {
        const storedProfileImage = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
        if (storedProfileImage) {
          setSelectedImage(storedProfileImage);
        }
      } catch (error) {
        console.error('Failed to load profile image from storage', error);
      }
    };

    const loadUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem(NAME_KEY);
        if (storedName) {
          setNewName(storedName);
          setName(storedName);
        }
      } catch (error) {
        console.error('Failed to load user name from storage', error);
      }
    };

    loadMastheadImage();
    loadProfileImage();
    loadUserName();
  }, []);

  const handleSave = async () => {
    setName(newName);
    setModalOpen(false);

    try {
      await AsyncStorage.setItem(NAME_KEY, newName);
    } catch (error) {
      console.error('Failed to save user name', error);
    }
  };

  const handleEditMastheadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setMastheadImage(imageUri);
      try {
        await AsyncStorage.setItem(MASTHEAD_IMAGE_KEY, imageUri);
      } catch (error) {
        console.error('Failed to save masthead image', error);
      }
    }
  };

  const handleEditProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) { 
      const imageUri = result.assets[0].uri; 
      setSelectedImage(imageUri);
      
      try {
        await AsyncStorage.setItem(PROFILE_IMAGE_KEY, imageUri);
      } catch (error) {
        console.error('Failed to save profile image', error);
      }
    }
  };

  return (
    <AnimatedColorBox flex={1} bg={bgColor} w="full">
      
      <Masthead
        title="Settings Yourself!"
        image={mastheadImage ? { uri: mastheadImage } : require('../assets/masthead.png')}
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
        onPress={handleEditMastheadImage}
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
                source={selectedImage ? { uri: selectedImage } : require('../assets/profile-image.png')}
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
                onPress={handleEditProfileImage}
              />
            </Box>
          </Box>

          <Button onPress={() => setModalOpen(true)}>Edit Name</Button>

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
