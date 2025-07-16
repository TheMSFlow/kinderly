"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/common/Button'
import AuthForm from '@/components/features/auth/AuthForm'
import EmailVerificationPrompt from '@/components/features/auth/EmailVerificationPrompt'
import { supabase } from '@/supabaseClient'
import { useSearchParams } from 'next/navigation'

const Register = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const shouldResend = searchParams.get('resend') === 'true'

    const runResend = async () => {
  const savedEmail = localStorage.getItem('pendingSignupEmail')
  if (!savedEmail) return

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: savedEmail,
  })

  if (error) {
    console.error('Resend error:', error.message)
    setFormErrors({ email: 'Failed to resend verification email. Please try again.' })
  } else {
    setShowModal(true)
    router.replace('/signup') 
  }
}

useEffect(() => {
  if (shouldResend) {
    runResend()
  }
}, [shouldResend])


  const handleSignupSubmit = async ({ email }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'new_user',
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback?source=signup&auto_login=true`,
    },
  })

  console.log('📩 Supabase result:', { data, error })

  if (!error && data?.user && data.user.identities?.length === 0) {
  setFormErrors({ email: 'Email already exists with another account.' })
  return
}

if (error) {
  const msg = error.message.toLowerCase()

  if (msg.includes('confirmation email sent')) {
    localStorage.setItem('pendingSignupEmail', email)
    setShowModal(true)
    return
  }

  setFormErrors({ email: 'Sign up failed: ' + error.message })
  return
}

  // ✅ Fresh signup
  localStorage.setItem('pendingSignupEmail', email)
  setShowModal(true)
}

  const handleModalClose = () => {
  setShowModal(false)
}




  return (
    <>
        <EmailVerificationPrompt 
          show={showModal} 
          content={'We’ve sent a verification link to your email. Click the link to continue.'}
          onClose={handleModalClose} />

        <section className='flex justify-center items-center bg-bg-primary min-h-[100svh] md:min-h-screen'>
            <div className='flex flex-col gap-6 justify-center items-center bg-bg-auth w-full max-w-[34rem] h-auto p-4 mx-4 md:mx-0 rounded-lg '>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h1 className='font-playfair text-[1.875rem] text-heading'>Sign Up</h1>
                    <p className='text-text-primary text-xs text-center'>Create a Kinderly account, setup your family and strengthen your Kindred!</p>
                </div>
                <AuthForm mode='Sign up' onSubmit={handleSignupSubmit} externalError={formErrors}/>
                <div className='flex flex-row items-center justify-center'>
                    <p className='text-text-secondary text-sm mt-[2px] -mr-1'>Already have an account?</p>
                    <Button 
                    variant='underline'
                    to={'/login'}
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        </section>
    </>
  )
}

export default Register