'use client'

import React from 'react'
import Button from '@/components/common/Button'

const ModalDecision = ({ show, action, noToAction, yesToAction, noText, yesText }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-bg-modal-backdrop flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-bg-primary w-full max-w-md p-6 rounded-lg mx-4 lg:mx-0">
        <h2 className="text-xl leading-normal text-heading text-center mb-6">
          Are you sure you want to {action}
        </h2>

        <div className="flex flex-row gap-2">
          {noToAction &&
          <Button 
          onClick={noToAction} 
          variant="primary"
          className="w-full">
            {noText}
          </Button>}

          { yesToAction && 
          <Button
            variant='warning'
            onClick={yesToAction}
            className="w-full"
          >
            {yesText}
          </Button> }
        </div>
      </div>
    </div>
  )
}

export default ModalDecision
