import Header from '@/components/common/Header'
import Nav from '@/components/common/Nav'
import React from 'react'
import Kindred from '@/components/icons/header/Kindred'
import Filter from '@/components/icons/header/Filter'

const DashboardSidebar = () => {
  return (
    <>
      <div className='h-full w-full grid grid-rows-[3rem_1fr_6.25rem] lg:grid-rows-[4.5rem_1fr_6.25rem]'>
        <Header
        leftIcon={Kindred}
        rightIcon={Filter} 
        title={'For Kindred'}
        />
        <div className='h-full'> Content </div>
        <div className='flex items-center justify-center w-full'>
          <Nav />
        </div>
      </div>
    </>
  )
}

export default DashboardSidebar