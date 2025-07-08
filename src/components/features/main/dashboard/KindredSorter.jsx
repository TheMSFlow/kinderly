import React from 'react'

const KindredSorter = () => {
  return (
    <div className='flex flex-col justify-center items-center w-[12.5rem] h-auto rounded-lg border border-b-border bg-slate-800/30 backdrop-blur-[15px] text-sm font-light'>
        <button className='flex h-10 pr-[0.625rem] pl-6 items-center self-stretch border-b border-b-border'>
            <p>Mom</p>
        </button>
        <button className='flex h-10 pr-[0.625rem] pl-6 items-center self-stretch border-b border-b-border'>
            <p>Anty Shama</p>
        </button>
        <button className='flex h-10 pr-[0.625rem] pl-6 items-center self-stretch border-b border-b-border'>
            <p>Prudence</p>
        </button>
        <button className='flex h-10 pr-[0.625rem] pl-6 items-center self-stretch border-b border-b-border'>
            <p>Eden</p>
        </button>
        <button className='flex h-10 pr-[0.625rem] pl-6 items-center self-stretch border-b border-b-border'>
            <p>Charis</p>
        </button>
        <button className='flex h-10 pr-[0.625rem] pl-6 items-center self-stretch '>
            <p>View all</p>
        </button>
    </div>
  )
}

export default KindredSorter