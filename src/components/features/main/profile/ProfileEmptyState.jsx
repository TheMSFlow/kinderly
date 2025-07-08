import React from 'react'

import Gift from '@/components/icons/Gift'
import Button from '@/components/common/Button'

const ProfileEmptyState = ({sidebar, main}) => {
  return (
    <div className='h-full '>
      {sidebar && 
      <div className='flex flex-col justify-center items-center h-full'>
          <div className='grid place-items-center bg-slate-300 h-[4.5rem] w-[4.5rem] rounded-full'>
              <Gift />
          </div>
          <p className='text-center text-sm mt-6'>Looks like you haven’t added any items yet.</p>
          <p className='text-center text-xs mt-2'>Click the button below to get started.</p>
      </div>}
      {main && 
      <div className='flex flex-col justify-center items-center h-full w-full'>
          <p className='font-playfair text-center text-4xl mt-6 mb-6'> Create your first item.</p>
          <Button to={'/profile/create'} variant='secondary'> Get started</Button>
      </div>}
    </div>
  )
}

export default ProfileEmptyState