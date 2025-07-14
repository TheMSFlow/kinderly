'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import KinAvatar from '@/components/features/onboarding/KinAvatar'
import AddNewKin from '@/components/features/main/profile/AddNewKin'
import ProfileModal from '@/components/features/onboarding/ProfileModal'
import { getCompletedKin } from '@/utils/getCompletedKin'
import { setSelectedKin } from '@/app/lib/kinCookies'
import { supabase } from '@/supabaseClient'

const OnboardingProfile = () => {
  const [kinList, setKinList] = useState([])
  const [completedKinIds, setCompletedKinIds] = useState([])
  const [activeKin, setActiveKin] = useState(null)
  const [familyName, setFamilyName] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function fetchFamilyName() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session?.user) return

      const { data, error } = await supabase
        .from('kindred')
        .select('name')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!error && data?.name) {
        setFamilyName(data.name)
      }
    }

    fetchFamilyName()
  }, [supabase])

  useEffect(() => {
    const loadKin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: kinData } = await supabase
        .from('kin')
        .select('id, name, role, gender, status')
        .eq('kindred_id', user.id)

      setKinList(kinData || [])

      const completed = await getCompletedKin()
      setCompletedKinIds(completed.map(k => k.id))
    }

    loadKin()
  }, [])

  // 🔵 Handle modal open from search param
  useEffect(() => {
    const id = searchParams.get('id')
    const isCreate = searchParams.get('create') === 'true'

    if (isCreate) {
      setActiveKin({ mode: 'create' }) // ✅ Start modal without inserting
    } else if (id) {
      const kin = kinList.find(k => String(k.id) === String(id))
      if (kin) setActiveKin({ ...kin, mode: 'edit' })
    }

  }, [searchParams, kinList])



  const handleAvatarClick = (kin) => {
    if (completedKinIds.includes(kin.id)) return
    setActiveKin({ ...kin, mode: 'edit' })
  }

  // ... (imports and state setup stay the same)

const handleComplete = async (updatedData) => {
  const { id, dob, gender, pin } = updatedData

  // Only update missing fields
  const updates = {}
  if (dob) updates.dob = dob
  if (gender) updates.gender = gender
  if (pin) updates.pin = pin

  const { error } = await supabase
    .from('kin')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating kin:', error)
    return alert('Something went wrong updating the profile.')
  }

  // Check if profile is now complete (status = true)
  const { data: completed } = await supabase
    .from('kin')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (completed?.status === true) {
    setSelectedKin(completed)
    router.push('/dashboard')
} else {
    // Not complete yet? Reload the UI
    setActiveKin(null)

    const { data: updatedList } = await supabase
      .from('kin')
      .select('id, name, role, gender, status, dob, kindred_id')
      .eq('kindred_id', kinList[0]?.kindred_id)

    setKinList(updatedList || [])

    const completedKin = await getCompletedKin()
    setCompletedKinIds(completedKin.map(k => k.id))
  }
}




  return (
    <>
      <div className='absolute w-full h-12 md:h-[4.5rem] top-0 text-center font-playfair text-[32px] md:text-[40px] border-b border-b-b-border text-heading'>
        {familyName}
      </div>

      <section className='flex flex-col gap-8 items-center justify-center bg-bg-primary min-h-[100svh] md:min-h-screen'>
        <div className='flex flex-col gap-1 items-center justify-center'>
          <h2 className="font-playfair text-2xl text-heading mb-1">Complete your kindred setup</h2>
          <p className='text-text-primary text-xs'>Tap a profile to complete it</p>
        </div>

        <div className='flex flex-wrap gap-8 text-text-primary w-full justify-center items-center px-4'>
          {kinList.map((kin) => (
            <div key={kin.id} className="flex flex-col items-center gap-2">
              <KinAvatar
                profile={true}
                showImage={completedKinIds.includes(kin.id)}
                onClick={() => handleAvatarClick(kin)}
              />
              <p>{kin.name || 'Unnamed'}</p>
            </div>
          ))}

          {kinList.length < 6 && (
            <div className="flex flex-col items-center gap-2">
              <AddNewKin
                profile={true}
                onClick={() => router.push('/onboarding/profile?create=true')}
              />
              <p className="italic text-text-secondary">Create profile</p>
            </div>
          )}
        </div>
      </section>

      {activeKin && (
        <ProfileModal
          data={activeKin}
          onClose={() => setActiveKin(null)}
          onComplete={handleComplete}
        />

      )}
    </>
  )
}

export default OnboardingProfile
