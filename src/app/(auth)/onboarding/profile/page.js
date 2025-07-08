'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import KinAvatar from '@/components/features/onboarding/KinAvatar'
import AddNewKin from '@/components/features/main/profile/AddNewKin'
import ProfileModal from '@/components/features/onboarding/ProfileModal'

const OnboardingProfile = () => {
  const [familyName, setFamilyName] = useState('')
  const [members, setMembers] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const storedFamilyName = localStorage.getItem('FamilyName') || ''
    setFamilyName(storedFamilyName)

    const storedMembers = localStorage.getItem('KindredMembers')
    if (storedMembers) {
      try {
        setMembers(JSON.parse(storedMembers))
      } catch {
        setMembers([])
      }
    } else {
      setMembers([])
    }
  }, [])

  useEffect(() => {
    const index = searchParams.get('index')
    const isCreate = searchParams.get('create') === 'true'

    if (index !== null) {
      const parsedIndex = parseInt(index, 10)
      if (!isNaN(parsedIndex)) {
        setMembers(prev => {
          const updated = [...prev]
          if (isCreate && !updated[parsedIndex]) {
            updated[parsedIndex] = { name: '', role: '', month: '', day: '', year: '', gender: '', pin: '' }
            localStorage.setItem('KindredMembers', JSON.stringify(updated))
          }
          return updated
        })

        setSelectedIndex(parsedIndex)
      }
    }
  }, [searchParams])

  const handleProfile = (index) => {
    const member = members[index]
    if (!member || !member.name) return

    const isCompleted = localStorage.getItem(`Completed:${member.name}`) === 'true'

    if (isCompleted) {
      // ✅ Redirect to Kindred to handle login
      router.push(`/kindred?index=${index}`)
    } else {
      // ✅ Continue onboarding
      setSelectedIndex(index)
    }
  }

  const handleModalClose = () => {
    setSelectedIndex(null)
  }

  const handleModalComplete = (newData) => {
    const updatedMembers = [...members]
    updatedMembers[selectedIndex] = newData
    setMembers(updatedMembers)
    localStorage.setItem('KindredMembers', JSON.stringify(updatedMembers))

    if (newData.name) {
      window.location.href = `/onboarding/finish?index=${selectedIndex}`
    }
  }

  const createdMembers = members.filter(m => m.name)

  const handleAddNew = () => {
    const createdMembers = members.filter(m => m.name)
    const newIndex = createdMembers.length
    if (newIndex >= 6) return

    setMembers([
      ...members,
      { name: '', role: '', month: '', day: '', year: '', gender: '', pin: '' },
    ])
    setSelectedIndex(newIndex)
  }

  return (
    <>
      <div className='absolute w-full h-12 md:h-[4.5rem] top-0 text-center font-playfair text-[32px] md:text-[40px] border-b border-b-b-border text-heading'>
        {familyName}
      </div>

      <section className='flex flex-col gap-8 items-center justify-center bg-bg-primary min-h-[100svh] md:min-h-screen'>
        <div className='flex flex-col gap-1 items-center justify-center'>
          <h2 className="font-playfair text-2xl text-heading mb-1">Complete your kindred setup</h2>
          <p className='text-text-primary text-xs'>Add up to 6 members or finish creating your profile</p>
        </div>

        <div className='flex flex-wrap gap-8 text-text-primary w-full justify-center items-center px-4'>
          {createdMembers.map((member, i) => {
            const isCompleted = localStorage.getItem(`Completed:${member.name}`) === 'true'

            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <KinAvatar
                  profile={true}
                  showImage={isCompleted}
                  onClick={() => handleProfile(i)}
                />
                <p>{member.name}</p>
              </div>
            )
          })}

          {createdMembers.length < 6 && (
            <div className="flex flex-col items-center gap-2">
              <AddNewKin profile={true} onClick={handleAddNew} />
              <p className='italic text-text-secondary'>Create profile</p>
            </div>
          )}
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

export default OnboardingProfile
