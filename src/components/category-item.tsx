import React, { memo, useCallback } from 'react';
import { View, Text, Box, Icon, IconButton, HStack, useColorModeValue, useToken, useColorMode } from 'native-base';
import { CategoriesType } from '../store/types';
import SwipeView from './swipable-view';
import { Feather, Entypo, MaterialIcons } from '@expo/vector-icons'
import AnimatedTaskLabel from './animated-task-label';
import { PanGestureHandlerProps } from 'react-native-gesture-handler'

interface Props extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
    item: CategoriesType,
    onRemove: (item: CategoriesType) => void
    onLongPress?: () => void
    isActiveDrop?: boolean  
}
const CategoryItem = memo((props: Props) => {
    const { item, onRemove, onLongPress, isActiveDrop, simultaneousHandlers } = props
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
            simultaneousHandlers={simultaneousHandlers}
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
                borderColor={!isActiveDrop ? useColorModeValue('warmGray.50', 'primary.900') : useColorModeValue('primary.900', 'warmGray.50') }
                borderWidth={1}
            >

                <Icon color={color} as={<Feather name="target" />} size="sm" />
                {
                    isActiveDrop ? (
                    <Box flexDirection={'row'}
                        borderRadius={100}
                        variant="outline"
                        borderColor={useColorModeValue('black', 'white')}
                        position={'absolute'}
                        right={3}
                >
                <Icon as={<Entypo name='align-bottom' />} size="sm"/>
                <Icon as={<Entypo name='align-top' />} size="sm"/>
                </Box>
                    ) : (
                    <IconButton
                    onPressOut={() =>  {
                    onLongPress && onLongPress()
                    }}
                    borderRadius={100}
                    variant="outline"
                    borderColor={useColorModeValue('black', 'white')}
                    position={'absolute'}
                    right={3}
                    _icon={{
                    as: MaterialIcons,
                    name: 'touch-app',
                    size: 4,
                    color: useColorModeValue('black', 'white')
                    }}
                />
                    )
                }
                
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
