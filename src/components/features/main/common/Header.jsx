import React from 'react'


const Header = ({leftIcon:LeftIcon, rightIcon:RightIcon, secondRightIcon:SecondRightIcon, title, onLeftClick, onRightClick, onSecondRightClick}) => {
  return (
    <div className='absolute top-0 z-50 flex flex-row items-center justify-between w-full h-[4rem] lg:h-[4.5rem] px-4 pt-4 lg:pt-0 pb-4 lg:pb-0  border-b border-b-border bg-bg-header backdrop-blur-[15px]'>
      <div className='absolute left-1/2 -translate-x-1/2 font-playfair text-base lg:text-xl text-heading whitespace-nowrap'>{title}</div>
      <button onClick={onLeftClick}>{LeftIcon && <LeftIcon />}</button>
      <div className='flex justify-center items-center gap-4'>
        <button onClick={onRightClick}>{RightIcon && <RightIcon />}</button>
        {SecondRightIcon && <button onClick={onSecondRightClick}>{SecondRightIcon && <SecondRightIcon />}</button>}
      </div>
    </div>
  )
}

export default Header