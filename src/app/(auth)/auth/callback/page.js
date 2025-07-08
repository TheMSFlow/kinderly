"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/supabaseClient'

const AuthCallback = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code')
      if (!code) {
        // No OAuth code in URL – maybe user refreshed or visited directly
        router.replace('/login')
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession()

      if (error) {
        console.error('Error exchanging code:', error)
        router.replace('/login')
        return
      }

      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
        return
      }

      // Fetch or create kindred row
      const { data: kindred } = await supabase
        .from('kindred')
        .select('name')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!kindred) {
        const { error: insertError } = await supabase.from('kindred').insert({
          id: session.user.id,
          email: session.user.email,
        })

        if (insertError) {
          console.error('Failed to insert kindred:', insertError)
          router.replace('/login')
          return
        }

        router.replace('/onboarding/start')
        return
      }

      if (!kindred.name) {
        router.replace('/onboarding/start')
      } else {
        router.replace('/onboarding/profile')
      }
    }

    handleOAuthCallback()
  }, [router, searchParams])

  return (
    <div className="flex justify-center items-center min-h-screen bg-bg-primary text-text-primary">
      <p className="text-lg font-medium">Finishing sign-in, please wait...</p>
    </div>
  )
}

export default AuthCallback
