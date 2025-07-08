'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Back from '../../../icons/header/Back'



const SubHeader = ({rightIcon:RightIcon, title}) => {
  const router = useRouter()

  const handleBackButtonClick = () => {
    router.replace('/profile')
  }
  
  return (
    <div className='absolute top-0 z-50 flex flex-row items-center justify-between w-full h-[3rem] lg:h-[4.5rem] px-4 pt-4 lg:pt-0 pb-4 lg:pb-0  border-b border-b-border bg-bg-header backdrop-blur-[15px]'>
      <div className='absolute left-1/2 -translate-x-1/2 font-playfair text-base text-heading whitespace-nowrap'>{title}</div>
      <button onClick={handleBackButtonClick}><Back /></button>
      <button>{RightIcon && <RightIcon />}</button>
    </div>
  )
}

export default SubHeader