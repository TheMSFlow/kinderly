'use client'

import React, { useState } from 'react'
import Nav from '@/components/features/main/Nav'
import Header from '@/components/features/main/Header'
import Filter from '@/components/icons/header/Filter'

import ViewSorter from '@/components/features/main/ViewSorter'
import BirthDay from '@/components/icons/events/BirthDay'
import ValentinesDay from '@/components/icons/events/ValentinesDay'
import ChildrensDay from '@/components/icons/events/ChildrensDay'
import GirlChildDay from '@/components/icons/events/GirlChildDay'
import BoyChildDay from '@/components/icons/events/BoyChildDay'
import GrandFathersDay from '@/components/icons/events/GrandFathersDay'
import GrandMothersDay from '@/components/icons/events/GrandMothersDay'
import GrandAnniversary from '@/components/icons/events/GrandAnniversary'
import FathersDay from '@/components/icons/events/FathersDay'
import MothersDay from '@/components/icons/events/MothersDay'
import Anniversary from '@/components/icons/events/Anniversary'

const EventsSidebar = () => {
    const [rightModal, setRightModal] = useState(false);

    const handleRightIconClick = () => {
    setRightModal(prev => !prev);
  }
  return (
    <>
      <div className='relative h-full w-full grid grid-rows-[6rem_1fr] lg:grid-rows-[5rem_1fr]'>
        <Header
        rightIcon={Filter} 
        title={'Upcoming Events'}
        onRightClick={handleRightIconClick}
        />
        {rightModal && <div className='absolute z-10 top-20 right-4'> <ViewSorter /> </div>}
        <div className='h-full'>
          <div className='flex flex-wrap gap-4 w-80% justify-center items-center py-4'>
            <BirthDay />
            <ValentinesDay />
            <ChildrensDay />
            <GirlChildDay />
            <BoyChildDay />
            <GrandFathersDay />
            <GrandMothersDay />
            <GrandAnniversary />
            <FathersDay />
            <MothersDay />
            <Anniversary />
          </div>
        </div>
        <div className='flex items-center justify-center w-full'>
          <Nav />
        </div>
      </div>
    </>
  )
}

export default EventsSidebar