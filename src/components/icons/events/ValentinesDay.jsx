import React from 'react'
import Image from 'next/image'

const ValentinesDay = () => {
  return (
    <div className='relative flex items-center justify-center w-fit px-[0.625rem] py-[0.375rem] bg-[#F2D7D9] rounded-md'>
        <p className='font-normal text-[10px] text-[#67213B]'>Valentine's</p>
        <div className='absolute -top-2 -right-1'>
            <Image
                src={'/assets/event-icons/val.webp'}
                width={16}
                height={16}
                alt=''
            />
        </div>
    </div>
  )
}

export default ValentinesDay