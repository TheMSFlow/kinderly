"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabaseClient'

import KindredForm from '@/components/features/onboarding/KindredForm'


const Start = () => {

  const router = useRouter()

  useEffect(() => {
    const checkIfShouldSkipStart = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: kindred } = await supabase
        .from('kindred')
        .select('name')
        .eq('id', session.user.id)
        .maybeSingle()

      if (kindred?.name) {
        router.replace('/onboarding/profile')
      }
    }

    checkIfShouldSkipStart()
  }, [router])
  
  return (
    <section 
    className="flex flex-col items-center justify-center w-full min-h-screen bg-bg-primary text-text-primary"
    >
      <KindredForm />
      
    </section>
  )
}

export default Start