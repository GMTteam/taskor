import React, { memo, useCallback } from 'react';
import { View, Text, Box, Icon, HStack, useColorModeValue, useToken, useColorMode } from 'native-base';
import { CategoriesType } from '../store/types';
import SwipeView from './swipable-view';
import { Feather } from '@expo/vector-icons'
import AnimatedTaskLabel from './animated-task-label';

interface Props {
    item: CategoriesType,
    onRemove: (item: CategoriesType) => void
}
const CategoryItem = memo((props: Props) => {
    const {colorMode} = useColorMode()
    const color = colorMode === 'light' ? 'black' : 'white'
    const handleRemove = useCallback(() => {
        props.onRemove(props.item)
    }, [props.onRemove])

    const activeTextColor = useToken(
        'colors',
        useColorModeValue('muted.400', 'muted.600')
    )
    const checkmarkColor = useToken('colors', useColorModeValue('white', 'white'))

    const doneTextColor = useToken(
        'colors',
        useColorModeValue('darkText', 'lightText')
    )
    return (
        <SwipeView
            onSwipeLeft={handleRemove}
            backView={
                <Box
                    w="full"
                    h="full"
                    bg="red.500"
                    alignItems="flex-end"
                    justifyContent="center"
                    pr={4}
                >
                    <Icon as={<Feather name="trash-2" />} size="sm"/>
                </Box>
            }
        >
            <HStack
                alignItems="center"
                w="full"
                px={4}
                py={2}
                bg={useColorModeValue('warmGray.50', 'primary.900')}
            >
                <Icon color={color} as={<Feather name="target" />} size="sm" />
                <AnimatedTaskLabel
                    textColor={activeTextColor}
                    inactiveTextColor={doneTextColor}
                    strikeThrough={false}
                >
                    {props.item.name}
                </AnimatedTaskLabel>
            </HStack>
        </SwipeView>
    );
});

export default CategoryItem;
