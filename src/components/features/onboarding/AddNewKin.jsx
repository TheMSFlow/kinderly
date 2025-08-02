"use client";

import React, { useEffect, useState } from 'react'
import Image from 'next/image';

const baseStyles = 'bg-transparent border-4 border-dashed border-line-border rounded-lg grid place-items-center';

const variants = {
  small: {
    className: 'w-[6.25rem] h-[6.25rem]',
    src: '/assets/add-sm.svg',
    width: 40,
    height: 40,
  },
  large: {
    className: 'w-[9.375rem] h-[9.375rem]',
    src: '/assets/add-lg.svg',
    width: 60,
    height: 60,
  }
};

const AddNewKin = ({profile, onClick}) => {
    const [currentVariant, setCurrentVariant] = useState('small');
    
      useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        setCurrentVariant(mediaQuery.matches ? 'large' : 'small');
    
        const handler = (e) => setCurrentVariant(e.matches ? 'large' : 'small');
        mediaQuery.addEventListener('change', handler);
    
        return () => mediaQuery.removeEventListener('change', handler);
      }, []);
    
      const { className, src, width, height } = variants[currentVariant];

  return (
    <button 
        onClick={onClick}
        className={`${baseStyles} ${className} `}
    >
        {profile && <Image src={src} width={width} height={height} alt="" priority/>}
    </button>
  )
}

export default AddNewKin