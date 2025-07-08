"use client"

import Button from '@/components/common/Button'
import React, { useEffect, useState } from 'react'
import Mail from '@/components/icons/Mail'
import OrSeparator from '@/components/common/OrSeparator'
import AuthForm from '@/components/features/auth/AuthForm'

import { supabase } from '@/supabaseClient'
import { useRouter } from 'next/navigation'

const Login = () => {
    const router = useRouter();
    const [checkingSession, setCheckingSession] = useState(true)

    const handleGoogleAuth = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        if (error) console.error('Google login error:', error)
    }

  useEffect(() => {
  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      setCheckingSession(false)
      return
    }

    // 🔍 Fetch kindred record
    const { data: kindred, error } = await supabase
      .from('kindred')
      .select('name')
      .eq('id', session.user.id)
      .maybeSingle()

    if (error) {
      console.error('Failed to fetch kindred:', error)
      setCheckingSession(false)
      return
    }

    if (!kindred) {
    await supabase.from('kindred').insert({
        id: session.user.id,
        email: session.user.email,
        // name will be filled during /onboarding/start
    })
    router.replace('/onboarding/start')
    } else if (!kindred.name) {
    router.replace('/onboarding/start')
    } else {
    router.replace('/kindred')
    }

  }

  checkSession()
}, [router])


  if (checkingSession) return null

  
  return (
    <>
        <section className='flex justify-center items-center bg-bg-primary min-h-[100svh] md:min-h-screen'>
            <div className='flex flex-col gap-6 justify-center items-center bg-bg-auth w-full max-w-[34rem] h-auto p-4 mx-4 md:mx-0 rounded-lg '>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h1 className='font-playfair text-[1.875rem] text-heading'>Welcome back</h1>
                    <p className='text-text-primary'>Login with your Google account</p>
                </div>
                <div className='flex flex-col gap-4 justify-center items-center w-full'>
                    {/* <Button className={'w-full'} iconLeft={Mail}>
                        Login with Apple
                    </Button> */}
                    <Button onClick={handleGoogleAuth} className={'w-full'} iconLeft={Mail}>
                        Login with Google
                    </Button>
                </div>
                <OrSeparator />
                <AuthForm/>
                <div className='flex flex-row items-center justify-center'>
                    <p className='text-text-secondary text-sm mt-[2px] -mr-1'>Don't have an account?</p>
                    <Button 
                    variant='ghost'
                    to={'/signup'}
                    >
                        Sign up
                    </Button>
                </div>
            </div>
        </section>
    </>
  )
}

export default Login