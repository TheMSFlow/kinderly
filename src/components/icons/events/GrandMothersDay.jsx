import React from 'react'
import Image from 'next/image'

const GrandMothersDay = () => {
  return (
    <div className='relative flex items-center justify-center w-fit px-[0.625rem] py-[0.375rem] bg-[#B497BD] rounded-md'>
        <p className='font-normal text-[10px] text-slate-800'>Mother's Day</p>
        <div className='absolute -top-2 -right-1'>
            <Image
                src={'/assets/event-icons/grandmother.webp'}
                width={18}
                height={18}
                alt=''
            />
        </div>
    </div>
  )
}

export default GrandMothersDay