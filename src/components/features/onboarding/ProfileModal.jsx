'use client'

import Button from '@/components/common/Button'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const roles = [
  'Father', 'Mother', 'Guardian', 'Child', 'Brother', 'Sister', 'Aunty', 'Uncle', 'Nephew', 'Niece',
  'Cousin', 'Care giver', 'Family friend', 'Grandfather', 'Grandmother',
]

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
const days = Array.from({ length: 31 }, (_, i) => i + 1)
const genders = ['Male', 'Female']

const ProfileModal = ({ profile, data = {}, onClose, onComplete }) => {
  const router = useRouter()
  const modalRef = useRef(null)
  const [step, setStep] = useState(profile ? 2 : 1)

const [member, setMember] = useState({
  name: data.name || '',
  role: data.role || '',
  month: data.month || '',
  day: data.day || '',
  year: data.year || '',
  gender: data.gender || '',
})


  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleChange = (field, value) => {
    setMember((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (!member.name.trim() || !member.role) return alert('Please fill out all fields.')
      setStep(2)
    } else {
      const { month, day, year, gender } = member
      if (!month || !day || !year || !gender) return alert('Please complete your profile.')
      console.log('Profile Submitted:', member)
      onComplete(member)
      onClose()
      router.push('/onboarding/finish')
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/45 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="w-[25rem] h-[18rem] bg-bg-modal text-slate-50 rounded-lg p-6 flex flex-col justify-between gap-6 mx-4 md:mx-0"
      >
        {step === 1 ? (
          <>
            <div>
              <h2 className="text-xl font-playfair mb-1">Complete your profile setup</h2>
              <p className="text-sm text-slate-50 mb-4">Join your Kindred</p>
              <div className="flex flex-col md:flex-row gap-2 w-full">
                <input
                  type="text"
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="px-3 py-2 border border-b-border rounded-md text-sm text-slate-800 bg-slate-200 placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
                />
                <div className="relative w-full md:w-[8.125rem]">
                  <select
                    value={member.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="appearance-none w-full pl-3 py-2 pr-7 rounded-md text-xs bg-transparent border border-btn-tertiary-border hover:bg-btn-tertiary-hover text-btn-tertiary-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
                  >
                    <option className="text-xs" value="">Select Title</option>
                    {roles.map((role, i) => (
                      <option key={i} className="text-xs bg-btn-tertiary-hover" value={role}>{role}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-btn-tertiary-text text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-playfair mb-1">Complete your profile setup</h2>
              <p className="text-sm text-slate-50 mb-6">Enter your birthday and gender</p>
              <div className="grid grid-cols-3 w-full gap-2 mb-3">
                <div className='relative w-full'>
                    <select
                    value={member.month}
                    onChange={(e) => handleChange('month', e.target.value)}
                    className="appearance-none w-full pl-3 py-2 pr-7 rounded-md text-xs bg-bg-modal border border-btn-tertiary-border hover:bg-btn-tertiary-hover text-btn-tertiary-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
                    >
                    <option className="text-xs" value="">Month</option>
                    {months.map((month, i) => (
                        <option key={i} className="text-xs" value={month}>{month}</option>
                    ))}
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
                    {days.map((d) => (
                        <option key={d} className="text-xs" value={d}>{d}</option>
                    ))}
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
                    {years.map((y) => (
                        <option key={y} className="text-xs" value={y}>{y}</option>
                    ))}
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
                    <option className="text-xs" value="">Gender</option>
                    {genders.map((g, i) => (
                    <option key={i} className="text-xs"  value={g}>{g}</option>
                    ))}
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
          </>
        )}

            <Button
            variant='tertiary'
            onClick={handleNext}
            className="w-full border border-b-border py-2 rounded-md text-sm hover:bg-btn-primary-hover"
            >
            Next
            </Button>

      </div>
    </div>
  )
}

export default ProfileModal
