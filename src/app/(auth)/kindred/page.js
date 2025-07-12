'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import KinAvatar from '@/components/features/onboarding/KinAvatar'
import AddNewKin from '@/components/features/main/profile/AddNewKin'
import PinRequestModal from '@/components/features/auth/PinRequestModal'

import { supabase } from '@/supabaseClient'

import bcrypt from 'bcryptjs'


const Kindred = () => {
  const [familyName, setFamilyName] = useState('')
  const [members, setMembers] = useState([])
  const [pinModalIndex, setPinModalIndex] = useState(null)
  const [pinError, setPinError] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()

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


  // ✅ Open PIN modal if ?index=... param is passed
  useEffect(() => {
    const indexParam = searchParams.get('index')
    if (indexParam !== null && members.length > 0) {
      const index = parseInt(indexParam, 10)
      const member = members[index]
      if (!isNaN(index) && member?.name) {
        const isCompleted = localStorage.getItem(`Completed:${member.name}`) === 'true'
        if (isCompleted) {
          setPinModalIndex(index)
          setPinError('')
        } else {
          router.push(`/onboarding/profile?index=${index}`)
        }
      }
    }
  }, [searchParams, members])

  const createdMembers = members.filter((m) => m.name)

  const handleClick = (member, index) => {
    const isCompleted = localStorage.getItem(`Completed:${member.name}`) === 'true'

    if (isCompleted) {
      setPinModalIndex(index)
      setPinError('')
    } else {
      router.push(`/onboarding/profile?index=${index}`)
    }
  }

  const handleAddNew = () => {
    const createdMembers = members.filter((m) => m.name)
    const newIndex = createdMembers.length
    if (newIndex >= 6) return

    router.push(`/onboarding/profile?index=${newIndex}&create=true`)
  }

  return (
    <>
      <div className="absolute w-full h-12 md:h-[4.5rem] top-0 text-center font-playfair text-[32px] md:text-[40px] border-b border-b-b-border text-heading">
        {familyName}
      </div>

      <section className="flex flex-col gap-8 items-center justify-center bg-bg-primary min-h-[100svh] md:min-h-screen">
        <p className="text-text-primary">Select your profile</p>

        <div className="flex flex-wrap gap-8 text-text-primary w-full justify-center items-center px-4">
          {createdMembers.map((member, i) => {
            const isCompleted = localStorage.getItem(`Completed:${member.name}`) === 'true'

            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <KinAvatar
                  profile={true}
                  showImage={isCompleted}
                  onClick={() => handleClick(member, i)}
                />
                <p>{member.name}</p>
              </div>
            )
          })}

          {createdMembers.length < 6 && (
            <div className="flex flex-col items-center gap-2">
              <AddNewKin profile={true} onClick={handleAddNew} />
              <p className="italic text-text-secondary">Create profile</p>
            </div>
          )}
        </div>
      </section>

      {pinModalIndex !== null && (
        <PinRequestModal
          memberName={members[pinModalIndex]?.name}
          onClose={() => {
            setPinModalIndex(null)
            setPinError('')
          }}
          onSubmit={async (enteredPin) => {
            const { data: { user } } = await supabase.auth.getUser()

            const member = members[pinModalIndex]
            const { data: kin, error } = await supabase
              .from('kin')
              .select('id, pin, name, callsign, role, dob, gender')
              .eq('kindred_id', user.id)
              .eq('name', member.name)
              .eq('role', member.role)
              .maybeSingle()

            if (error || !kin) {
              setPinError('Failed to verify PIN.')
              return
            }

            const isMatch = await bcrypt.compare(enteredPin, kin.pin)
              if (!isMatch) {
                setPinError('Incorrect PIN, try again.')
                return
              }


            // ✅ Save selectedKin cookie
            const selectedKin = {
              id: kin.id,
              name: kin.name,
              role: kin.role,
              dob: kin.dob,
              gender: kin.gender,
              callsign: kin.callsign,
              pin: enteredPin
            }

            document.cookie = `selectedKin=${encodeURIComponent(JSON.stringify(selectedKin))}; Path=/; Max-Age=2592000; SameSite=Lax`

            // ✅ Redirect
            router.push('/dashboard')

          }}
          error={pinError}
        />
      )}
    </>
  )
}

export default Kindred
