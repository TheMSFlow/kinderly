'use client'

import React from 'react'
import Button from '@/components/common/Button'

const EmailVerificationPrompt = ({ show, onClose, onGoBack }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-bg-modal-backdrop flex justify-center items-center z-50">
      <div className="bg-bg-primary w-full max-w-md p-6 rounded-lg mx-4 lg:mx-0">
        <h2 className="text-xl font-playfair text-heading text-center mb-4">
          Verify Your Kinderly Account
        </h2>

        <p className="text-sm text-text-primary mb-4 text-center">
          We’ve sent a verification link to your email. Click the link to continue.
        </p>

        <div className="flex flex-col gap-2">
          {onClose &&<Button onClick={onClose} className="w-full">
            Okay, got it!
          </Button>}

          { onGoBack && <Button
            variant="ghost"
            onClick={onGoBack}
            className="text-sm text-center mt-4"
          >
            Try again
          </Button> }
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationPrompt
