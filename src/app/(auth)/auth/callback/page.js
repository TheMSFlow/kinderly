'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import EmailVerificationPrompt from '@/components/features/auth/EmailVerificationPrompt'
import Button from '@/components/common/Button'
import { Eye, EyeOff } from 'lucide-react'

const AuthCallback = () => {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const source = searchParams.get('source')

  const [status, setStatus] = useState('loading') // loading, prompt-password, done
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [showVerifyModal, setShowVerifyModal] = useState(false)

  useEffect(() => {
    const savedEmail = localStorage.getItem('pendingSignupEmail')
    if (savedEmail) {
      setEmail((prev) => prev || savedEmail)
    }
  }, [])

  useEffect(() => {
  const exchange = async () => {
    const code = searchParams.get('code')
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession()
      if (error) {
        console.error('Error exchanging code:', error.message)
      } else {
        // ✅ Clean up URL after successful exchange
        router.replace('/auth/callback')
      }
    }
  }

  exchange()
}, [searchParams, supabase])




  
  useEffect(() => {
    const checkSession = async () => {
      let retries = 0
      const maxRetries = 5

      while (retries < maxRetries) {
        const { data: { session } } = await supabase.auth.getSession()

        // After session is confirmed
  if (session) {
    const userEmail = session.user?.email
    setEmail(userEmail)

    // Check if kindred row exists
    const { data: existingKindred } = await supabase
      .from('kindred')
      .select('*')
      .eq('id', session.user.id)
      .single()

    // Create kindred row if missing
    if (!existingKindred) {
      const { error: insertError } = await supabase
        .from('kindred')
        .insert({ id: session.user.id, email: userEmail })


      if (insertError) {
        console.error('Failed to create kindred record:', insertError.message)
      }
    }

    if (source === 'signup') {
      setStatus('prompt-password')
    } else {
      router.replace('/kindred')
    }
    return
  }


        // Wait and retry
        await new Promise((res) => setTimeout(res, 1500))
        retries++
      }

      // No session — show verification modal
      setShowVerifyModal(true)
    }

    checkSession()
  }, [source, supabase, router])

  const handlePasswordSubmit = async () => {
  if (password.length < 6) {
    setError('Password must be at least 6 characters.')
    return
  }
  if (password !== confirmPassword) {
    setError('Passwords do not match.')
    return
  }

  try {
    // ✅ Get the currently authenticated user
    const { data: { user }, error: getUserError } = await supabase.auth.getUser()
    if (getUserError || !user) {
      setError('Could not fetch user.')
      return
    }

    // ✅ 1. Update password in Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      password: password,
    })

    if (authError) {
      console.error(authError)
      setError('Failed to set password. Try again.')
      return
    }

    // ✅ 2. Clean up and redirect
    localStorage.removeItem('pendingSignupEmail')
    setStatus('done')
    router.replace('/kindred')
  } catch (err) {
    console.error(err)
    setError('Unexpected error. Try again.')
  }
}


  const toggleVisibility = () => setShowPassword((prev) => !prev)


  const handleGoBack = () => {
  router.replace('/signup')
}


  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-bg-primary text-text-primary">
      <EmailVerificationPrompt
        show={showVerifyModal}
        onGoBack={handleGoBack}
      />

      {status === 'loading' && (
        <p className="text-lg">Loading...</p>
      )}

      {status === 'prompt-password' && (
        <>
        <div className='flex flex-col gap-12 w-full items-center'>
          <div>
            <h1 className='text-heading font-playfair text-2xl xl:text-3xl mb-2'>
              Your email has been verified.
            </h1>
            <p className="text-sm text-center text-text-secondary">
              Please set your password to continue.
            </p>
          </div>
          <div className=" bg-bg-modal flex flex-col gap-4 p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold text-center">Create your password</h2>
            <div className='flex flex-col gap-4 h-[7.5rem]'>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 border rounded-md bg-input-bg text-sm pr-10"
                  placeholder="Enter a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 border rounded-md bg-input-bg text-sm pr-10"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className='relative flex justify-between items-center'>
              <div>{error && <p className="leading-none text-xs text-red-500">{error}</p>}</div>
              <button
                  type="button"
                  onClick={toggleVisibility}
                  className="text-text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button
              onClick={handlePasswordSubmit}
              className="bg-black text-white rounded-md px-4 py-2 text-sm hover:opacity-90"
            >
              Save and continue
            </Button>
          </div>
        </div>
        </>
      )}

      {status === 'done' && (
        <p className="text-lg">Account successfully created.</p>
      )}
    </div>
    </>
  )
}

export default AuthCallback
