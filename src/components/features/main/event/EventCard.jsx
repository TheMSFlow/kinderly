import React from 'react'
import Button from '@/components/common/Button'

// event imports
import BirthDay from '@/components/icons/events/BirthDay'
import ChildrensDay from '@/components/icons/events/ChildrensDay'
import BoyChildDay from '@/components/icons/events/BoyChildDay'
import GirlChildDay from '@/components/icons/events/GirlChildDay'
import FathersDay from '@/components/icons/events/FathersDay'
import MothersDay from '@/components/icons/events/MothersDay'
import Anniversary from '@/components/icons/events/Anniversary'
import ValentinesDay from '@/components/icons/events/ValentinesDay'
import GrandFathersDay from '@/components/icons/events/GrandFathersDay'
import GrandMothersDay from '@/components/icons/events/GrandMothersDay'
import GrandAnniversary from '@/components/icons/events/GrandAnniversary'

const EventCard = ({name, title, event = 'BirthDay', view = 'detailed', timeLeft, content}) => {

    const eventIcons = {
        BirthDay: <BirthDay />,
        ChildrensDay: <ChildrensDay />,
        BoyChildDay: <BoyChildDay />,
        GirlChildDay: <GirlChildDay />,
        FathersDay: <FathersDay />,
        MothersDay: <MothersDay />,
        Anniversary: <Anniversary />,
        ValentinesDay: <ValentinesDay />,
        GrandFathersDay: <GrandFathersDay />,
        GrandMothersDay: <GrandMothersDay />,
        GrandAnniversary: <GrandAnniversary />
    }

  return (
    <>
    <div className='flex flex-col gap-8 justify-center items-center'>
        {/* Detailed card */}
        <div className='mx-4 lg:mx-0 w-full lg:w-[21.875rem] h-auto flex flex-col gap-6 bg-gradient-to-b from-slate-300 to-slate-400 p-4 rounded-lg text-slate-800'>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row justify-center items-center gap-[0.625rem]'>
                    <div className='w-10 h-10 rounded-full bg-slate-100 grid place-items-center bg-gradient-to-b from-slate-300 to-slate-400 border-2 border-[#0F1D62]'>
                        <p className='font-medium text-lg text-[#0F1D62] '>{name?.[0]?.toUpperCase()}</p>
                    </div>
                    <div className='flex flex-col justify-between h-full'>
                        <h1 className='font-playfair text-xl leading-none -mt-[0.125rem] pb-[0.25rem]'>For {title}</h1>
                        <p className='text-xs text-[#00513C]'>Starts in {timeLeft} days</p>
                    </div>
                </div>
                {eventIcons[event] || <BirthDay />}
            </div>
            <p className='text-sm'>{content}</p>
            <Button 
            variant='event'
            to={''}
            >
                {`View ${title}'s list`}
            </Button>
        </div>

        {/* Compact card */}
        <button 
        onClick={()=>{}}
        className='mx-4 lg:mx-0 w-full lg:w-[21.875rem] h-auto flex flex-col gap-6 bg-gradient-to-b from-slate-300 to-slate-400 p-4 rounded-lg text-slate-800'>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row justify-center items-center gap-[0.625rem]'>
                    <div className='w-10 h-10 rounded-full bg-slate-100 grid place-items-center bg-gradient-to-b from-slate-300 to-slate-400 border-2 border-[#0F1D62]'>
                        <p className='font-medium text-lg text-[#0F1D62] '>{name?.[0]?.toUpperCase()}</p>
                    </div>
                    <div className='flex flex-col justify-between items-start h-full'>
                        <h1 className='font-playfair text-xl leading-none -mt-[0.125rem] pb-[0.25rem]'>For {title}</h1>
                        <p className='text-xs text-[#00513C]'>Starts in {timeLeft} days</p>
                    </div>
                </div>
                {eventIcons[event] || <BirthDay />}
            </div>
        </button>

        {/* Visual card */}
        
        <button 
        onClick={()=>{}}
        className='relative w-[6.25rem] h-[6.25rem] rounded-full bg-slate-100 grid place-items-center bg-gradient-to-b from-slate-300 to-slate-400 border-2 border-[#0F1D62]'>
            <p className='font-medium text-3xl text-[#0F1D62] '>{name?.[0]?.toUpperCase()}</p>
            <div className='absolute -top-2'>{eventIcons[event] || <BirthDay />}</div> 
        </button>

    </div>
    </>
  )
}

export default EventCard