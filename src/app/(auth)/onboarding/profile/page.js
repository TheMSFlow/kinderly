'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import KinAvatar from '@/components/features/onboarding/KinAvatar'
import AddNewKin from '@/components/features/main/profile/AddNewKin'
import ProfileModal from '@/components/features/onboarding/ProfileModal'

import { getCompletedKin } from '@/utils/getCompletedKin'
import { supabase } from '@/supabaseClient'

const OnboardingProfile = () => {
  const [familyName, setFamilyName] = useState('')
  const [members, setMembers] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [completedNames, setCompletedNames] = useState([])


  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
  const checkCompletedProfiles = async () => {
    const completeKin = await getCompletedKin()
    const completeName = completeKin.map(k => k.name)
    setCompletedNames(completeName)
  }

  checkCompletedProfiles()
}, [])


  useEffect(() => {
  const loadData = async () => {
    const storedFamilyName = localStorage.getItem('FamilyName')
    const storedMembers = localStorage.getItem('KindredMembers')

    // If data is already in localStorage, use it
    if (storedFamilyName && storedMembers) {
      setFamilyName(storedFamilyName)
      try {
        setMembers(JSON.parse(storedMembers))
      } catch {
        setMembers([])
      }
      return
    }

    // Fetch from Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return

    // ✅ Get kindred name
    const { data: kindred, error: kindredError } = await supabase
      .from('kindred')
      .select('name')
      .eq('id', user.id)
      .maybeSingle()

    // ✅ Get kin members
    const { data: kinMembers, error: kinError } = await supabase
      .from('kin')
      .select('name, role')
      .eq('kindred_id', user.id)

    if (kindredError || kinError) return

    // Store into state and localStorage
    setFamilyName(kindred?.name || '')
    localStorage.setItem('FamilyName', kindred?.name || '')

    const transformed = kinMembers.map(k => ({
      name: k.name,
      role: k.role,
      callsign: k.callsign || '',
      month: '',
      day: '',
      year: '',
      gender: '',
      pin: ''
    }))

    setMembers(transformed)
    localStorage.setItem('KindredMembers', JSON.stringify(transformed))
  }

  loadData()
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
            updated[parsedIndex] = { name: '', role: '', callsign: '', month: '', day: '', year: '', gender: '', pin: '' }
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

  const isCompleted = completedNames.includes(member.name)

  if (isCompleted) {
    router.push(`/kindred?index=${index}`)
  } else {
    setSelectedIndex(index)
  }
}


  const handleModalClose = () => {
    setSelectedIndex(null)
  }

  const handleModalComplete = (newData) => {
  const updatedMembers = [...members]
  const current = updatedMembers[selectedIndex] || {}

  const merged = {
    ...current,
    month: newData.month,
    day: newData.day,
    year: newData.year,
    gender: newData.gender,
    callsign: newData.callsign || current.callsign

  }

  updatedMembers[selectedIndex] = merged
  setMembers(updatedMembers)
  localStorage.setItem('KindredMembers', JSON.stringify(updatedMembers))

  // ✅ Go to finish step for PIN + Supabase handling
  router.push(`/onboarding/finish?index=${selectedIndex}`)
}


  const createdMembers = useMemo(() => members.filter(m => m.name), [members])


  const handleAddNew = () => {
    const newIndex = createdMembers.length
    if (newIndex >= 6) return

    setMembers([
      ...members,
      { name: '', role: '', callsign: '', month: '', day: '', year: '', gender: '', pin: '' },
    ])
    setSelectedIndex(newIndex)
  }

  if (!members.length && !localStorage.getItem('KindredMembers')) {
  return <div className="text-center mt-10">Loading...</div>
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
            const isCompleted = completedNames.includes(member.name)

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
          selectedIndex={selectedIndex}
        />
      )}
    </>
  )
}

export default OnboardingProfile
