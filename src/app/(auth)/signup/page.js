"use client"

import React, { useState } from 'react'
import Button from '@/components/common/Button'
import AuthForm from '@/components/features/auth/AuthForm'
import EmailVerificationPrompt from '@/components/features/auth/EmailVerificationPrompt'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabaseClient'

const Register = () => {
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()

const handleSignupSubmit = async ({ email }) => {
  const { error } = await supabase.auth.signUp({
    email,
    password: 'new_user',
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback?source=signup&auto_login=true`
    },
  })

  if (error) {
    if (error.message.includes('User already registered')) {
      alert('That email is already pending confirmation. Please check your inbox.')
    } else {
      console.error('Signup error:', error.message)
      alert('Sign up failed: ' + error.message)
    }
  } else {
    localStorage.setItem('pendingSignupEmail', email)
    setShowModal(true)
  }
}


  const handleModalClose = () => {
  setShowModal(false)
}




  return (
    <>
        <EmailVerificationPrompt show={showModal} onClose={handleModalClose} />

        <section className='flex justify-center items-center bg-bg-primary min-h-[100svh] md:min-h-screen'>
            <div className='flex flex-col gap-6 justify-center items-center bg-bg-auth w-full max-w-[34rem] h-auto p-4 mx-4 md:mx-0 rounded-lg '>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h1 className='font-playfair text-[1.875rem] text-heading'>Sign Up</h1>
                    <p className='text-text-primary text-xs text-center'>Create a Kinderly account, setup your family and strengthen your Kindred!</p>
                </div>
                <AuthForm mode='Sign up' onSubmit={handleSignupSubmit}/>
                <div className='flex flex-row items-center justify-center'>
                    <p className='text-text-secondary text-sm mt-[2px] -mr-1'>Already have an account?</p>
                    <Button 
                    variant='ghost'
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