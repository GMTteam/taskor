import React from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import  { Entypo } from '@expo/vector-icons';

const SIZE = 30;
const BORDER_WIDTH = 2;
const TEMP_SCALE = 1.5; // Giá trị tạm thời để phóng to dấu tick

const CustomCheckbox = ({ checked, onPress }) => {
  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(BORDER_WIDTH);
  const opacity = useSharedValue(0);
  const tempScaleValue = useSharedValue(TEMP_SCALE); // Giá trị tạm thời phóng to

  React.useEffect(() => {
    if (checked) {
      // Phóng to và hiện dấu tick
      scale.value = withTiming(tempScaleValue.value, { duration: 150, easing: Easing.ease });
      borderWidth.value = withTiming(0, { duration: 150, easing: Easing.ease });
      opacity.value = withTiming(1, { duration: 150, easing: Easing.ease }, () => {
        // Sau khi hiển thị xong, thu nhỏ lại
        scale.value = withTiming(1, { duration: 150, easing: Easing.ease });
      });
    } else {
      // Thu nhỏ và ẩn dấu tick
      scale.value = withTiming(tempScaleValue.value, { duration: 150, easing: Easing.ease });
      opacity.value = withTiming(0, { duration: 150, easing: Easing.ease }, () => {
        // Sau khi ẩn xong, phóng to lại ban đầu
        scale.value = withTiming(1, { duration: 150, easing: Easing.ease });
        borderWidth.value = withTiming(BORDER_WIDTH, { duration: 150, easing: Easing.ease });
      });
    }
  }, [checked]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    return {
      borderWidth: borderWidth.value,
      
    };
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View
        style={[
          {
            width: SIZE,
            height: SIZE,
            borderRadius: 8,
            borderColor: 'gray',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: checked ? 'green' : 'transparent',
          },
          borderStyle,
        ]}
      >
        <Animated.View style={animatedStyle}>
          {checked && (
            <Entypo name="check" size={SIZE * 0.8} color="white" />
          )}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default CustomCheckbox;