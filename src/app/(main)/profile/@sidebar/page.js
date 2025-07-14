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

import { kinSwitch } from '@/utils/kinSwitch'

const ProfileSidebar = () => {
      const router = useRouter();
      const [rightModal, setRightModal] = useState(false);
      const [wishlist, setWishlist] = useState([])
      const [openItemId, setOpenItemId] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('wishlist')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setWishlist(Array.isArray(parsed) ? parsed : [])
      } catch {
        setWishlist([])
      }
    }
  }, [])

  const handleLeftIconClick = () => router.push('/dashboard')
  const handleRightIconClick = () => setRightModal(prev => !prev)
  const handleSecondRightIconClick = () => {
    kinSwitch()
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
          {wishlist.length > 0 ? (
          <div className='flex flex-col gap-20 pt-6 w-full px-4 lg:hidden'>
            {wishlist.map((item, index) => (
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
    </>
  )
}

export default ProfileSidebar