"use client";

import React, { useEffect, useState } from 'react'
import Image from 'next/image';

const baseStyles = 'bg-[linear-gradient(180deg,_theme(colors.slate.300),_theme(colors.slate.400))]';

const variants = {
  small: {
    className: 'w-[6.25rem] h-[6.25rem]',
    src: '/assets/face-sm.svg',
    width: 63.3,
    height: 52,
  },
  large: {
    className: 'w-[9.375rem] h-[9.375rem]',
    src: '/assets/face-lg.svg',
    width: 81.5,
    height: 66,
  }
};

const KinAvatar = ({profile, showImage = false, onClick}) => {
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
      className={`${baseStyles} ${className} rounded-lg grid place-items-center`}
    >
      {profile && showImage && <Image src={src} width={width} height={height} alt="" />}
    </button>
  );
}

export default KinAvatar
