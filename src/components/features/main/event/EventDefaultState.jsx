import React from 'react'
import MyEventCard from './MyEventCard'
import PartyBalloons from '@/components/icons/events/PartyBalloons'

const EventDefaultState = ({sidebar, main}) => {
  return (
    <>
    <div className='flex flex-col gap-6 justify-start items-center pt-8 lg:pt-0 w-full h-full'>
      {sidebar && <div className='flex flex-col gap-6 h-full w-full px-4'>
          <div>
              <MyEventCard 
              name={'Michael'}
              timeLeft={39}/>
          </div>
          <div className='flex flex-col gap-0 justify-center items-center h-full w-full md:pt-8 lg:hidden'>
              <div className='text-b-border '><PartyBalloons /></div>
              <h3 className=' text-center text-xl font-playfair mb-2'>Where's the party at?</h3>
              <p className=' text-center text-xs '>You'll see more events as soon as your family members log in.</p>
          </div>
      </div>}

      {main && <div className='flex flex-col gap-6 h-full'>
          <div className='flex flex-col gap-0 justify-center items-center h-full'>
              <div className='text-line-border '><PartyBalloons /></div>
              <h3 className=' text-center text-xl font-playfair mb-2'>Where's the party at?</h3>
              <p className=' text-center text-xs '>You'll see more events as soon as your family members log in.</p>
          </div>
      </div>}
    </div>
    </>
  )
}

export default EventDefaultState