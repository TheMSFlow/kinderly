import React from 'react'
import Image from 'next/image'

const ChildrensDay = () => {
  return (
    <div className='relative flex items-center justify-center w-fit px-[0.625rem] py-[0.375rem] bg-[#FFD662] rounded-md'>
        <p className='font-normal text-[10px] text-slate-800'>Children's Day</p>
        <div className='absolute -top-1 -right-1'>
            <Image
                src={'/assets/event-icons/child.webp'}
                width={18}
                height={18}
                alt=''
            />
        </div>
    </div>
  )
}

export default ChildrensDay