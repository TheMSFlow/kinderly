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
import Spacer from '@/components/common/Spacer'


const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
const days = Array.from({ length: 31 }, (_, i) => i + 1)

const MyEventCard = ({name, title, event = 'BirthDay', timeLeft}) => {

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
        {/* Default Card*/}
        <div 
        className='w-full lg:w-[21.875rem] h-auto flex flex-col gap-6 bg-gradient-to-b from-slate-300 to-slate-400 p-4 rounded-lg text-slate-800'>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row justify-center items-center gap-[0.625rem]'>
                    <div className='w-10 h-10 rounded-full bg-slate-100 grid place-items-center bg-gradient-to-b from-slate-300 to-slate-400 border-2 border-[#0F1D62]'>
                        <p className='font-medium text-lg text-[#0F1D62] '>{name?.[0]?.toUpperCase()}</p>
                    </div>
                    <div className='flex flex-col justify-between items-start h-full'>
                        <h1 className='font-playfair text-xl leading-none -mt-[0.125rem] pb-[0.25rem]'>For You</h1>
                        <p className='text-xs text-[#00513C]'>Starts in {timeLeft} days</p>
                    </div>
                </div>
                {eventIcons[event] || <BirthDay />}
            </div>
        </div>

        {/* Parent Card */}
        <div 
        className='w-full lg:w-[21.875rem] h-auto flex flex-col gap-6 bg-gradient-to-b from-slate-300 to-slate-400 p-4 rounded-lg text-slate-800'>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row justify-center items-center gap-[0.625rem]'>
                    <div className='w-10 h-10 rounded-full bg-slate-100 grid place-items-center bg-gradient-to-b from-slate-300 to-slate-400 border-2 border-[#0F1D62]'>
                        <p className='font-medium text-lg text-[#0F1D62] '>{name?.[0]?.toUpperCase()}</p>
                    </div>
                    <div className='flex flex-col justify-between items-start h-full'>
                        <h1 className='font-playfair text-xl leading-none -mt-[0.125rem] pb-[0.25rem]'>For You</h1>
                        <p className='text-xs '>See all your events for 2025</p>
                    </div>
                </div>
                {/* {eventIcons[event] || <BirthDay />} */}
            </div>
            <div className='flex flex-col gap-4'>
                {/* All the events related to the selectedKin */}
                <div className='flex flex-row justify-between items-center pb-2 border-b-[1px] border-b-border'>
                    <p className='text-xs text-[#00513C]'>Starts in {timeLeft} days</p>
                    {eventIcons[event] || <BirthDay />}
                </div>
                <div className='flex flex-row justify-between items-center pb-2 border-b-[1px]  border-b-border'>
                    <p className='text-xs text-[#00513C]'>Starts in {timeLeft} days</p>
                    <p></p>
                    {<FathersDay />}
                </div>
                <div className='flex flex-row justify-between items-center pb-2 border-b-[1px]  border-b-border'>
                    <p className='text-xs text-[#00513C]'>Starts in {timeLeft} days</p>
                    {<Anniversary />}
                </div>

                {/* Aniversary Form Start */}
                <div className='p-4 rounded-lg bg-bg-modal-backdrop'>
                    <p className="text-xs mb-2 text-slate-50">Enter your wedding anniversary date</p>
                    <div className="grid grid-cols-3 gap-2 mb-3 w-full">
                    <div className='relative w-full'>
                        <select 
                        
                        onChange={(e) => handleChange('month', e.target.value)}
                        className="appearance-none w-full pl-3 py-2 pr-7 rounded-md text-xs bg-bg-modal border border-btn-tertiary-border hover:bg-btn-tertiary-hover text-btn-tertiary-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
                        >
                        <option className="text-xs" value="">Month</option>
                        {months.map((m, i) => <option key={i} className="text-xs" value={m}>{m}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-btn-tertiary-text text-sm">
                            <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    <div className='relative w-full'>
                        <select 
                        
                        onChange={(e) => handleChange('day', e.target.value)}
                        className="appearance-none w-full pl-3 py-2 pr-7 rounded-md text-xs bg-bg-modal border border-btn-tertiary-border hover:bg-btn-tertiary-hover text-btn-tertiary-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem] hide-scrollbar"
                        >
                        <option className="text-xs" value="">Day</option>
                        {days.map(d => <option key={d} className="text-xs" value={d}>{d}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-btn-tertiary-text text-sm">
                            <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        </div>
                        <div className='relative w-full'>
                        <select 
                            
                            onChange={(e) => handleChange('year', e.target.value)}
                            className="appearance-none w-full pl-3 py-2 pr-7 rounded-md text-xs bg-bg-modal border border-btn-tertiary-border hover:bg-btn-tertiary-hover text-btn-tertiary-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem] hide-scrollbar"
                            >
                            <option className="text-xs" value="">Year</option>
                            {years.map(y => <option key={y} className="text-xs" value={y}>{y}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-btn-tertiary-text text-sm">
                                <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <Button 
                    className='w-full'
                    variant='primary'
                    >
                        Submit
                    </Button>
                </div>
            </div>
            {/* Aniversary Form End */}
        </div>
        <div className='w-full h-[2px] bg-b-border lg:hidden'/>
    </div>
    </>
  )
}

export default MyEventCard