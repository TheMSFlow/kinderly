'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/common/Button'

const Finish = () => {
  const router = useRouter()
  const [pin, setPin] = useState(['', '', '', ''])
  const [error, setError] = useState('')

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)

    // auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (pin.some((digit) => digit === '')) {
      setError('Enter a complete 4-digit PIN')
      setTimeout(() => setError(''), 3000)
      return
    }

    const pinCode = pin.join('')
    const profileName = localStorage.getItem('FamilyName') || 'Default'

    // Map PIN to user profile
    localStorage.setItem(`PIN:${profileName}`, pinCode)

    router.push('/dashboard') 
  }

  return (
    <section className="min-h-screen bg-bg-primary flex flex-col justify-center items-center px-4 md:px-0">
      <div className="w-full max-w-[34rem] h-[400px] flex flex-col gap-4 px-4 md:px-0">
        <div className='text-sm text-text-primary mb-6'>
            <h1 className="font-playfair text-4xl font-semibold mb-3">Hey, Michael</h1>
            <p className=" mb-1">
            Create your unique pin and you are all set.
            </p>
            <p className="">
            Use this pin to confirm important actions and access your profile if you are logged out.
            </p>
        </div>
        <form onSubmit={handleSubmit} className=" flex flex-col justify-between h-[200px]">
          <div className="flex justify-between mb-6">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                id={`pin-${idx}`}
                type="text"
                placeholder='-'
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => {
                    if (e.key === 'Backspace' && pin[idx] === '' && idx > 0) {
                    const prevInput = document.getElementById(`pin-${idx - 1}`)
                    prevInput?.focus()
                    }
                }}
                className="w-14 h-14 md:w-20 md:h-20 text-xl text-text-primary text-center border border-b-border rounded-md bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border"
              />
            ))}
          </div>
            <div className='flex flex-col justify-end h-[100px]'>
                {error && (
                    <p className="text-red-500 text-sm font-medium mb-8">{error}</p>
                )}
          <Button
          variant='wide'
          onClick={handleSubmit}
          > 
            Done
          </Button>
            </div>

        </form>
      </div>
    </section>
  )
}
export default Finish