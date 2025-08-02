'use client'

const Spacer = ({ height = '0.5rem', className }) => {
  return (
    <div className={`w-full block ${className || ''}`} style={{ minHeight: height }} />
  )
}

export default Spacer
