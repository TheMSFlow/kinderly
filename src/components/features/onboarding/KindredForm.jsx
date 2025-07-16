'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/supabaseClient'

import Button from '@/components/common/Button'
import Toast from '@/components/common/ErrorToast'



const roles = [
  'Father',
  'Mother',
  'Guardian',
  'Child',
  'Aunty',
  'Uncle',
  'Nephew',
  'Niece',
  'Cousin',
  'Care giver',
  'Family friend',
  'Grandfather',
  'Grandmother',
]

const generateGender = (role) => {
  switch (role) {
    case 'Father': return 'Male'
    case 'Uncle': return 'Male'
    case 'Nephew': return 'Male'
    case 'Grandfather': return 'Male'
    case 'Mother': return 'Female'
    case 'Aunty': return 'Female'
    case 'Niece': return 'Female'
    case 'Grandmother': return 'Female'
    default: return null
  }
}


const generateCallSign = (name, title) => {
  switch (title) {
    case 'Father': return 'Dad'
    case 'Mother': return 'Mom'
    case 'Guardian': return `Mr/Ms`
    case 'Aunty': return `Aunty ${name}`
    case 'Uncle': return `Uncle ${name}`
    case 'Grandfather': return 'Grandpa'
    case 'Grandmother': return 'Grandma'
    default: return name
  }
}

const KindredForm = () => {
  const [kindredName, setKindredName] = useState('')
  const [members, setMembers] = useState(Array(6).fill({ name: '', role: '' }))
  const [toastMessage, setToastMessage] = useState('')
  const router =  useRouter();

  const handleMemberChange = (index, key, value) => {
    const updated = [...members]
    updated[index] = { ...updated[index], [key]: value }
    setMembers(updated)
  }

  const validateForm = () => {
    if (!kindredName.trim()) {
      setToastMessage('Fill in your family name and at least 2 profiles to proceed')
      return false
    }

    const validProfiles = members.filter((m) => m.name.trim() !== '')

    if (validProfiles.length < 2) {
      setToastMessage('Fill in your family name and at least 2 profiles to proceed')
      return false
    }

    const profilesWithoutRole = validProfiles.filter((m) => !m.role.trim())
    if (profilesWithoutRole.length > 0) {
      setToastMessage(
        `You didn't assign titles to your Kindred. Click the "Select title" and choose from the list`
      )
      return false
    }

    const hasParentOrGuardian = validProfiles.some((m) =>
      ['Father', 'Mother', 'Guardian'].includes(m.role)
    )

    if (!hasParentOrGuardian) {
      setToastMessage('At least one parent or guardian must be part of your Kindred.')
      return false
    }

    return true
  }



const handleSubmit = async (e) => {
  e.preventDefault()

  if (!validateForm()) {
    setTimeout(() => setToastMessage(''), 3000)
    return
  }

  const validProfiles = members.filter((m) => m.name.trim() !== '')

  // 🔐 Get authenticated user (kindred)
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    setToastMessage('Could not find your kindred.')
    return
  }

  // ✅ Update kindred name
  const { error: kindredError } = await supabase
    .from('kindred')
    .update({ name: kindredName })
    .eq('id', user.id)

  if (kindredError) {
    setToastMessage('Failed to update Kindred name.')
    return
  }

  // 🧠 Transform profiles into kin rows
  const kinInserts = validProfiles.map((p) => ({
    kindred_id: user.id,
    name: p.name,
    role: p.role,
    callsign: generateCallSign(p.name, p.role),
    gender: generateGender(p.role),
  }))

  console.log('View Kin inserts here:', kinInserts)


// 🧠 Get existing kin for this kindred
const { data: existingKin, error: fetchError } = await supabase
  .from('kin')
  .select('name')
  .eq('kindred_id', user.id)

if (fetchError) {
  setToastMessage('Error checking existing profiles.')
  return
}

const existingNames = existingKin?.map(k => k.name.toLowerCase()) || []

// 🚫 Filter out any duplicates (case-insensitive)
const newKin = kinInserts.filter(k => !existingNames.includes(k.name.toLowerCase()))

if (newKin.length === 0) {
  setToastMessage('All profiles already exist.')
} else {
  const { error: kinError } = await supabase.from('kin').insert(newKin)
  if (kinError) {
    console.error('Insert error:', kinError)
    setToastMessage('Error creating kin profiles.')
    return
  }
}

  // ➡️ Proceed
  router.push('/onboarding/profile')
}




  return (
    <>
    <form onSubmit={handleSubmit} className="w-full max-w-[34rem] flex flex-col gap-4 px-4 md:px-0">
      <div>
        <h1 className="font-playfair text-2xl text-heading mb-1">Form your Kindred</h1>
        <p className="text-sm text-text-secondary">Each member will activate their profile when they login.</p>
      </div>

      <div className="space-y-1">
        <label htmlFor="kindredName" className="text-sm text-text-secondary font-medium">What is your Kindred name?</label>
        <input
          id="kindredName"
          type="text"
          placeholder="Enter your family name"
          value={kindredName}
          onChange={(e) => setKindredName(e.target.value)}
          className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
        />
      </div>

      <div className='mb-6'>
        <p className="text-sm text-text-secondary font-medium mb-2">
          Who is in your Kindred? <span className="text-xs">Create up to 6 profiles.</span>
        </p>

        <div className="space-y-2">
          {members.map((member, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Name"
                value={member.name}
                onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
              />
                <div className="relative w-[8.125rem]">
                <select
                    value={member.role}
                    onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                    className="appearance-none w-full pl-3 py-2 pr-7 rounded-md text-xs bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
                >
                    <option className="text-xs" value="">Select Title</option>
                    {roles.map((role, i) => (
                    <option key={i} className="text-xs" value={role}>{role}</option>
                    ))}
                </select>
                
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-btn-primary-text text-sm">
                    <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                </div>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Next
      </Button>
    </form>
        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage('')} />
        )}

    </>
  )
}

export default KindredForm