import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import shortid from 'shortid'
import { CategoryType, TaskItemData } from './types'

interface CategoryStoreState {
    categories: CategoryType[]
    addCategory: (categoryName: string) => void
    removeCategory: (categoryId: string) => void
    addTaskToCategory: (categoryId: string, taskData: TaskItemData) => void
    removeTaskFromCategory: (categoryId: string, taskId: string) => void
    toggleTask : (categoryId: string, taskData: TaskItemData) => void
    updateDragAnđDrop: (categoryId: string, newTaskList: TaskItemData[]) => void
    initializeStore: () => void
}

const CATEGORY_KEY = 'category'

const useCategoryStore = create<CategoryStoreState>(set => ({
    categories: [],

    addCategory: categoryName =>
        set(state => {
            const newCategory: CategoryType = {
                id: shortid.generate(),
                name: categoryName,
                listTask: []
            }
            const updatedCategories = [newCategory,...state.categories]
            AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(updatedCategories))
            console.log("===addCategory===", updatedCategories)
            return { categories: updatedCategories }
        }),

    removeCategory: categoryId =>
        set(state => {
            const updatedCategories = state.categories.filter(
                category => category.id !== categoryId
            )
            AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(updatedCategories))
            console.log("===removeCategory===", updatedCategories)
            return { categories: updatedCategories }
        }),

    addTaskToCategory: (categoryId, taskData) =>
        set(state => {
            const updatedCategories = state.categories.map(category => {
                if (category.id === categoryId) {
                    return {
                        ...category,
                        listTask: [taskData,...category.listTask]
                    }
                }
                return category
            })
            AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(updatedCategories))
            console.log("===addTaskToCategory===", updatedCategories)
            return { categories: updatedCategories }
        }),
    removeTaskFromCategory: (categoryId, taskId) =>
        set(state => {
            const updatedCategories = state.categories.map(category => {
                if (category.id === categoryId) {
                    const updatedTasks = category.listTask.filter(
                        task => task.id !== taskId
                    )
                    return {
                        ...category,
                        listTask: updatedTasks
                    }
                }
                return category
            })
            AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(updatedCategories))
            console.log("===removeTaskFromCategory===", updatedCategories)
            return { categories: updatedCategories }
        }),
    toggleTask: (categoryId, taskData) => {
        console.log("categoryId", categoryId)
        console.log("taskData", taskData)
        set(state => {
            const updatedCategories = state.categories.map(category => {
                if (category.id === categoryId) {
                    const updatedTasks = category.listTask.map(task => {
                        if (task.id === taskData.id) {
                            return taskData
                        }
                        return task;
                    });
                    return {
                        ...category,
                        listTask: updatedTasks
                    };
                }
                return category;
            });
            AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(updatedCategories))
            console.log("===toggleTask===", updatedCategories)
            return { categories: updatedCategories }
        })
    },
    updateDragAnđDrop: (categoryId, newTaskList) => {
        set(state => {
            const updatedCategories = state.categories.map(category => {
                if (category.id === categoryId) {
                    return {
                        ...category,
                        listTask: newTaskList
                    }
                }
                return category
            })
            AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(updatedCategories))
            return { categories: updatedCategories }
        })
    },
    initializeStore: async () => {
        try {
            const storedCategories = await AsyncStorage.getItem(CATEGORY_KEY)
            const categories: CategoryType[] = storedCategories
                ? JSON.parse(storedCategories)
                : []
            set({ categories })
            console.log(
                'initialize category store successfully with data',
                categories
            )
        } catch (error) {
            console.error('Failed to initialize category store', error)
        }
    }
}))

export default useCategoryStore
