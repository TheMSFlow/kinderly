'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import Nav from '@/components/features/main/common/Nav'
import Header from '@/components/features/main/common/Header'
import ItemSorter from '@/components/features/main/common/ItemSorter'
import ProfileEmptyState from '@/components/features/main/profile/ProfileEmptyState'

import Filter from '@/components/icons/header/Filter'
import Logout from '@/components/icons/header/Logout'
import Home from '@/components/icons/header/Home'
import ContentWrapSidebar from '@/components/features/main/common/ContentWrapSidebar'
import ItemCard from '@/components/features/main/profile/ItemCard'

import ModalDecision from '@/components/common/ModalDecision'
import { kinSwitch } from '@/utils/kinSwitch'
import { getSelectedKin } from '@/app/lib/kinCookies'
import { supabase } from '@/supabaseClient'

const ProfileSidebar = () => {
      const router = useRouter();
      const [rightModal, setRightModal] = useState(false);
      const [items, setItems] = useState([])
      const [openItemId, setOpenItemId] = useState(null)
      const [kinSwitchModal, setKinSwitchModal] = useState(false);
      
    useEffect(() => {
    const fetchItems = async () => {
      const kin = getSelectedKin()
      if (!kin?.id) return

      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('kin_id', kin.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching items:', error)
        return
      }

      setItems(data)
    }

    fetchItems()
  }, [])

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
        <Header
        leftIcon={Home}
        rightIcon={Filter} 
        secondRightIcon={Logout}
        title={'For You'}
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
          {items.length > 0 ? (
          <div className='flex flex-col gap-20 pt-6 w-full px-4 lg:hidden'>
            {items.map((item, index) => (
              <ItemCard
                key={item.id}
                id={item.id}
                itemImage={item.photo}
                itemTitle={item.name}
                itemAmount={item.amount}
                itemReason={item.reason}
                itemLink={item.link}
                itemContact={item.phone}
                openItemId={openItemId}
                setOpenItemId={setOpenItemId}
              />
            ))}
          </div>
        ) : (
          <ProfileEmptyState sidebar={true} />
        )}
        </ContentWrapSidebar>
        <div className='flex items-center justify-center w-full'>
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