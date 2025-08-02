'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import Nav from '@/components/features/main/common/Nav'
import Header from '@/components/features/main/common/Header'
import ItemSorter from '@/components/features/main/common/ItemSorter'
import ProfileEmptyState from '@/components/features/main/profile/ProfileEmptyState'

import Filter from '@/components/icons/header/Filter'
import Logout from '@/components/icons/header/Logout'
import Home from '@/components/icons/header/Home'
import ContentWrapSidebar from '@/components/features/main/common/ContentWrapSidebar'
import ItemCard from '@/components/features/main/common/ItemCard'
import Spacer from '@/components/common/Spacer'

import ModalDecision from '@/components/common/ModalDecision'
import { kinSwitch } from '@/utils/kinSwitch'
import { useSelectedKin } from '@/context/SelectedKinContext'
import { supabase } from '@/supabaseClient'
import { useFilterBy } from '@/context/useFilterBy'

const ProfileSidebar = () => {
    const router = useRouter();
    const [rightModal, setRightModal] = useState(false);
    const [items, setItems] = useState([])
    const [openItemId, setOpenItemId] = useState(null)
    const [kinSwitchModal, setKinSwitchModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const { filterBy, filterOrder } = useFilterBy()

    const { kin: selectedKin, loading: kinLoading } = useSelectedKin();
      
    const fetchItems = useCallback(async (kinId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('kin_id', kinId)
      .eq('type', 'want');

    if (!data?.find((item) => item.id === openItemId)) {
      setOpenItemId(null);
    }

    if (error) {
      console.error('Error fetching items:', error.message);
      setItems([]);
    } else {
      setItems(data || []);
    }

    setLoading(false);
    setIsReady(true);
  }, [openItemId]);

  const sortedItems = useMemo(() => {
  const sorted = [...items]

  if (filterBy === 'amount') {
    sorted.sort((a, b) => {
      const valA = parseFloat(a.item_amount || 0)
      const valB = parseFloat(b.item_amount || 0)
      return filterOrder === 'asc' ? valA - valB : valB - valA
    })
  } else {
    // Default: sort by created_at
    sorted.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return filterOrder === 'asc' ? dateA - dateB : dateB - dateA
    })
  }

  return sorted
}, [items, filterBy, filterOrder])

  // Handle first load
  useEffect(() => {
    let isMounted = true;

    if (!kinLoading && selectedKin?.id) {
      fetchItems(selectedKin.id).then(() => {
        if (isMounted) setIsReady(true);
      });
    } else if (!kinLoading && !selectedKin?.id) {
      setItems([]);
      setLoading(false);
      setIsReady(true);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedKin?.id, kinLoading, fetchItems]);

  // Listen for custom events
  useEffect(() => {
    const handleUpdate = () => {
      if (selectedKin?.id) fetchItems(selectedKin.id);
    };

    window.addEventListener('item-added', handleUpdate);
    window.addEventListener('item-updated', handleUpdate);
    window.addEventListener('item-deleted', handleUpdate);

    return () => {
      window.removeEventListener('item-added', handleUpdate);
      window.removeEventListener('item-updated', handleUpdate);
      window.removeEventListener('item-deleted', handleUpdate);
    };
  }, [fetchItems, selectedKin?.id]);


  const handleLeftIconClick = () => router.push('/dashboard')
  const handleRightIconClick = () => setRightModal(prev => !prev)
  const handleSecondRightIconClick = () => {
    setKinSwitchModal(true)
  }

  const handleKinSwitch = () => {
    kinSwitch()
    setKinSwitchModal(false)
  }

  return (
    <>
      <div className='relative h-full w-full'>
        {!isReady && (
          <ContentWrapSidebar>
            <div className="grid place-items-center w-full h-full text-center -mt-[2rem] text-text-secondary lg:hidden">Checking for items...</div>
          </ContentWrapSidebar>
        )}

        <Header
        leftIcon={Home}
        rightIcon={Filter} 
        secondRightIcon={Logout}
        title={`For ${selectedKin?.name || 'you'}`}
        onLeftClick={handleLeftIconClick}
        onRightClick={handleRightIconClick}
        onSecondRightClick={handleSecondRightIconClick}
        />

        {rightModal && (
          <div className='absolute z-10 top-20 right-4'> 
            <ItemSorter onClose={() => setRightModal(false)} /> 
          </div>
        )}

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
              />
            ))}
            <Spacer height="4rem" />
          </div>
        ) : (
          <ProfileEmptyState sidebar={true} />
        )}
        </ContentWrapSidebar>

        <div className='flex items-center justify-center w-full bg-transparent'>
          <Nav />
        </div>
      </div>
      
      <ModalDecision 
        show={kinSwitchModal}
        action={'log out from your profile?'}
        noToAction={() => setKinSwitchModal(false)}
        noText={'Not now'}
        yesToAction={handleKinSwitch}
        yesText={'Yes, log me out'}
      />
    </>
  )
}

export default ProfileSidebar