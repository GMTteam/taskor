import React, { useState, useCallback, useRef } from 'react';
import { Icon, VStack, useColorModeValue, Fab, IconButton } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import AnimatedColorBox from '../components/animated-color-box';
import Masthead from '../components/masthead';
import NavBar from '../components/navbar';
import AddCategoryModal from '../components/add-category-modal';
import CategoryItem from '../components/category-item';
import { CategoriesType } from '../store/types';
import useCategoryStore from '../store/categoryStore';
import { useSetting } from '../contexts/settingContext';
import {
  NestableDraggableFlatList,
  ScaleDecorator,
  RenderItemParams,
  NestableScrollContainer,
} from 'react-native-draggable-flatlist';

export default function CategoriesScreen() {
  const [isShowModal, setIsShowModal] = useState(false);
  const { categories, removeCategory, updateCategoriesOrder } = useCategoryStore();
  const { mastheadImage } = useSetting();
  const refScrollView = useRef(null);

  const handleRemoveItem = useCallback((item: CategoriesType) => {
    removeCategory(item.id);
  }, [removeCategory]);

  const handleDragEnd = useCallback(({ data }) => {
    updateCategoriesOrder(data);
  }, [updateCategoriesOrder]);

  const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<CategoriesType>) => {
    return (
      <ScaleDecorator
        activeScale={1.1}
      >
        <CategoryItem
          item={item}
          onRemove={handleRemoveItem}
          onLongPress={drag}
          isActiveDrop={isActive}
          simultaneousHandlers={refScrollView}
        />
      </ScaleDecorator>
    );
  }, [handleRemoveItem]);

  return (
    <AnimatedColorBox
      flex={1}
      bg={useColorModeValue('warmGray.50', 'primary.900')}
      w="full"
    >
      <Masthead
        title="Categories"
        image={mastheadImage ? { uri: mastheadImage } : require('../assets/masthead.png')}
      >
        <NavBar />
      </Masthead>
      <VStack
        flex={1}
        space={1}
        bg={useColorModeValue('warmGray.50', 'primary.900')}
        mt="-20px"
        borderTopLeftRadius="20px"
        borderTopRightRadius="20px"
        pt="20px"
      >
        <NestableScrollContainer>
          <NestableDraggableFlatList
            data={categories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onDragEnd={handleDragEnd}
          />
        </NestableScrollContainer>
      </VStack>
      <Fab
        position="absolute"
        renderInPortal={false}
        size="sm"
        icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
        colorScheme={useColorModeValue('blue', 'darkBlue')}
        bg={useColorModeValue('blue.500', 'blue.400')}
        onPress={() => setIsShowModal(true)}
      />
      <AddCategoryModal
        isVisible={isShowModal}
        header="Add New Category"
        onClose={() => setIsShowModal(false)}
      />
    </AnimatedColorBox>
  );
}
