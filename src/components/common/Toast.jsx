import React, { useEffect } from 'react'

const Toast = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-800 text-white px-5 py-3 rounded shadow-lg text-sm z-50">
      {message}
    </div>
  )
}

export default Toast 