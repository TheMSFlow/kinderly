'use client'

import Button from '@/components/common/Button'
import React, { useState } from 'react'
import Mail from '@/components/icons/Mail'

const AuthForm = ({ mode = 'login', onSubmit }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validate = () => {
    const newErrors = {}

    if (!email) newErrors.email = 'Email is required'
    else if (!isValidEmail(email)) newErrors.email = 'Invalid email address'

    if (mode === 'login') {
      if (!password) newErrors.password = 'Password is required'
      else if (password.length < 6)
        newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    try {
      if (onSubmit) {
        await onSubmit(mode === 'login' ? { email, password } : { email })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="h-[5rem]">
        <label htmlFor="email" className="text-sm text-text-secondary font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring ${
            errors.email ? 'border-red-200 focus:ring-red-300' : 'border-b-border focus:ring-b-border'
          }`}
        />
        {errors.email && (
          <p className="mt-[2px] text-red-600 text-[10px] text-right">{errors.email}</p>
        )}
      </div>

      {mode === 'login' && (
        <div className="h-[5rem] -mt-2 mb-2">
          <label htmlFor="password" className="text-sm text-text-secondary font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring ${
              errors.password ? 'border-red-200 focus:ring-red-300' : 'border-b-border focus:ring-b-border'
            }`}
          />
          {errors.password && (
            <p className="mt-[2px] text-red-600 text-[10px] text-right">{errors.password}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={loading}
        {...(mode !== 'login' && { iconLeft: Mail })}
      >
        {loading
          ? 'Loading...'
          : mode === 'login'
          ? 'Join your Kindred'
          : 'Sign up with email'}
      </Button>
    </form>
  )
}

export default AuthForm
