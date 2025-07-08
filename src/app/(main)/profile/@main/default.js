import ItemCard from '@/components/features/main/profile/ItemCard'
import React from 'react'

const ProfileMain = () => {
  return (
    <div>
      <ItemCard 
      itemTitle={'Chiropractor Session'}
      itemAmount={'N150,000'}
      itemReason={'I want to get back in shape. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod'}
      />
    </div>
  )
}

export default ProfileMain