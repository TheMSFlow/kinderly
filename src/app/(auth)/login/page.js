"use client"

import Button from '@/components/common/Button'
import React from 'react'
import AuthForm from '@/components/features/auth/AuthForm'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabaseClient'

const Login = () => {
  const router = useRouter()

const handleSigninSubmit = async ({ email, password }) => {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error.message)
      alert('Login failed: ' + error.message)
    } else {
      // ✅ Redirect immediately to protected route (e.g., /kindred)
      router.replace('/kindred')
    }
  }

  
  return (
    <>
        <section className='flex justify-center items-center bg-bg-primary min-h-[100svh] md:min-h-screen'>
            <div className='flex flex-col gap-6 justify-center items-center bg-bg-auth w-full max-w-[34rem] h-auto p-4 mx-4 md:mx-0 rounded-lg '>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h1 className='font-playfair text-[1.875rem] text-heading'>Sign In</h1>
                </div>
                <AuthForm onSubmit={handleSigninSubmit}/>
                <div className='flex flex-row items-center justify-center'>
                    <p className='text-text-secondary text-sm mt-[2px] -mr-1'>Don't have an account?</p>
                    <Button 
                    variant='underline'
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