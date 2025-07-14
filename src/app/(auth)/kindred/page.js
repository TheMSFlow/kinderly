'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import KinAvatar from '@/components/features/onboarding/KinAvatar'
import AddNewKin from '@/components/features/main/profile/AddNewKin'
import PinRequestModal from '@/components/features/auth/PinRequestModal'
import { supabase } from '@/supabaseClient'
import { verifyPin } from '@/app/lib/pinUtils'
import { setSelectedKin } from '@/app/lib/kinCookies'

const Kindred = () => {
  const [familyName, setFamilyName] = useState('')
  const [kinList, setKinList] = useState([])
  const [selectedKin, setSelectedKinState] = useState(null)
  const [pinError, setPinError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: kindred } = await supabase
        .from('kindred')
        .select('name')
        .eq('id', user.id)
        .maybeSingle()

      const { data: kins } = await supabase
        .from('kin')
        .select('id, name, role, status')
        .eq('kindred_id', user.id)

      setFamilyName(kindred?.name || '')
      setKinList(kins || [])
    }

    loadData()
  }, [])

  const handleKinClick = (kin) => {
    if (kin.status) {
      setSelectedKinState(kin)
      setPinError('')
    } else {
      router.push(`/onboarding/profile?id=${kin.id}`)
    }
  }

  const handleAddNew = () => {
    if (kinList.length >= 6) return
    router.push('/onboarding/profile?create=true')
  }

  return (
    <>
      <div className="absolute w-full h-12 md:h-[4.5rem] top-0 text-center font-playfair text-[32px] md:text-[40px] border-b border-b-b-border text-heading">
        {familyName}
      </div>

      <section className="flex flex-col gap-8 items-center justify-center bg-bg-primary min-h-[100svh] md:min-h-screen">
        <p className="text-text-primary">Select your profile</p>

        <div className="flex flex-wrap gap-8 text-text-primary w-full justify-center items-center px-4">
          {kinList.map((kin) => (
            <div key={kin.id} className="flex flex-col items-center gap-2">
              <KinAvatar
                profile={true}
                showImage={kin.status}
                onClick={() => handleKinClick(kin)}
              />
              <p>{kin.name}</p>
            </div>
          ))}

          {kinList.length < 6 && (
            <div className="flex flex-col items-center gap-2">
              <AddNewKin profile={true} onClick={handleAddNew} />
              <p className="italic text-text-secondary">Create profile</p>
            </div>
          )}
        </div>
      </section>

      {selectedKin && (
        <PinRequestModal
          memberName={selectedKin.name}
          onClose={() => {
            setSelectedKinState(null)
            setPinError('')
          }}
          onSubmit={async (enteredPin) => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: kin, error } = await supabase
              .from('kin')
              .select('id, pin, name, role, dob, gender, callsign')
              .eq('id', selectedKin.id)
              .eq('kindred_id', user.id)
              .maybeSingle()

            if (error || !kin) {
              setPinError('Failed to verify PIN.')
              return
            }

            const isMatch = await verifyPin(enteredPin, kin.pin)
            if (!isMatch) {
              setPinError('Incorrect PIN, try again.')
              return
            }

            setSelectedKin({
              id: kin.id,
              name: kin.name,
              role: kin.role,
              dob: kin.dob,
              gender: kin.gender,
              callsign: kin.callsign,
              pin: enteredPin,
              status: true,
            })

            router.push('/dashboard')
          }}
          error={pinError}
        />
      )}
    </>
  )
}

export default Kindred
