import React, { useEffect } from 'react'
import AppContainer from './src/components/app-container'
import Navigator from './src/index'
import useCategoryStore from './src/store/categoryStore'
import useUserStore from './src/store/userStore'

export default function App() {

  const { initializeStore } = useCategoryStore();
  useEffect(() => {
    initializeStore()
  }, [])

  const initializeUserStore = useUserStore((state) => state.initializeUserStore);
  useEffect(() => {
    initializeUserStore();
  }, [initializeUserStore])

  return (
    <AppContainer>
        <Navigator />
    </AppContainer>
  )
}