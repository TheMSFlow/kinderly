'use client'

import React, { useState } from 'react'
import Nav from '@/components/features/main/common/Nav'
import Header from '@/components/features/main/common/Header'
import Filter from '@/components/icons/header/Filter'

import ViewSorter from '@/components/features/main/event/ViewSorter'
import EventCard from '@/components/features/main/event/EventCard'

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
        {rightModal && <div className='absolute z-50 top-20 right-4'> <ViewSorter /> </div>}
        <div className='h-full w-full flex justify-center items-start overflow-hidden overflow-y-auto hide-scrollbar pt-12 lg:pt-[6rem] pb-[8rem]'>
          <EventCard 
            name={'Michael'}
            title={'Dad'}
            timeLeft={29}
            content={"What are you planning? Remember it’s about how much you do, but how much thoughtfulness you put into what you do. See dad’s wish list for more ideas."}
          />
        </div>
        <div className='flex items-center justify-center w-full'>
          <Nav />
        </div>
      </div>
    </>
  )
}

export default EventsSidebar