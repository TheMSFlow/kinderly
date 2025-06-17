import React from 'react'
import Image from 'next/image'

const GirlChildDay = () => {
  return (
    <div className='relative flex items-center justify-center w-fit px-[0.625rem] py-[0.375rem] bg-[#FFF1C1] rounded-md'>
        <p className='font-normal text-[10px] text-slate-800'>Children's Day</p>
        <div className='absolute -top-2 -right-1'>
            <Image
                src={'/assets/event-icons/girl.webp'}
                width={16}
                height={16}
                alt=''
            />
        </div>
    </div>
  )
}

export default GirlChildDay