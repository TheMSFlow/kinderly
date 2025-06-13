import React from 'react'


const Header = ({leftIcon:LeftIcon, rightIcon:RightIcon, title}) => {
  return (
    <div className='relative flex flex-row items-center justify-between w-full h-12 lg:h-[4.5rem] px-4 border-b border-b-border'>
      <div className='absolute left-1/2 -translate-x-1/2 font-playfair text-3xl text-heading whitespace-nowrap'>{title}</div>
      <button>{LeftIcon && <LeftIcon />}</button>
      <button>{RightIcon && <RightIcon />}</button>
    </div>
  )
}

export default Header