import React from "react";
import { Text } from "react-native";
import { HStack, Switch, useColorMode } from "native-base";

export default function ThemeToggle() {
    const { colorMode, toggleColorMode } = useColorMode();
    const textColor = colorMode === 'dark' ? 'white' : 'black';

    return (
        <HStack space={2} alignItems="center">
            <Text style={{ color: textColor }}>Dark</Text>
            <Switch
                isChecked={colorMode === 'light'}
                onToggle={toggleColorMode}
            />
            <Text style={{ color: textColor }}>Light</Text>
        </HStack>
    );
}
