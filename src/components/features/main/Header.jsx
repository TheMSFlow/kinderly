import React from 'react'


const Header = ({leftIcon:LeftIcon, rightIcon:RightIcon, secondRightIcon:SecondRightIcon, title, onLeftClick, onRightClick, onSecondRightClick}) => {
  return (
    <div className='relative flex flex-row items-center justify-between w-full h-12 lg:h-[5rem] px-4 pb-4 lg:pb-0  border-b border-b-border mt-12 lg:mt-0'>
      <div className='absolute left-1/2 -translate-x-1/2 font-playfair text-3xl text-heading whitespace-nowrap'>{title}</div>
      <button onClick={onLeftClick}>{LeftIcon && <LeftIcon />}</button>
      <div className='flex justify-center items-center gap-4'>
        <button onClick={onRightClick}>{RightIcon && <RightIcon />}</button>
        {SecondRightIcon && <button onClick={onSecondRightClick}>{SecondRightIcon && <SecondRightIcon />}</button>}
      </div>
    </div>
  )
}

export default Header