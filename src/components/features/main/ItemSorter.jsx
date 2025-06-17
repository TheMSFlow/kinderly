import React from 'react'
import Selected from '@/components/icons/filter/Selected'
import Date from '@/components/icons/filter/Date'
import Amount from '@/components/icons/filter/Amount'
import Visual from '@/components/icons/filter/Visual'
import Compact from '@/components/icons/filter/Compact'
import Detailed from '@/components/icons/filter/Detailed'

const ItemSorter = () => {
  return (
    <div className='flex flex-col w-[12.5rem] justify-center items-center rounded-lg bg-[linear-gradient(137deg,_#0F172A_4.17%,_#334155_89.8%)] backdrop-blur-[15px] font-light text-sm'>
        <div className='flex h-12 w-full justify-center items-center border-b-2 border-slate-800 text-slate-50 font-normal'> 
          Filter by 
        </div>
        <button className='flex h-10 pr-[0.625rem] justify-between items-center self-stretch border-b border-slate-800 text-slate-50'>
          <div className='flex flex-row gap-0 justify-center items-center'>
            <Selected />
            <p>Date Created</p>
          </div>
          <Date />
        </button>
        <button className='flex h-10 pr-[0.625rem] justify-between items-center self-stretch border-b border-slate-800 text-slate-50'>
          <div className='flex flex-row gap-0 justify-center items-center'>
            <Selected />
            <p>Amount</p>
          </div>
          <Amount />
        </button>
        {/* <div className='h-1 w-full bg-slate-800'/> */}
        <div className='flex h-12 w-full justify-center items-center border-b-2 border-slate-800 text-slate-50 font-normal'> 
          View
        </div>
        <button className='flex h-10 pr-[0.625rem] justify-between items-center self-stretch border-b border-slate-800 text-slate-50'>
          <div className='flex flex-row gap-0 justify-center items-center'>
            <Selected />
            <p>Visual</p>
          </div>
          <Visual />
        </button>
        <button className='flex h-10 pr-[0.625rem] justify-between items-center self-stretch border-b border-slate-800 text-slate-50'>
          <div className='flex flex-row gap-0 justify-center items-center'>
            <Selected />
            <p>Compact</p>
          </div>
          <Compact />
        </button>
        <button className='flex h-10 pr-[0.625rem] justify-between items-center self-stretch border-b border-slate-800 text-slate-50'>
          <div className='flex flex-row gap-0 justify-center items-center'>
            <Selected />
            <p>Detailed</p>
          </div>
          <Detailed />
        </button>
    </div>
  )
}

export default ItemSorter