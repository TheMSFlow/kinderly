"use client"

import Button from '@/components/common/Button'
import React, { useState } from 'react'
import Mail from '@/components/icons/Mail'
import OrSeparator from '@/components/common/OrSeparator'
import AuthForm from '@/components/features/auth/AuthForm'

import { supabase } from '@/supabaseClient'

const Register = () => {
        const [loading, setLoading] = useState(false)

        const handleGoogleSignup = () => {
        if (loading) return
        setLoading(true)

        const { error } = supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
            redirectTo: `${window.location.origin}/auth/callback`
            }
        })

        if (error) {
            console.error('Google signup error:', error)
            setLoading(false)
        }
        }


  return (
    <>
        <section className='flex justify-center items-center bg-bg-primary min-h-[100svh] md:min-h-screen'>
            <div className='flex flex-col gap-6 justify-center items-center bg-bg-auth w-full max-w-[34rem] h-auto p-4 mx-4 md:mx-0 rounded-lg '>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h1 className='font-playfair text-[1.875rem] text-heading'>Sign up</h1>
                    <p className='text-text-primary'>Sign up with your Google account</p>
                </div>
                <div className='flex flex-col gap-4 justify-center items-center w-full'>
                    {/* <Button className={'w-full'} iconLeft={Mail}>
                        Sign up with Apple
                    </Button> */}
                    <Button
                        onClick={handleGoogleSignup}
                        className={'w-full'}
                        iconLeft={Mail}
                        disabled={loading}
                        >
                        {loading ? 'Redirecting...' : 'Sign up with Google'}
                    </Button>
                </div>
                <OrSeparator />
                <AuthForm mode='Sign up'/>
                <div className='flex flex-row items-center justify-center'>
                    <p className='text-text-secondary text-sm mt-[2px] -mr-1'>Already have an account?</p>
                    <Button 
                    variant='ghost'
                    to={'/login'}
                    >
                        Login
                    </Button>
                </div>
            </div>
        </section>
    </>
  )
}

export default Register