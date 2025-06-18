import React from 'react'
import Image from 'next/image'

const GrandAnniversary = () => {
  return (
    <div className='relative flex items-center justify-center w-fit px-[0.625rem] py-[0.375rem] bg-[#BFA980] rounded-md'>
        <p className='font-normal text-[10px] text-slate-800'>Anniversary</p>
        <div className='absolute -top-3 -right-1'>
            <Image
                src={'/assets/event-icons/grand-anniversary.webp'}
                width={32}
                height={24}
                alt=''
            />
        </div>
    </div>
  )
}

export default GrandAnniversary