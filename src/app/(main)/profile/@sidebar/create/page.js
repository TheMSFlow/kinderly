import React from 'react'

import SubHeader from '@/components/features/main/common/SubHeader'
import ItemForm from '@/components/features/main/profile/ItemForm'


const CreateNewItemSidebar = () => {
  return (
    <>
      <div className='relative h-full w-full'>
        <SubHeader 
        title={'New Item'}
        />
        <div className='h-full w-full flex justify-center items-start overflow-hidden overflow-y-auto hide-scrollbar pt-10 lg:pt-[4rem] pb-[8rem] px-4'>
        <ItemForm />
        </div>
      </div>    
    </>
  )
}

export default CreateNewItemSidebar