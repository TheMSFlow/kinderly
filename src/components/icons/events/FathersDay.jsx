import React from 'react'
import Image from 'next/image'

const FathersDay = () => {
  return (
    <div className='relative flex items-center justify-center w-fit px-[0.625rem] py-[0.375rem] bg-[#2C3E50] rounded-md'>
        <p className='font-normal text-[10px] text-[#BFA980]'>Father's Day</p>
        <div className='absolute -top-2 -right-1'>
            <Image
                src={'/assets/event-icons/man.webp'}
                width={18}
                height={18}
                alt=''
            />
        </div>
    </div>
  )
}

export default FathersDay