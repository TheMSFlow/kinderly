'use client'
import React, { useEffect, useState } from 'react'
import KinAvatar from '@/components/features/onboarding/KinAvatar'
import ProfileModal from '@/components/features/onboarding/ProfileModal'

const OnboardingProfile = () => {
  const [familyName, setFamilyName] = useState('')
  const [members, setMembers] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)

  useEffect(() => {
    const storedFamilyName = localStorage.getItem('FamilyName') || ''
    console.log(storedFamilyName);
    setFamilyName(storedFamilyName)

    const storedMembers = localStorage.getItem('KindredMembers')
    console.log(storedMembers)
    if (storedMembers) {
      try {
        setMembers(JSON.parse(storedMembers))
      } catch {
        setMembers([])
      }
    } else {
      // Initialize with 6 empty members
      setMembers(Array(6).fill({ name: '', role: '', month: '', day: '', year: '', gender: '' }))
    }
  }, [])

  const handleProfile = (index) => {
    setSelectedIndex(index)
  }

  const handleModalClose = () => {
    setSelectedIndex(null)
  }

  const handleModalComplete = (newData) => {
    const updatedMembers = [...members]
    updatedMembers[selectedIndex] = newData
    setMembers(updatedMembers)
    localStorage.setItem('KindredMembers', JSON.stringify(updatedMembers))
  }

  return (
    <>
        <div className='absolute w-full h-12 md:h-[4.5rem] top-0 text-center font-playfair text-[32px] md:text-[40px] border-b border-b-b-border text-heading'>{familyName}</div>
        <section className='flex flex-col gap-8 items-center justify-center bg-bg-primary min-h-[100svh] md:min-h-screen'>
            <p className='text-text-primary'>Select your profile</p>
            <div className='grid grid-cols-2 lg:grid-cols-6 lg:grid-rows-1 gap-8 text-text-primary'>
          {Array(6).fill().map((_, i) => {
            const member = members[i]
            const isCreated = !!member?.name

            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <KinAvatar profile={isCreated} onClick={() => handleProfile(i)} />
                <p className={isCreated ? '' : 'italic text-text-secondary'}>
                  {isCreated ? member.name : 'Create profile'}
                </p>
              </div>
            )
          })}
        </div>
        </section>

        {selectedIndex !== null && (
          <ProfileModal
            profile={!!members[selectedIndex]?.name}
            data={members[selectedIndex]}
            onClose={handleModalClose}
            onComplete={handleModalComplete}
          />
        )}
    </>
  )
}

export default OnboardingProfile;