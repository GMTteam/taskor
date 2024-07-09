import React, { useEffect } from "react";
import { Text } from "react-native";
import { HStack, Switch, useColorMode } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ThemeToggle() {
    const { colorMode, toggleColorMode } = useColorMode();
    const textColor = colorMode === 'dark' ? 'white' : 'black';

    useEffect(() => {
        const loadColorMode = async () => {
            const savedColorMode = await AsyncStorage.getItem('colorMode');
            if (savedColorMode && savedColorMode !== colorMode) {
                toggleColorMode();
            }
        };
        loadColorMode();
    }, []);

    const handleToggle = async () => {
        toggleColorMode();
        await AsyncStorage.setItem('colorMode', colorMode === 'light' ? 'dark' : 'light');
    };

    return (
        <HStack space={2} alignItems="center">
            <Text style={{ color: textColor }}>Dark</Text>
            <Switch
                isChecked={colorMode === 'light'}
                onToggle={handleToggle}
            />
            <Text style={{ color: textColor }}>Light</Text>
        </HStack>
    );
}
