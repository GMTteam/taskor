import React, { memo, useState } from 'react';
import { Text, View, Modal, Button, Input } from 'native-base';
import { MotiView } from 'moti';
import useCategoryStore from '../store/categoryStore';

interface Props {
    isVisible: boolean;
    header: string;
    onClose: () => void;
}

const AddCategoryModal = memo((props: Props) => {
    const {addCategory} = useCategoryStore()
    const [categoryName, setCategoryName] = useState<string>('')
    const handleAddNewCategory = () => {
        addCategory(categoryName)
        setCategoryName('')
        props.onClose()
    }

    return (
        <Modal isOpen={props.isVisible} 
                onClose={props.onClose} 
                alignContent={'center'} >
            <MotiView
                from={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.2 }}
                transition={{
                    type: 'timing',
                    duration: 300,
                }}
                style={{
                    width : '80%',
                    justifyContent : 'center',
                    alignItems : 'center'
                }}
            >
                <Modal.Content 
                    style={{width : '100%'}}
                >
                    <Modal.CloseButton />
                    <Modal.Header>
                        <Text>{props.header}</Text>
                    </Modal.Header>
                    <Modal.Body>
                        <Input
                            placeholder="Category name"
                            value={categoryName}
                            onChangeText={(text) => setCategoryName(text)}
                            variant="unstyled"
                            fontSize={19}
                            px={1}
                            py={0}
                            autoFocus = {props.isVisible}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                        onPress={handleAddNewCategory}
                        >Add</Button>
                    </Modal.Footer>
                </Modal.Content>
            </MotiView>
        </Modal>
    );
}) 

export default AddCategoryModal;
