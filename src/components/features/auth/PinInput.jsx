'use client'

import React, { useEffect, useRef } from 'react'

const PinInput = ({ value = '', onChange, length = 4, autoFocus = true }) => {
  const inputRefs = useRef([])

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }, [autoFocus])

  const handleInput = (val, idx) => {
    if (!/^\d?$/.test(val)) return

    const valueArr = value.split('')
    valueArr[idx] = val

    const newVal = valueArr.join('').padEnd(length, '')

    onChange(newVal)

    if (val && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      const valueArr = value.split('')
      if (!valueArr[idx]) {
        if (idx > 0) {
          inputRefs.current[idx - 1]?.focus()
        }
      } else {
        valueArr[idx] = ''
        onChange(valueArr.join('').padEnd(length, ''))
      }
    }

    if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }

    if (e.key === 'ArrowRight' && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          id={`pin-${idx}`}
          ref={(el) => (inputRefs.current[idx] = el)}
          className="w-14 h-14 md:w-20 md:h-20 text-xl text-text-primary text-center border border-b-border rounded-md bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border"
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleInput(e.target.value, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
        />
      ))}
    </div>
  )
}

export default PinInput
