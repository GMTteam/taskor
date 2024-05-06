import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStoreState {
    name: string;
    avatarImage: string;
    mastheadImage: string;
    setName: (newName: string) => void;
    setAvatarImage: (imageUri: string) => void;
    setMastheadImage: (imageUri: string) => void;
    initializeUserStore: () => void;
}

const USER_NAME_KEY = 'user_name';
const AVATAR_IMAGE_KEY = 'avatar_image';
const MASTHEAD_IMAGE_KEY = 'masthead_image';

const useUserStore = create<UserStoreState>((set) => ({
    name: 'Shiva',
    avatarImage: '',
    mastheadImage: '',

    setName: (newName: string) => {
        set({ name: newName });
        AsyncStorage.setItem(USER_NAME_KEY, newName);
    },

    setAvatarImage: (imageUri: string) => {
        set({ avatarImage: imageUri });
        AsyncStorage.setItem(AVATAR_IMAGE_KEY, imageUri);
    },

    setMastheadImage: (imageUri: string) => {
        set({ mastheadImage: imageUri });
        AsyncStorage.setItem(MASTHEAD_IMAGE_KEY, imageUri);
    },

    initializeUserStore: async () => {
        try {
            const storedName = await AsyncStorage.getItem(USER_NAME_KEY);
            const name = storedName ? storedName : 'Shiva';
            const storedAvatarImage = await AsyncStorage.getItem(AVATAR_IMAGE_KEY);
            const avatarImage = storedAvatarImage ? storedAvatarImage : '';
            const storedMastheadImage = await AsyncStorage.getItem(MASTHEAD_IMAGE_KEY);
            const mastheadImage = storedMastheadImage ? storedMastheadImage : '';
            set({ name, avatarImage, mastheadImage });
        } catch (error) {
            console.error('Failed to initialize user store', error);
        }
    },
}));

export default useUserStore;
