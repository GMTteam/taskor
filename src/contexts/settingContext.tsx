import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingContextProps {
  name: string;
  setName: (name: string) => void;
  profileImage: string | null;
  setProfileImage: (image: string) => void;
  mastheadImage: string | null;
  setMastheadImage: (image: string) => void;
}

const SettingContext = createContext<SettingContextProps | undefined>(undefined);

export const useSetting = () => {
  const context = useContext(SettingContext);
  if (!context) {
    throw new Error('useSetting must be used within a SettingProvider');
  }
  return context;
};

const NAME_KEY = 'user_name';
const PROFILE_IMAGE_KEY = 'profile_image';
const MASTHEAD_IMAGE_KEY = 'masthead_image';

export const SettingProvider = ({ children }: { children: React.ReactNode }) => {
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [mastheadImage, setMastheadImage] = useState<string | null>(null);

  useEffect(() => {
    const loadUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem(NAME_KEY);
        if (storedName) {
          setName(storedName);
        }
      } catch (error) {
        console.error('Failed to load user name from storage', error);
      }
    };

    const loadProfileImage = async () => {
      try {
        const storedImage = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
        if (storedImage) {
          setProfileImage(storedImage);
        }
      } catch (error) {
        console.error('Failed to load profile image from storage', error);
      }
    };

    const loadMastheadImage = async () => {
      try {
        const storedImage = await AsyncStorage.getItem(MASTHEAD_IMAGE_KEY);
        if (storedImage) {
          setMastheadImage(storedImage);
        }
      } catch (error) {
        console.error('Failed to load masthead image from storage', error);
      }
    };

    loadMastheadImage();
    loadUserName();
    loadProfileImage();
  }, []);

  useEffect(() => {
    const saveUserName = async () => {
      try {
        await AsyncStorage.setItem(NAME_KEY, name);
      } catch (error) {
        console.error('Failed to save user name', error);
      }
    };

    const saveProfileImage = async () => {
      try {
        if (profileImage) {
          await AsyncStorage.setItem(PROFILE_IMAGE_KEY, profileImage);
        }
      } catch (error) {
        console.error('Failed to save profile image', error);
      }
    };

    const saveMastheadImage = async () => {
      try {
        if (mastheadImage) {
          await AsyncStorage.setItem(MASTHEAD_IMAGE_KEY, mastheadImage);
        }
      } catch (error) {
        console.error('Failed to save masthead image', error);
      }
    }

    if (name) {
      saveUserName();
    }

    if (profileImage) {
      saveProfileImage();
    }

    if (mastheadImage) {
      saveMastheadImage();
    }

  }, [name, profileImage, mastheadImage]);

  return (
    <SettingContext.Provider
      value={{
        name,
        setName,
        profileImage,
        setProfileImage,
        mastheadImage,
        setMastheadImage,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};
