'use client'

import React, { useState, useEffect, useMemo  } from 'react'

import ContentWrapMain from '@/components/features/main/common/ContentWrapMain'
import HomeEmptyState from '@/components/features/main/dashboard/HomeEmptyState'
import ItemCard from '@/components/features/main/common/ItemCard'
import Spacer from '@/components/common/Spacer'

import { useSelectedKin } from '@/context/SelectedKinContext'
import { useFilterBy } from '@/context/useFilterBy'
import { supabase } from '@/supabaseClient'


const DashboardMain = () => {
  const { kin: selectedKin, loading: kinLoading } = useSelectedKin()
  const { filterBy, filterOrder } = useFilterBy()

  const [openItemId, setOpenItemId] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
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
          setItems(data || [])
          setLoading(false)
        }
      }
    }

    fetchDashboardItems()
  }, [kinLoading, selectedKin?.id])

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

const isLoading = kinLoading || loading || !selectedKin?.id


  return (
  <ContentWrapMain>
    {isLoading ? (
      <div className="w-full h-full flex items-center justify-center text-text-secondary">
        Checking for items...
      </div>
    ) : (
      sortedItems.length > 0 ? (
        <div className="flex flex-col gap-4 items-center justify-start w-full pt-4 px-4 h-full overflow-y-auto hide-scrollbar">
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
          <Spacer height="2rem" />
        </div>
      ) : (
        <HomeEmptyState />
      )
    )}
  </ContentWrapMain>
)
}

export default DashboardMain