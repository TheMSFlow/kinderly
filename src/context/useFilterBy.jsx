'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const FilterContext = createContext()

export const FilterProvider = ({ children }) => {
  const [filterBy, setFilterBy] = useState('date')      // 'date' | 'amount'
  const [filterOrder, setFilterOrder] = useState('desc') // 'asc' | 'desc'

  // Load from localStorage on mount
  useEffect(() => {
    const storedBy = localStorage.getItem('itemFilterBy')
    const storedOrder = localStorage.getItem('itemFilterOrder')

    if (storedBy === 'date' || storedBy === 'amount') {
      setFilterBy(storedBy)
    }

    if (storedOrder === 'asc' || storedOrder === 'desc') {
      setFilterOrder(storedOrder)
    }
  }, [])

  // Save to localStorage when filterBy or filterOrder changes
  useEffect(() => {
    localStorage.setItem('itemFilterBy', filterBy)
    localStorage.setItem('itemFilterOrder', filterOrder)
  }, [filterBy, filterOrder])

  const toggleFilterBy = (type) => {
    if (type === filterBy) {
      // Just toggle the order
      setFilterOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      // Switch filter type, set sensible default order
      setFilterBy(type)
      setFilterOrder(type === 'date' ? 'desc' : 'asc')
    }
  }

  return (
    <FilterContext.Provider
      value={{
        filterBy,
        filterOrder,
        toggleFilterBy,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilterBy = () => useContext(FilterContext)
