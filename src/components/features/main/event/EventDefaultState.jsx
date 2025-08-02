import React from 'react'
import EventInfo from './EventInfo'
import Spacer from '@/components/common/Spacer'

const EventDefaultState = ({sidebar, main}) => {
  return (
    <>
    <div className='w-full h-full'>
      {sidebar && <div className=' block h-full w-full px-4 pt-6 lg:hidden'>
          <EventInfo info={"You'll see more events as soon as your family members log in."} />
          <Spacer height='10rem' />
      </div>}

      {main && <div className='flex flex-col justify-center items-center gap-6 h-full'>
          <EventInfo info={"You'll see more events as soon as your family members log in."} />
      </div>}
    </div>
    </>
  )
}

export default EventDefaultState