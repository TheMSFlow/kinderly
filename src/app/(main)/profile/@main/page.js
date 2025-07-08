'use client'

import React, { useEffect, useState } from 'react'

import ContentWrapMain from '@/components/features/main/common/ContentWrapMain'
import ProfileEmptyState from '@/components/features/main/profile/ProfileEmptyState'
import ItemCard from '@/components/features/main/profile/ItemCard'
import Spacer from '@/components/common/Spacer'


const ProfileMain = () => {
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
  return (
    <>
      <ContentWrapMain>
        {wishlist.length > 0 ? (
          <div className='flex flex-col gap-20 items-center justify-start w-full pt-6 px-4 h-full'>
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
            <Spacer height='2rem'/>
          </div>
        ) : (
          <ProfileEmptyState main={true} />
        )}
      </ContentWrapMain>
    </>
  )
}

export default ProfileMain