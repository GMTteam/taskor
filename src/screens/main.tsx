import * as React from 'react';
import { Text, useColorMode } from 'native-base';
import { Center, Box, VStack, useColorModeValue } from 'native-base';
import ThemeToggle from '../components/theme-toggle';

export default function MainScreen() {
    const { colorMode } = useColorMode();

    return (
        <Center 
            _dark={{bg: 'blueGray.900'}}
            _light={{bg: 'blueGray.50'}}
            px={4}
            flex={1}
        >
            <VStack space={5} alignItems="center">
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