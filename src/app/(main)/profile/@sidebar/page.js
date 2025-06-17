'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import Nav from '@/components/features/main/Nav'
import Header from '@/components/features/main/Header'
import ItemSorter from '@/components/features/main/ItemSorter'
import ProfileEmptyState from '@/components/features/main/ProfileEmptyState'

import Filter from '@/components/icons/header/Filter'
import Logout from '@/components/icons/header/Logout'
import Home from '@/components/icons/header/Home'

const ProfileSidebar = () => {
      const router = useRouter();
      const [rightModal, setRightModal] = useState(false);

      const handleLeftIconClick = () => {
        router.push('/dashboard');
      }

      const handleRightIconClick = () => {
        setRightModal(prev => !prev);
      }

    const handleSecondRightIconClick = () => {
      router.push('/login');
    }

  return (
    <>
      <div className='relative h-full w-full grid grid-rows-[6rem_1fr] lg:grid-rows-[5rem_1fr]'>
        <Header
        leftIcon={Home}
        rightIcon={Filter} 
        secondRightIcon={Logout}
        title={'For You'}
        onLeftClick={handleLeftIconClick}
        onRightClick={handleRightIconClick}
        onSecondRightClick={handleSecondRightIconClick}
        />
        {rightModal && <div className='absolute z-10 top-20 right-4'> <ItemSorter /> </div>}
        <div className='flex justify-center items-start h-full'>
          <ProfileEmptyState />
        </div>
        <div className='flex items-center justify-center w-full'>
          <Nav />
        </div>
      </div>
    </>
  )
}

export default ProfileSidebar