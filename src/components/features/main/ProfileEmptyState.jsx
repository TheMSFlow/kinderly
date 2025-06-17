import React from 'react'

import Gift from '@/components/icons/Gift'

const ProfileEmptyState = () => {
  return (
    <div className='flex flex-col justify-center items-center px-4 pt-28'>
        <div className='grid place-items-center bg-slate-200 h-[4.5rem] w-[4.5rem] rounded-full'>
            <Gift />
        </div>
        <p className='text-center text-sm mt-6'>Looks like you haven’t added any items yet.</p>
        <p className='text-center text-xs mt-2'>Click the button below to get started.</p>
    </div>
  )
}

export default ProfileEmptyState