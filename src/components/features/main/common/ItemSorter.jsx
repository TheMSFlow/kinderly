'use client'
import React, { useState } from 'react'
import Selected from '@/components/icons/filter/Selected'
import Up from '@/components/icons/filter/Up'
import Down from '@/components/icons/filter/Down'
import Date from '@/components/icons/filter/Date'
import Amount from '@/components/icons/filter/Amount'
import Visual from '@/components/icons/filter/Visual'
import Compact from '@/components/icons/filter/Compact'
import Detailed from '@/components/icons/filter/Detailed'

import { useItemView } from '@/context/useItemView'
import { useFilterBy } from '@/context/useFilterBy'

const ItemSorter = ({ onClose }) => {
  const { filterBy, filterOrder, toggleFilterBy } = useFilterBy()
  const { view: selectedView, setView: setSelectedView } = useItemView()

  return (
    <div className='flex flex-col w-[13rem] justify-center items-center rounded-lg bg-[linear-gradient(137deg,_#0F172A_4.17%,_#334155_89.8%)] backdrop-blur-[15px] font-light text-sm px-1'>
      <div className='flex h-12 w-full justify-center items-center border-b-2 border-slate-800 text-slate-50 font-normal'>
        Filter by
      </div>

      <button
        onClick={() => {
          toggleFilterBy('date')
          onClose?.()
        }}
        className='flex h-10 pr-[0.625rem] justify-between items-center self-stretch border-b border-slate-800 text-slate-50'
      >
        <div className='flex flex-row gap-0 justify-center items-center'>
          {filterBy === 'date' ? (filterOrder === 'asc' ? <Up /> : <Down />) : <div className='h-6 w-6'></div>}
          <p>Date</p>
        </div>
        <Date />
      </button>

      <button
        onClick={() => {
          toggleFilterBy('amount')
          onClose?.()
        }}
        className='flex h-10 pr-[0.625rem] justify-between items-center self-stretch border-b border-slate-800 text-slate-50'
      >
        <div className='flex flex-row gap-0 justify-center items-center'>
          {filterBy === 'amount' ? (filterOrder === 'asc' ? <Up /> : <Down />) : <div className='h-6 w-6'></div>}
          <p>Amount</p>
        </div>
        <Amount />
      </button>

      <div className='flex h-12 w-full justify-center items-center border-b-2 border-slate-800 text-slate-50 font-normal'>
        View
      </div>

      <button
        onClick={() => {
          setSelectedView('detailed')
          onClose?.()
        }}
        className='flex h-10 pr-[0.625rem] justify-between items-center self-stretch border-b border-slate-800 text-slate-50'
      >
        <div className='flex flex-row gap-0 justify-center items-center'>
          {selectedView === 'detailed' ? <Selected /> : <div className='h-6 w-6'></div>}
          <p>Detailed</p>
        </div>
        <Detailed />
      </button>

      <button
        onClick={() => {
          setSelectedView('compact')
          onClose?.()
        }}
        className='flex h-10 pr-[0.625rem] justify-between items-center self-stretch border-b border-slate-800 text-slate-50'
      >
        <div className='flex flex-row gap-0 justify-center items-center'>
          {selectedView === 'compact' ? <Selected /> : <div className='h-6 w-6'></div>}
          <p>Compact</p>
        </div>
        <Compact />
      </button>

      <button
        onClick={() => {
          setSelectedView('visual')
          onClose?.()
        }}
        className='flex h-10 pr-[0.625rem] justify-between items-center self-stretch border-b border-slate-800 text-slate-50'
      >
        <div className='flex flex-row gap-0 justify-center items-center'>
          {selectedView === 'visual' ? <Selected /> : <div className='h-6 w-6'></div>}
          <p>Visual</p>
        </div>
        <Visual />
      </button>
    </div>
  )
}

export default ItemSorter
