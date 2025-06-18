'use client'

import React, { useState, useRef  } from 'react'

import Header from '@/components/features/main/common/Header'
import Nav from '@/components/features/main/common/Nav'
import KindredSorter from '@/components/features/main/dashboard/KindredSorter'
import HomeEmptyState from '@/components/features/main/dashboard/HomeEmptyState'
import ItemSorter from '@/components/features/main/common/ItemSorter'

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
      <div className='relative h-full w-full '>
        <Header
        leftIcon={Kindred}
        rightIcon={Filter} 
        title={'For Kindred'}
        onLeftClick={handleLeftIconClick}
        onRightClick={handleRightIconClick}
        />
        {leftModal && <div className='absolute z-50 top-20 left-4'> <KindredSorter /> </div>}
        {rightModal && <div className='absolute z-50 top-20 right-4'> <ItemSorter /> </div>}
        <div className='h-full w-full flex justify-center items-start overflow-hidden overflow-y-auto hide-scrollbar pt-12 lg:pt-[6rem] pb-[8rem]'>
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