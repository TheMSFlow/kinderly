'use client';

import React, { useEffect, useState } from 'react';
import ContentWrapMain from '@/components/features/main/common/ContentWrapMain';
import ProfileEmptyState from '@/components/features/main/profile/ProfileEmptyState';
import ItemCard from '@/components/features/main/profile/ItemCard';
import Spacer from '@/components/common/Spacer';
import { useSelectedKin } from '@/context/SelectedKinContext';
import { supabase } from '@/supabaseClient';

const ProfileMain = () => {
  const { kin: selectedKin, loading: kinLoading } = useSelectedKin();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openItemId, setOpenItemId] = useState(null);

  const fetchItems = async () => {
    if (!selectedKin?.id) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('kin_id', selectedKin.id)
      .eq('type', 'want')
      .order('created_at', { ascending: false });

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
  };

  useEffect(() => {
    if (!kinLoading && selectedKin?.id) {
      fetchItems();
    }
  }, [selectedKin, kinLoading]);


  useEffect(() => {
  const handleUpdate = () => {
    if (selectedKin?.id) {
      fetchItems();
    }
  };

  window.addEventListener('item-added', handleUpdate);
  window.addEventListener('item-updated', handleUpdate);
  window.addEventListener('item-deleted', handleUpdate);

  return () => {
    window.removeEventListener('item-added', handleUpdate);
    window.removeEventListener('item-updated', handleUpdate);
    window.removeEventListener('item-deleted', handleUpdate);
  };
}, [selectedKin?.id]); 




  return (
    <ContentWrapMain>
      {loading ? (
        <div className="text-center pt-12 text-text-secondary">Loading items...</div>
      ) : items.length > 0 ? (
        <div className="flex flex-col gap-20 items-center justify-start w-full pt-6 px-4 h-full">
          {items.map((item) => (
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
          <Spacer height="2rem" />
        </div>
      ) : (
        <ProfileEmptyState main={true} />
      )}
    </ContentWrapMain>
  );
};

export default ProfileMain;
