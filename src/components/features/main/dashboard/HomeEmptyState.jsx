import React from 'react'

import Gift from '@/components/icons/Gift'
import Button from '@/components/common/Button'

const HomeEmptyState = () => {
  return (
    <div className='flex flex-col justify-center items-center px-4 h-full -mt-[2rem]'>
        <div className='grid place-items-center bg-slate-300 h-[4.5rem] w-[4.5rem] rounded-full'>
            <Gift />
        </div>
        <h1 className='font-playfair text-2xl mt-6'> No items yet</h1>
        <p className='text-center text-sm mt-2'>When members of your Kindred add items you’ll see them here.  Your items are curated in your profile.</p>
        <Button 
        className={'mt-4'} 
        variant='secondary'
        to={'/profile'}
        >
            Go to profile
        </Button>
    </div>
  )
}

export default HomeEmptyState