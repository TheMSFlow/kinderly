'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { useRouter } from 'next/navigation'
import Button from '@/components/common/Button'

import { supabase } from '@/supabaseClient'

const Finish = () => {
  const router = useRouter()
  const [pin, setPin] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [memberName, setMemberName] = useState('')

  const searchParams = useSearchParams()

  // ✅ Get selected member's name for greeting
  useEffect(() => {
    const storedMembers = JSON.parse(localStorage.getItem('KindredMembers') || '[]')
    const selectedIndex = parseInt(searchParams.get('index') || '-1', 10)

    if (!isNaN(selectedIndex) && storedMembers[selectedIndex]) {
      setMemberName(storedMembers[selectedIndex].name || '')
    }
  }, [])

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)

    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`)
      nextInput?.focus()
    }
  }

const handleSubmit = async (e) => {
  e.preventDefault()

  if (pin.some((digit) => digit === '')) {
    setError('Enter a complete 4-digit PIN')
    setTimeout(() => setError(''), 3000)
    return
  }

  const pinCode = pin.join('')
  const storedMembers = JSON.parse(localStorage.getItem('KindredMembers') || '[]')
  const selectedIndex = parseInt(searchParams.get('index') || '-1', 10)

  if (isNaN(selectedIndex) || !storedMembers[selectedIndex]) {
    setError('Could not find profile. Please restart onboarding.')
    return
  }

  const selectedMember = storedMembers[selectedIndex]
  selectedMember.pin = pinCode

  const { name, role, gender, month, day, year } = selectedMember
  const dob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    setError('Could not authenticate user.')
    return
  }

  // First try to find an existing kin row
  const { data: existingKin, error: fetchError } = await supabase
    .from('kin')
    .select('id')
    .eq('kindred_id', user.id)
    .eq('name', name)
    .eq('role', role)
    .maybeSingle()

  if (fetchError) {
    console.error(fetchError)
    setError('Error checking for existing profile.')
    return
  }

  const fieldsToSave = {
    kindred_id: user.id,
    name,
    role,
    gender: gender,
    dob: dob,
    pin: pinCode,
  }

  let dbError = null
  let insertedKin = null

  if (existingKin) {
    // 👇 Update existing
    const { error } = await supabase
      .from('kin')
      .update(fieldsToSave)
      .eq('id', existingKin.id)

    dbError = error
  } else {
    // 👇 Create new
    const { data, error } = await supabase
      .from('kin')
      .insert(fieldsToSave)
      .select('id')  // important to retrieve inserted id

    insertedKin = data
    dbError = error
  }


  if (dbError) {
    console.error(dbError)
    setError('Failed to save profile. Please try again.')
    return
  }

  // ✅ Store selected kin in cookie (safe subset)
const selectedKin = {
  id: existingKin?.id || insertedKin?.[0]?.id,
  name,
  role,
  callsign: selectedMember.callsign,
  dob,
  gender,
  pin: pinCode,
}

document.cookie = `selectedKin=${encodeURIComponent(JSON.stringify(selectedKin))}; Path=/; Max-Age=2592000; SameSite=Lax`



  // ✅ Store updated member in localStorage
  storedMembers[selectedIndex] = selectedMember
  localStorage.setItem('KindredMembers', JSON.stringify(storedMembers))
  localStorage.setItem(`Completed:${selectedMember.name}`, 'true')

  // ✅ Redirect
  router.push('/dashboard')
}



  return (
    <section className="min-h-screen bg-bg-primary flex flex-col justify-center items-center px-4 md:px-0">
      <div className="w-full max-w-[34rem] h-[400px] flex flex-col gap-4 px-4 md:px-0">
        <div className="text-sm text-text-primary mb-6">
          <h1 className="font-playfair text-4xl font-semibold mb-3">
            Hey{memberName ? `, ${memberName}` : ''}
          </h1>
          <p className="mb-1">Create your unique pin and you are all set.</p>
          <p>Use this pin to confirm important actions and access your profile if you are logged out.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col justify-between h-[200px]">
          <div className="flex justify-between mb-6">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                id={`pin-${idx}`}
                type="text"
                placeholder="-"
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

          <div className="flex flex-col justify-end h-[100px]">
            {error && <p className="text-red-500 text-sm font-medium mb-8">{error}</p>}

            <Button variant="wide" type='submit'>
              Done
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Finish
