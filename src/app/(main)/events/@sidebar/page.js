import React from 'react'
import Nav from '@/components/common/Nav'
import Header from '@/components/common/Header'
import Filter from '@/components/icons/header/Filter'

const EventsSidebar = () => {
  return (
    <>
      <div className='h-full w-full grid grid-rows-[3rem_1fr_6.25rem] lg:grid-rows-[4.5rem_1fr_6.25rem]'>
        <Header
        rightIcon={Filter} 
        title={'Upcoming Events'}
        />
        <div className='h-full'> Content </div>
        <div className='flex items-center justify-center w-full'>
          <Nav />
        </div>
      </div>
    </>
  )
}

export default EventsSidebar