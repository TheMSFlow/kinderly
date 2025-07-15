'use client'

import React, { useEffect, useRef, useState } from 'react'
import Button from '@/components/common/Button'
import { hashPin } from '@/utils/pinUtils'
import { supabase } from '@/supabaseClient'

const roles = [ 'Father', 'Mother', 'Guardian', 'Child', 'Aunty', 'Uncle', 'Nephew', 'Niece', 'Cousin', 'Care giver', 'Family friend', 'Grandfather', 'Grandmother' ]

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
    default: return undefined
  }
}

const generateCallSign = (name, role) => {
  switch (role) {
    case 'Father': return 'Dad'
    case 'Mother': return 'Mom'
    case 'Guardian': return 'Mr/Ms'
    case 'Aunty': return `Aunty ${name}`
    case 'Uncle': return `Uncle ${name}`
    case 'Grandfather': return 'Grandpa'
    case 'Grandmother': return 'Grandma'
    default: return name
  }
}

const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
const days = Array.from({ length: 31 }, (_, i) => i + 1)
const genders = ['Male', 'Female']

const ProfileModal = ({ data = {}, onClose, onComplete }) => {
  const modalRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const [step, setStep] = useState(
    !data?.name || !data?.role ? 1 :
    !data?.dob || !data?.gender ? 2 : 3
  )

  const [member, setMember] = useState({
    id: data?.id,
    name: data?.name || '',
    role: data?.role || '',
    month: data?.dob ? months[new Date(data.dob).getMonth()] : '',
    day: data?.dob ? String(new Date(data.dob).getDate()) : '',
    year: data?.dob ? String(new Date(data.dob).getFullYear()) : '',
    gender: data?.gender || null,
    pin: ''
  })

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  const handleChange = (field, value) => {
    setMember((prev) => ({ ...prev, [field]: value }))
  }

    const handleNext = async () => {
    if (loading) return

    if (step === 1) {
      if (!member.name.trim() || !member.role) return alert('Please fill out all fields.')

      if (!member.id) {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        const autoGender = generateGender(member.role)
        const autoCallSign = generateCallSign(member.name, member.role)

        const { data: inserted, error } = await supabase
        .from('kin')
        .insert([{
          kindred_id: user.id,
          name: member.name,
          role: member.role,
          gender: autoGender,
          callsign: autoCallSign,
        }])
        .select()
        .maybeSingle()

        setLoading(false)

        if (error || !inserted) {
          console.error('Insert failed:', error)
          return alert('Could not save profile. Try again.')
        }

        setMember((prev) => ({
          ...prev,
          id: inserted.id,
          gender: autoGender,
          callsign: autoCallSign,
        }))
      }

      setStep(2)
    } else if (step === 2) {
      const { month, day, year, gender } = member
      if (!month || !day || !year || !gender) return alert('Please complete your birthday.')

        const autoGender = generateGender(member.role)
        const finalGender = member.gender || autoGender
        if (!finalGender) return alert('Please select a gender.')

        setMember((prev) => ({ ...prev, gender: finalGender }))
      setStep(3)
    } else if (step === 3) {
      if (!member.pin || member.pin.length !== 4) return alert('Please enter a valid 4-digit PIN.')

      setLoading(true)
      const hashedPin = await hashPin(member.pin)
      const dob = `${member.year}-${String(months.indexOf(member.month) + 1).padStart(2, '0')}-${String(member.day).padStart(2, '0')}`

      onComplete({
        id: member.id,
        name: member.name,
        role: member.role,
        gender: member.gender,
        dob,
        pin: hashedPin,
        callsign: generateCallSign(member.name, member.role),
      })

      setLoading(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/45 flex items-center justify-center z-50">
      <div ref={modalRef} className="w-[25rem] bg-bg-modal text-slate-50 rounded-lg p-6 flex flex-col justify-between gap-6 mx-4 md:mx-0">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-playfair mb-1">Complete your profile setup</h2>
            <p className="text-sm text-slate-50 mb-4">Join your Kindred</p>
            <div className="flex flex-col md:flex-row gap-2 w-full">
              <input
                type="text"
                placeholder="Name"
                value={member.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="px-3 py-2 border border-b-border rounded-md text-sm text-slate-800 bg-slate-200 placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"/>
                <div className='relative w-full'>
                  <select
                    value={member.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="appearance-none w-full pl-3 py-2 pr-7 rounded-md text-xs bg-transparent border border-btn-tertiary-border hover:bg-btn-tertiary-hover text-btn-tertiary-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
                  >
                    <option className="text-xs" value="">Select Title</option>
                    {roles.map((r, i) => <option key={i} className="text-xs bg-btn-tertiary-hover" value={r}>{r}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-btn-tertiary-text text-sm">
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
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-playfair mb-1">Hi {member.name}, you're almost done</h2>
            <p className="text-xs text-slate-50 mb-6">Enter your birthday and gender</p>
            <div className="grid grid-cols-3 gap-2 mb-3 w-full">
              <div className='relative w-full'>
                <select 
                  value={member.month} 
                  onChange={(e) => handleChange('month', e.target.value)}
                  className="appearance-none w-full pl-3 py-2 pr-7 rounded-md text-xs bg-bg-modal border border-btn-tertiary-border hover:bg-btn-tertiary-hover text-btn-tertiary-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
                  >
                  <option className="text-xs" value="">Month</option>
                  {months.map((m, i) => <option key={i} className="text-xs" value={m}>{m}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-btn-tertiary-text text-sm">
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
              <div className='relative w-full'>
                <select 
                  value={member.day} 
                  onChange={(e) => handleChange('day', e.target.value)}
                  className="appearance-none w-full pl-3 py-2 pr-7 rounded-md text-xs bg-bg-modal border border-btn-tertiary-border hover:bg-btn-tertiary-hover text-btn-tertiary-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
                  >
                  <option className="text-xs" value="">Day</option>
                  {days.map(d => <option key={d} className="text-xs" value={d}>{d}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-btn-tertiary-text text-sm">
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
                <div className='relative w-full'>
                  <select 
                    value={member.year} 
                    onChange={(e) => handleChange('year', e.target.value)}
                    className="appearance-none w-full pl-3 py-2 pr-7 rounded-md text-xs bg-bg-modal border border-btn-tertiary-border hover:bg-btn-tertiary-hover text-btn-tertiary-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
                    >
                    <option className="text-xs" value="">Year</option>
                    {years.map(y => <option key={y} className="text-xs" value={y}>{y}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-btn-tertiary-text text-sm">
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
            <div className='relative z'>
              <select
                value={member.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="appearance-none w-full pl-3 py-2 pr-7 rounded-md text-xs bg-bg-modal border border-btn-tertiary-border hover:bg-btn-tertiary-hover text-btn-tertiary-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
              >
                <option value="">Gender</option>
                {genders.map((g, i) => <option key={i} className="text-xs" value={g}>{g}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-btn-tertiary-text text-sm">
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
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-playfair mb-2">Create your unique pin</h2>
            <p className="text-xs text-slate-50 mb-4">Enter a 4-digit PIN that you'll use to confirm important actions and access your profile if you are logged out.</p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={member.pin}
              onChange={(e) => handleChange('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Enter 4-digit PIN"
              className="w-full px-3 py-2 border rounded-md text-sm bg-slate-200 text-slate-800"
            />
          </div>
        )}

        <Button variant="tertiary" onClick={handleNext} className="w-full border py-2 rounded-md text-sm">
          {loading ? 'Processing...' : step === 3 ? 'Finish' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}

export default ProfileModal
