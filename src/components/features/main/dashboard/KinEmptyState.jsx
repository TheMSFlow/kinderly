import React from 'react'
import Gift from '@/components/icons/Gift'

const KinEmptyState = ({kinName}) => {
  return (
    <div className='flex flex-col justify-center items-center px-4 h-full -mt-[2rem]'>
        <div className='grid place-items-center bg-slate-300 h-[4.5rem] w-[4.5rem] rounded-full'>
            <Gift />
        </div>
        <h1 className='font-playfair text-2xl mt-6'> No items for {kinName}</h1>
        <p className='text-center text-sm mt-2'>When {kinName} adds an item you’ll see it here.</p>
    </div>
  )
}

export default KinEmptyState