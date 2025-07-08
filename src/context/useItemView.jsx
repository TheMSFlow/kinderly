'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const ItemViewContext = createContext(null)

export const ItemViewProvider = ({ children }) => {
  const [view, setView] = useState('detailed')

  // Load view from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('itemViewMode')
    if (stored === 'detailed' || stored === 'compact' || stored === 'visual') {
      setView(stored)
    }
  }, [])

  // Save view to localStorage on change
  useEffect(() => {
    localStorage.setItem('itemViewMode', view)
  }, [view])

  return (
    <ItemViewContext.Provider value={{ view, setView }}>
      {children}
    </ItemViewContext.Provider>
  )
}

export const useItemView = () => {
  const context = useContext(ItemViewContext)
  if (!context) {
    throw new Error('useItemView must be used within an ItemViewProvider')
  }
  return context
}
