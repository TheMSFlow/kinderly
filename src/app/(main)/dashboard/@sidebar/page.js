'use client'

import React, { useState, useRef  } from 'react'

import Header from '@/components/features/main/Header'
import Nav from '@/components/features/main/Nav'
import KindredSorter from '@/components/features/main/KindredSorter'
import HomeEmptyState from '@/components/features/main/HomeEmptyState'
import ItemSorter from '@/components/features/main/ItemSorter'

import Kindred from '@/components/icons/header/Kindred'
import Filter from '@/components/icons/header/Filter'

const DashboardSidebar = () => {
  const [leftModal, setLeftModal] = useState(false);
  const [rightModal, setRightModal] = useState(false);


  const handleLeftIconClick = () => {
    setLeftModal(prev => !prev);
    if (rightModal) {
      setRightModal(false)
    }
  }

  const handleRightIconClick = () => {
    setRightModal(prev => !prev);
    if (leftModal) {
      setLeftModal(false)
    }
  }
  return (
    <>
      <div className='relative h-full w-full grid grid-rows-[6rem_1fr] lg:grid-rows-[5rem_1fr]'>
        <Header
        leftIcon={Kindred}
        rightIcon={Filter} 
        title={'For Kindred'}
        onLeftClick={handleLeftIconClick}
        onRightClick={handleRightIconClick}
        />
        {leftModal && <div className='absolute z-10 top-20 left-4'> <KindredSorter /> </div>}
        {rightModal && <div className='absolute z-10 top-20 right-4'> <ItemSorter /> </div>}
        <div className='flex justify-center items-start h-full'>
          <HomeEmptyState />
        </div>
        <div className='flex items-center justify-center w-full'>
        <Nav />
        </div>
      </div>
    </>
  )
}

export default DashboardSidebar