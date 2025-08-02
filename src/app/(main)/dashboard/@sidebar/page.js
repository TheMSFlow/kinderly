'use client'

import React, { useState, useEffect, useMemo  } from 'react'

import Header from '@/components/features/main/common/Header'
import Nav from '@/components/features/main/common/Nav'
import KindredSorter from '@/components/features/main/dashboard/KindredSorter'
import HomeEmptyState from '@/components/features/main/dashboard/HomeEmptyState'
import KinEmptyState from '@/components/features/main/dashboard/KinEmptyState'
import ItemSorter from '@/components/features/main/common/ItemSorter'

import Kindred from '@/components/icons/header/Kindred'
import Filter from '@/components/icons/header/Filter'
import ContentWrapSidebar from '@/components/features/main/common/ContentWrapSidebar'
import ItemCard from '@/components/features/main/common/ItemCard'
import Spacer from '@/components/common/Spacer'

import { useSelectedKin } from '@/context/SelectedKinContext'
import { useShowKin } from '@/context/showKin'
import { useFilterBy } from '@/context/useFilterBy'
import { supabase } from '@/supabaseClient'


const DashboardSidebar = () => {
  const [leftModal, setLeftModal] = useState(false);
  const [rightModal, setRightModal] = useState(false);
  const { filterBy, filterOrder } = useFilterBy()
  
  const { kin: selectedKin, loading: kinLoading } = useSelectedKin()
  const { showKinId } = useShowKin()

  const [openItemId, setOpenItemId] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [kins, setKins] = useState([])

  useEffect(() => {
  const fetchKins = async () => {
    if (!kinLoading && selectedKin?.id) {
      const { data } = await supabase
        .from('kin')
        .select('*')
        .eq('status', true)
        .neq('id', selectedKin.id)
      setKins(data || [])
    }
  }

  fetchKins()
}, [kinLoading, selectedKin?.id])


  useEffect(() => {
    const fetchDashboardItems = async () => {
      if (!kinLoading && selectedKin?.id) {
        setLoading(true)
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .neq('kin_id', selectedKin.id) // ✅ exclude selected kin
          .eq('type', 'want')

        if (error) {
          console.error('Dashboard fetch error:', error.message)
          setItems([])
        } else {
          setItems(
            showKinId
              ? (data || []).filter((item) => item.kin_id === showKinId)
              : data || []
          )
        }

        setLoading(false)
        setIsReady(true)
      }
    }

    fetchDashboardItems()
  }, [kinLoading, selectedKin?.id, showKinId])

  const sortedItems = useMemo(() => {
  const sorted = [...items]

  if (filterBy === 'amount') {
    sorted.sort((a, b) => {
      const valA = parseFloat(a.item_amount || 0)
      const valB = parseFloat(b.item_amount || 0)
      return filterOrder === 'asc' ? valA - valB : valB - valA
    })
  } else {
    sorted.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return filterOrder === 'asc' ? dateA - dateB : dateB - dateA
    })
  }

  return sorted
}, [items, filterBy, filterOrder])



  const handleLeftIconClick = () => {
    setLeftModal(prev => !prev);
    if (rightModal) {
      setRightModal(false)
    }
  }

  const handleRightIconClick = () => {
    setRightModal(prev => !prev);
    if (leftModal) {
      setLeftModal(false)
    }
  }

  const selectedKinForView = useMemo(() => {
  return kins.find((k) => k.id === showKinId) || null;
}, [kins, showKinId]);

  return (
    <>
      <div className='relative h-full w-full '>
        {!isReady && (
          <ContentWrapSidebar>
            <div className="grid place-items-center w-full h-full text-center -mt-[2rem] text-text-secondary lg:hidden">Checking for items...</div>
          </ContentWrapSidebar>
        )}

        <Header
        leftIcon={Kindred}
        rightIcon={Filter} 
        title={showKinId && selectedKinForView ? `For ${selectedKinForView.callsign}` : 'For Kindred'}
        onLeftClick={handleLeftIconClick}
        onRightClick={handleRightIconClick}
        />

        {leftModal && (
          <div className='absolute z-50 top-[4rem] lg:top-[4.5rem] left-4'> <KindredSorter 
            kins={kins}
            onClose={() => setLeftModal(false)}
            /> 
          </div>)}

        {rightModal && <div className='absolute z-50 top-[4rem] lg:top-[4.5rem] right-4'> <ItemSorter onClose={() => setRightModal(false)} /> </div>}
        
        <ContentWrapSidebar>
          {sortedItems.length > 0 ? (
            <div className='lg:hidden flex flex-col justify-start items-center w-full gap-4 pt-4 px-4 h-full overflow-hidden overflow-y-auto hide-scrollbar'>
              {sortedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  itemImage={item.item_image}
                  itemTitle={item.item_name}
                  itemAmount={item.item_amount}
                  itemReason={item.item_info}
                  itemLink={item.item_link}
                  itemContact={item.item_contact}
                  openItemId={openItemId}
                  setOpenItemId={setOpenItemId}
                  kins={kins}
                  {...item}
                />
              ))}
              <Spacer height="4rem" />
            </div>
          ) : showKinId ? (
            <KinEmptyState kinName={selectedKinForView?.callsign || 'Kin'} />

          ) : (
            <HomeEmptyState />
          )}
        </ContentWrapSidebar>

        <div className='flex items-center justify-center w-full'>
        <Nav />
        </div>
      </div>
    </>
  )
}

export default DashboardSidebar