import React from 'react'

const baseStyles = 'flex flex-row py-2 px-4 justify-center items-center rounded-[6px] focus:outline-none focus:ring-2 focus:ring-stone-600 focus:ring-offset-4 text-sm lg:text-base'
const variants = {
    primary: "bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover gap-2",
    secondary: "bg-transparent border border-btn-secondary-border hover:bg-btn-secondary-hover text-btn-secondary-text",
    tertiary: "bg-transparent border border-btn-tertiary-border hover:bg-btn-tertiary-hover text-btn-tertiary-text",
    warning: "bg-transparent border border-btn-warning-border hover:bg-btn-warning-hover text-btn-warning-text",
    ghost: "bg-transparent text-btn-ghost hover:text-btn-ghost-hover underline",
    wide: "bg-btn-wide hover:bg-btn-wide-hover text-white",

}

const Button = ({children, onClick, disabled=false,variant='primary', iconLeft: IconLeft, iconRight: IconRight}) => {
  return (
    <button 
    className={`${baseStyles} ${variants[variant]} ${ disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
    >
        {IconLeft && <IconLeft className="w-4 h-4  text-current" />}
        {children}
        {IconRight && <IconRight className="w-4 h-4 text-current" />}
    </button>
  )
}

export default Button