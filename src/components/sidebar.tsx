import React, { useCallback } from 'react';
import {
  HStack,
  VStack,
  Center,
  Avatar,
  Heading,
  IconButton,
  useColorModeValue,
} from 'native-base';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import AnimatedColorBox from './animated-color-box';
import ThemeToggle from './theme-toggle';
import { Feather } from '@expo/vector-icons';
import MenuButton from './menu-button';
import  useUserStore from '../store/userStore';

const Sidebar = (props: DrawerContentComponentProps) => {
  const { state, navigation } = props;
  const currentRoute = state.routeNames[state.index];
  const { name, avatarImage } = useUserStore();

  const handlePressBackButton = useCallback(() => {
    navigation.closeDrawer();
  }, [navigation]);

  const handlePressMenuMain = useCallback(() => {
    navigation.navigate('Main');
  }, [navigation]);

  const handlePressMenuAbout = useCallback(() => {
    navigation.navigate('Setting');
  }, [navigation]);

  const handlePressCategoryMain = useCallback(() => {
    navigation.navigate('Category');
  }, [navigation]);
  

  return (
    <AnimatedColorBox
      safeArea
      flex={1}
      bg={useColorModeValue('blue.50', 'darkBlue.800')}
      p={7}
    >
      <VStack flex={1} space={2}>
        <HStack justifyContent="flex-end">
          <IconButton
            onPress={handlePressBackButton}
            borderRadius={100}
            variant="outline"
            borderColor={useColorModeValue('blue.300', 'darkBlue.700')}
            _icon={{
              as: Feather,
              name: 'chevron-left',
              size: 6,
              color: useColorModeValue('blue.800', 'darkBlue.700'),
            }}
          />
        </HStack>
        <Avatar
          source={avatarImage ? { uri: avatarImage } : require('../assets/profile-image.png')}
          size="xl"
          borderRadius={100}
          mb={6}
          borderColor="secondary.600"
          borderWidth={3}
        />
        <Heading mb={4} size="xl">
          {name}
        </Heading>

        <MenuButton
          active={currentRoute === 'Category'}
          onPress={handlePressCategoryMain}
          icon="target"
        >
          Categories
        </MenuButton>
        
        <MenuButton
          active={currentRoute === 'Main'}
          onPress={handlePressMenuMain}
          icon="inbox"
        >
          Tasks
        </MenuButton>
        
        <MenuButton
          active={currentRoute === 'Setting'}
          onPress={handlePressMenuAbout}
          icon="info"
        >
          Settings
        </MenuButton>
      </VStack>
      
      <Center>
        <ThemeToggle />
      </Center>
    </AnimatedColorBox>
  );
};

export default Sidebar;
