import React from 'react'
import Image from 'next/image'

const MothersDay = () => {
  return (
    <div className='relative flex items-center justify-center w-fit px-[0.625rem] py-[0.375rem] bg-[#F7CAC9] rounded-md'>
        <p className='font-normal text-[10px] text-[#8B4A62]'>Mother's Day</p>
        <div className='absolute -top-2 -right-1'>
            <Image
                src={'/assets/event-icons/woman.webp'}
                width={18}
                height={18}
                alt=''
            />
        </div>
    </div>
  )
}

export default MothersDay