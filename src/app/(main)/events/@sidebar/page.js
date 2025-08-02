'use client'

import React, { useState } from 'react'
import Nav from '@/components/features/main/common/Nav'
import Header from '@/components/features/main/common/Header'
import Filter from '@/components/icons/header/Filter'

import ViewSorter from '@/components/features/main/event/ViewSorter'
import EventCard from '@/components/features/main/event/EventCard'
import ContentWrapSidebar from '@/components/features/main/common/ContentWrapSidebar'
import EventDefaultState from '@/components/features/main/event/EventDefaultState'
import MyEventCard from '@/components/features/main/event/MyEventCard'
import Spacer from '@/components/common/Spacer'

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
          <div className='flex flex-col w-full item-center overflow-hidden overflow-y-auto hide-scrollbar'>
            <div className='pt-6 lg:pt-4 px-4'>
              <MyEventCard />
              <Spacer className={'hidden lg:block'} height='10rem' />
            </div>
            <EventDefaultState sidebar={true}/>
            <div className='pt-4 lg:hidden'>
              <EventCard />
            </div>
          </div>
        </ContentWrapSidebar>
        <div className='flex items-center justify-center w-full'>
          <Nav />
        </div>
      </div>
    </>
  )
}

export default EventsSidebar