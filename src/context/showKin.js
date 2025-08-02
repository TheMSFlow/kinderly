'use client'

import { createContext, useContext, useState } from 'react'

const ShowKinContext = createContext()

export const ShowKinProvider = ({ children }) => {
  const [showKinId, setShowKinId] = useState(null) // null = View all

  return (
    <ShowKinContext.Provider value={{ showKinId, setShowKinId }}>
      {children}
    </ShowKinContext.Provider>
  )
}

export const useShowKin = () => useContext(ShowKinContext)
