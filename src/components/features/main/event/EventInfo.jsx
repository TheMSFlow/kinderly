import React from 'react'
import PartyBalloons from '@/components/icons/events/PartyBalloons'

const EventInfo = ({info}) => {
  return (
    <div className='flex flex-col gap-0 justify-center items-center h-fit w-full'>
        <div className='text-b-border '><PartyBalloons /></div>
        <h3 className=' text-center text-xl font-playfair mb-2'>Where's the party at?</h3>
        <p className=' text-center text-xs '>{info}</p>
    </div>
  )
}

export default EventInfo