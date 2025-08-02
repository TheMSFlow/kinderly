import React from 'react'
import Selected from '@/components/icons/filter/Selected'
import { useShowKin } from '@/context/showKin'

const KindredSorter = ({kins, onClose,}) => {
    const { showKinId, setShowKinId } = useShowKin()

  return (
    <div className='flex flex-col justify-center items-center w-[12.5rem] h-auto rounded-lg border border-b-border bg-slate-800/30 backdrop-blur-[15px] text-sm font-light'>
        {kins.map((kin) => (
        <button
          key={kin.id}
          onClick={() => {
            setShowKinId(kin.id)
            onClose?.()
          }}
          className={'flex h-10 pr-[1rem] items-center self-stretch border-b border-b-border'}
        >
          <div className='flex flex-row gap-1 justify-center items-center'>
                {showKinId === kin.id ? <Selected/> : <div className='h-6 w-6'></div>}
                <p className='truncate'>{kin.callsign}</p>
            </div>
        </button>
      ))}
        <button
            onClick={() => {
              setShowKinId(null)
              onClose?.()
            }}
            className={'flex h-10 pr-[0.625rem] items-center self-stretch border-b border-b-border'}
          >
            <div className='flex flex-row gap-1 justify-center items-center'>
                {showKinId === null ? <Selected/> : <div className='h-6 w-6'></div>}
                <p>View all</p>
            </div>
        </button>
    </div>
  )
}

export default KindredSorter