import React, { useEffect, memo } from "react";
import { Pressable } from "react-native";
import { Box, Center, HStack, Text } from "native-base";
import Animated, {
    Easing,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    interpolateColor
  } from 'react-native-reanimated'
  
interface Props {
    strikeThrough: boolean;
    textColor: string;
    inactiveTextColor: string;
    onPress?: () => void;
    children?: React.ReactNode;
}

const AnimatedBox = Animated.createAnimatedComponent(Box)
const AnimatedText = Animated.createAnimatedComponent(Text)
const AnimatedHStack = Animated.createAnimatedComponent(HStack)

const AnimatedTaskLabel = memo((props: Props) => {
    const { strikeThrough, textColor, inactiveTextColor, onPress, children } = props;
    const hstackOffset = useSharedValue(0)
    const hstackAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: hstackOffset.value }]
        }),
        [strikeThrough]
    )

    const textColorProgress = useSharedValue(0)
    const textColorAnimatedStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            textColorProgress.value,
            [0, 1],
            [inactiveTextColor, textColor] 
        )
        }),
        [strikeThrough, textColor, inactiveTextColor] 
    )

    const strikeThroughWidth = useSharedValue(0)
    const strikeThroughAnimatedStyle = useAnimatedStyle(() => ({
        width: `${strikeThroughWidth.value * 100}%`,
        borderBottomColor: interpolateColor(
            textColorProgress.value,
            [0, 1],
            [inactiveTextColor, textColor]
        )
        }),
        [strikeThrough, textColor, inactiveTextColor]
    )

    useEffect(() => {
        const easing = Easing.out(Easing.quad)
        if (strikeThrough) {
          hstackOffset.value = withSequence(
            withTiming(4, { duration: 200, easing }),
            withTiming(0, { duration: 200, easing })
          )
          strikeThroughWidth.value = withTiming(1, { duration: 400, easing })
          textColorProgress.value = withDelay(
            1000,
            withTiming(1, { duration: 400, easing })
          )
        } else {
          strikeThroughWidth.value = withTiming(0, { duration: 400, easing })
          textColorProgress.value = withTiming(0, { duration: 400, easing })
        }
      })

    return (
        <Pressable>
            <AnimatedHStack alignItems="center" style={[hstackAnimatedStyle]}>
                <AnimatedText fontSize={19} noOfLines={1} isTruncated px={1}
                    style={[textColorAnimatedStyle]}
                >
                    {children}                    
                </AnimatedText>
                <AnimatedBox position="absolute" h={1} borderBottomWidth={1} style={[strikeThroughAnimatedStyle]}/>
            </AnimatedHStack>
        </Pressable>
    )

})

export default AnimatedTaskLabel;