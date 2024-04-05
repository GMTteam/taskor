import React, { useCallback, useState } from 'react';
import { Text, useColorMode } from 'native-base';
import { Pressable } from 'react-native';
import { Center, Box, VStack, useColorModeValue } from 'native-base';
import ThemeToggle from '../components/theme-toggle';
import TaskItem from '../components/task-item';

export default function MainScreen() {
    const [checked, setChecked] = useState(false);
    const handlePressCheckbox = useCallback(() => {
        setChecked(prev => !prev);
    }, []);

    const { colorMode } = useColorMode();

    return (
        <Center 
            _dark={{bg: 'blueGray.900'}}
            _light={{bg: 'blueGray.50'}}
            px={4}
            flex={1}
        >
            <VStack space={5} alignItems="center">
                <TaskItem isDone={checked} onToggleCheckbox={handlePressCheckbox}/>
                <ThemeToggle />
            </VStack>
        </Center>
    );
}