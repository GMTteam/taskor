import React, { useCallback, useState } from 'react';
import { Text, useColorMode } from 'native-base';
import { Pressable } from 'react-native';
import { Center, Box, VStack, useColorModeValue } from 'native-base';
import ThemeToggle from '../components/theme-toggle';
import AnimatedCheckbox from '../components/animated-checkbok';

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
                <Box w="100px" h="100px">
                    <Pressable onPress={handlePressCheckbox}>
                        <AnimatedCheckbox checked={checked} />
                    </Pressable>
                </Box>
                <Box p={10} bg={useColorModeValue('red.500', 'yellow.500')}>
                    <Text color={colorMode === 'dark' ? 'white' : 'black'}>
                        Hello Shiva Coder
                    </Text>
                </Box>
                <ThemeToggle />
            </VStack>
        </Center>
    );
}