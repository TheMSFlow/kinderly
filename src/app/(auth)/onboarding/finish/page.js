'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { useRouter } from 'next/navigation'
import Button from '@/components/common/Button'

import { supabase } from '@/supabaseClient'
import bcrypt from 'bcryptjs'

const Finish = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [pin, setPin] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [memberName, setMemberName] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
  setSubmitting(true)

  // Check full PIN
  if (pin.some((digit) => digit === '')) {
    setError('Enter a complete 4-digit PIN')
    setSubmitting(false)
    setTimeout(() => setError(''), 3000)
    return
  }

  const pinCode = pin.join('')
  const hashedPin = await bcrypt.hash(pinCode, 10)

  const storedMembers = JSON.parse(localStorage.getItem('KindredMembers') || '[]')
  const selectedIndex = parseInt(searchParams.get('index') || '-1', 10)

  if (isNaN(selectedIndex) || !storedMembers[selectedIndex]) {
    setError('Could not find profile. Please restart onboarding.')
    setSubmitting(false)
    return
  }

  const selectedMember = storedMembers[selectedIndex]
  selectedMember.pin = pinCode

  const { name, role, gender, month, day, year } = selectedMember

  // Convert month to numeric and build dob
  const monthIndex = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ].indexOf(month) + 1

  const dob = `${year}-${String(monthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const isValidDate = (dateString) => {
    const d = new Date(dateString)
    return !isNaN(d.getTime())
  }

  // Authenticate user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    setError('Could not authenticate user.')
    setSubmitting(false)
    return
  }

  // Check if Kin already exists
  const { data: existingKin, error: fetchError } = await supabase
    .from('kin')
    .select('id, gender, dob, pin')
    .eq('kindred_id', user.id)
    .eq('name', name)
    .eq('role', role)
    .maybeSingle()

  if (fetchError) {
    console.error(fetchError)
    setError('Error checking for existing profile.')
    setSubmitting(false)
    return
  }

  let finalKinId

  if (existingKin) {
    // Update only missing fields
    const updateData = {}

    if ((existingKin.gender === null || existingKin.gender === '') && gender?.trim()) {
      updateData.gender = gender
    }

    if ((existingKin.dob === null || existingKin.dob === '') && isValidDate(dob)) {
      updateData.dob = dob
    }

    if ((existingKin.pin === null || existingKin.pin === '') && pinCode) {
      updateData.pin = hashedPin
    }

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('kin')
        .update(updateData)
        .eq('id', existingKin.id)

      if (updateError) {
        console.error(updateError)
        setError('Error updating profile.')
        setSubmitting(false)
        return
      }
    }

    finalKinId = existingKin.id
  } else {
    // Insert new Kin
    const { data: insertedKin, error: insertError } = await supabase
      .from('kin')
      .insert({
        kindred_id: user.id,
        name,
        role,
        gender: gender?.trim(),
        dob: isValidDate(dob) ? dob : null,
        pin: hashedPin,
        callsign: selectedMember.callsign || name,
      })
      .select('id')

    if (insertError || !insertedKin?.[0]) {
      console.error(insertError)
      setError('Failed to create profile.')
      setSubmitting(false)
      return
    }

    finalKinId = insertedKin[0].id
  }

  // Store selected kin in cookie
  const selectedKin = {
    id: finalKinId,
    name,
    role,
    callsign: selectedMember.callsign || name,
    dob,
    gender,
    pin: pinCode,
  }

  document.cookie = `selectedKin=${encodeURIComponent(JSON.stringify(selectedKin))}; Path=/; Max-Age=2592000; SameSite=Lax; Secure`


  localStorage.removeItem('KindredMembers')

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

            <Button variant="wide" type="submit" disabled={submitting}>
              {submitting ? 'Finishing...' : 'Done'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Finish
