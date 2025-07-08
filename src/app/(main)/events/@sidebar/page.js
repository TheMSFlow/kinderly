'use client'

import React, { useState } from 'react'
import Nav from '@/components/features/main/common/Nav'
import Header from '@/components/features/main/common/Header'
import Filter from '@/components/icons/header/Filter'

import ViewSorter from '@/components/features/main/event/ViewSorter'
import EventCard from '@/components/features/main/event/EventCard'
import ContentWrapSidebar from '@/components/features/main/common/ContentWrapSidebar'
import EventDefaultState from '@/components/features/main/event/EventDefaultState'

const EventsSidebar = () => {
    const [rightModal, setRightModal] = useState(false);

    const handleRightIconClick = () => {
    setRightModal(prev => !prev);
  }
  return (
    <>
      <div className='relative h-full w-full'>
        <Header
        rightIcon={Filter} 
        title={'Upcoming Events'}
        onRightClick={handleRightIconClick}
        />
        {rightModal && <div className='absolute z-50 top-[4rem] lg:top-[4.5rem] right-4'> <ViewSorter /> </div>}
        <ContentWrapSidebar>
          <EventDefaultState sidebar={true}/>
        </ContentWrapSidebar>
        <div className='flex items-center justify-center w-full'>
          <Nav />
        </div>
      </div>
    </>
  )
}

export default EventsSidebar