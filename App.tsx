import React, { useEffect } from 'react'
import AppContainer from './src/components/app-container'
import Navigator from './src/index'
import useCategoryStore from './src/store/categoryStore'

export default function App() {
  const { initializeStore } = useCategoryStore();
  useEffect(() => {
    initializeStore()
  }, [])
  return (
    <AppContainer>
      <Navigator />
    </AppContainer>
  )
}