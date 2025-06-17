import React from 'react'
import Image from 'next/image'

const BoyChildDay = () => {
  return (
    <div className='relative flex items-center justify-center w-fit px-[0.625rem] py-[0.375rem] bg-[#C9A27E] rounded-md'>
        <p className='font-normal text-[10px] text-slate-800'>Children's Day</p>
        <div className='absolute -top-1 -right-1'>
            <Image
                src={'/assets/event-icons/boy.webp'}
                width={16}
                height={16}
                alt=''
            />
        </div>
    </div>
  )
}

export default BoyChildDay