'use client'

import React, { useMemo, useState } from 'react';
import Image from 'next/image'
import { usePathname } from 'next/navigation'


import ItemImageDefault from '../profile/ItemImageDefault';
import ItemForm from '../profile/ItemForm';

import Button from '@/components/common/Button';
import Edit from '@/components/icons/Edit';
import Delete from '@/components/icons/Delete';
import Call from '@/components/icons/Call';
import Link from '@/components/icons/Link';

import { useItemView } from '@/context/useItemView';
import { supabase } from '@/supabaseClient'

import { formatNaira } from '@/utils/currency';

const ItemCard = ({id, itemImage, itemTitle, itemAmount, itemReason, itemLink, itemContact, openItemId, setOpenItemId, kins = [], kin_id}) => {
    const pathname = usePathname()
    const isProfile = pathname.includes('/profile')
    const isDashboard = pathname.includes('/dashboard') 
    const [isEditing, setIsEditing] = useState(false);
    const [deleteItemModal, setDeleteItemModal] = useState(false);

    const { view } = useItemView()
    const isOpen  = openItemId === id
    const toggleOpen = () => setOpenItemId(prev => prev === id ? null : id)

    const detailed = view === 'detailed'
    const compact = view === 'compact'
    const visual = view === 'visual'

    const handleSuccess = (updatedItem) => {
      setIsEditing(false);
      // Optional: Toast here
      setOpenItemId(null);

      // Replace old item in UI (if you're lifting state up later)
      if (typeof window !== 'undefined' && updatedItem) {
        const event = new CustomEvent('item-updated', { detail: updatedItem });
        window.dispatchEvent(event);
      }
    };

    const kinName = useMemo(() => {
      const owner = kins.find(k => k.id === kin_id)
      return owner?.callsign || 'kin'
    }, [kins, kin_id])


    if (isEditing) {
  return (
    <div className="w-[90vw] md:w-[80vw] lg:w-[35rem] xl:w-[40rem] mb-12">
      <ItemForm
        initialData={{
        id,
        item_name: itemTitle,
        item_link: itemLink,
        item_contact: itemContact,
        item_amount: itemAmount,
        item_info: itemReason,
        item_image: itemImage,
      }}
        onCancel={() => setIsEditing(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

const handleDelete = async () => {
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete item:', error);
    return;
  }

  if (typeof window !== 'undefined') {
    const deleteEvent = new CustomEvent('item-deleted', { detail: { id } });
    window.dispatchEvent(deleteEvent);
  }
};


        
  return (
    <>
    {deleteItemModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-modal-backdrop backdrop-blur-sm">
      <div className="bg-bg-form-modal rounded-lg shadow-lg p-6 max-w-sm text-center text-text-primary">
        <h2 className="mb-4">
          Are you sure you want to delete this item?
        </h2>
        <div className="flex gap-4 justify-center mt-6">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {setDeleteItemModal(false)}}
          >
            Cancel
          </Button>
          <Button
            variant="warning"
            className="w-full"
            onClick={handleDelete}
          >
            Yes, delete
          </Button>
        </div>
      </div>
    </div>)} 
    
    {/* Detailed card */}
          { detailed && (
            <div className='flex flex-col gap-1  '>
              {isDashboard && <div className='w-fit bg-blue-950 py-1 px-2 rounded-tl-lg text-white text-[10px]'>For {kinName}</div>}
              <div className='relative grid grid-cols-[100px_1fr] md:grid-cols-[128px_1fr] gap-0 justify-center items-start w-[90vw] md:w-[80vw] lg:w-[35rem] xl:w-[40rem] h-fit bg-gradient-to-b from-slate-300 to-slate-400  rounded-tl-none rounded-br-none rounded-lg  text-slate-800 mb-20'>
                  <div className="relative w-full h-full rounded-bl-lg overflow-hidden">
                  {itemImage ? (
                    <Image 
                    src={itemImage} 
                    alt={itemTitle} 
                    priority 
                    fill 
                    sizes="150px" 
                    className="object-cover" 
                    />
                  ) : (
                    <ItemImageDefault />
                  )}
                </div>
                  <div className='flex flex-col gap-2 justify-center items-center h-[8.5rem] xs:h-[7rem] sm:h-[9rem] px-2 py-2'>
                      <div className='grid grid-cols-[1fr_auto] xs:grid-cols-[1fr_auto] gap-1 justify-between items-center w-full'>
                          <h2 className='font-playfair text-base xs:text-xl md:text-2xl break-keep -mt-1 lg:mt-0 leading-tight xs:leading-tight truncate'>{itemTitle}</h2>
                          <div className='bg-slate-800 p-2 text-xs md:text-sm leading-none text-slate-50 rounded-lg text-center'>{formatNaira(itemAmount)}</div>
                      </div>
                      <p className='text-xs sm:text-sm w-full h-[5rem] xs:h-[3.5rem] break-all xs:break-keep'>{itemReason}</p>
                  </div>
                  {/* When in '/profile' page */}
                  {isProfile && (
                  <div className='absolute -bottom-10 right-0 w-3/4 xs:w-1/2 h-10 grid grid-cols-[1fr_1fr] p-1 gap-2'>
                    <Button iconLeft={Edit} onClick={() => setIsEditing(true)}>Edit</Button>
                    <Button onClick={() => {setDeleteItemModal(true)}} className={'gap-1'} iconLeft={Delete} variant='warning'>Delete</Button>
                  </div>
                  )}
                  {/* When in '/dashboard' page */}
                  {isDashboard && (
                  <div className='absolute -bottom-10 right-0 w-fit h-10 grid grid-cols-[1fr_1fr] py-2 pl-2 gap-2'>
                    {itemLink ? (
                      <Button 
                      iconLeft={Link}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(itemLink, '_blank');
                      }}
                      >
                        Link
                      </Button>) : (
                      <div className='grid place-items-center w-full h-full py-2 px-4 bg-btn-primary rounded-[6px] text-btn-primary-text opacity-30'>No link</div>)}
                      
                    {itemContact ? (
                      <Button 
                      className={'gap-2'} 
                      iconLeft={Call} 
                      variant='warning'
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${itemContact}`);
                      }}
                      >
                        Contact
                      </Button>) : (<div className='grid place-items-center w-full h-full py-2 px-4 bg-btn-primary rounded-[6px] text-btn-primary-text opacity-30'>No contact</div>)}
                  </div>
                  )}
              </div>
          </div>)}
            

      {(compact || visual) && 
            <div
              role="button"
              tabIndex={0}
              onClick={toggleOpen}
              onKeyDown={(e) => e.key === 'Enter' && toggleOpen()}
              className="cursor-pointer focus:outline-none"
            >
              {!isOpen ? (
                // === Collapsed Compact/Visual View ===
                compact ? (
                  <div className="grid grid-cols-[100px_1fr] xs:grid-cols-[128px_1fr] gap-2 w-[90vw] md:w-[60vw] lg:w-[25rem] xl:w-[30vw] bg-gradient-to-b from-slate-300 to-slate-400 rounded-lg text-slate-800 overflow-hidden">
                    <div className="relative w-full h-full">
                      {itemImage ? (
                        <Image src={itemImage} alt={itemTitle} priority fill sizes="150px" className="object-cover" />
                      ) : <ItemImageDefault />}
                    </div>
                    <div className="flex flex-col gap-2 mr-2 py-2 xs:py-4">
                      <div className='flex justify-between'>
                      <h2 className="font-playfair text-lg  leading-tight w-[12ch] xs:w-[16ch] sm:w-full truncate">{itemTitle}</h2>
                      {isDashboard && <div className='grid place-items-center w-fit h-6 bg-bg-modal-backdrop py-1 px-2 rounded-lg text-white text-[10px]'>{kinName}</div>}
                      </div>
                      <div className="w-fit bg-slate-800 py-2 px-4 text-xs md:text-sm text-slate-50 rounded-lg">
                        {formatNaira(itemAmount)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-[9.375rem] w-[9.375rem] overflow-hidden rounded-lg">
                    {itemImage ? (
                      <Image src={itemImage} alt={itemTitle} priority fill sizes="150px" className="object-cover" />
                    ) : <ItemImageDefault />}
                    <div className="absolute top-0 right-0 bg-slate-900/85 p-4 text-xs text-slate-50">
                      {formatNaira(itemAmount)}
                    </div>
                  </div>
                )
              ) : (
                // === Expanded Detailed View (Inline) ===
                
            <div className='flex flex-col gap-1'>
              {isDashboard && <div className='w-fit bg-blue-950 py-1 px-2 rounded-tl-lg text-white text-[10px]'>For {kinName}</div>}
              <div className="relative grid grid-cols-[100px_1fr] md:grid-cols-[128px_1fr] gap-0 justify-center items-start w-[90vw] md:w-[80vw] lg:w-[35rem] xl:w-[40rem] h-fit bg-gradient-to-b from-slate-300 to-slate-400  rounded-tl-none rounded-br-none rounded-lg  text-slate-800 mb-20">
                <div className="relative w-full h-full rounded-bl-lg overflow-hidden">
                  {itemImage ? (
                    <Image 
                    src={itemImage} 
                    alt={itemTitle} 
                    priority 
                    fill 
                    sizes="150px" 
                    className="object-cover" 
                    />
                  ) : (
                    <ItemImageDefault />
                  )}
                </div>
                <div className='flex flex-col gap-2 justify-center items-center h-[8.5rem] xs:h-[7rem] sm:h-[9rem] px-2 py-2'>
                      <div className='grid grid-cols-[1fr_auto] xs:grid-cols-[1fr_auto] gap-1 justify-between items-center w-full'>
                          <h2 className='font-playfair text-base xs:text-xl md:text-2xl break-keep -mt-1 lg:mt-0 leading-tight xs:leading-tight truncate'>{itemTitle}</h2>
                          <div className='bg-slate-800 p-2 text-xs md:text-sm leading-none text-slate-50 rounded-lg text-center'>{formatNaira(itemAmount)}</div>
                      </div>
                      <p className='text-xs sm:text-sm w-full h-[5rem] xs:h-[3.5rem] break-all xs:break-keep'>{itemReason}</p>
                  </div>

                {/* When in '/profile' page */}
                {isProfile && (
                  <div className="absolute -bottom-10 right-0 w-3/4 xs:w-1/2 h-10 grid grid-cols-2 p-1 gap-2">
                    <Button 
                    iconLeft={Edit} 
                    onClick={(e) => {
                    e.stopPropagation() 
                    setIsEditing(true)}
                    }>
                      Edit
                    </Button>
                    <Button 
                    iconLeft={Delete} variant="warning" 
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteItemModal(true)}
                      }>
                      Delete
                    </Button>
                  </div>
                )}

                {/* When in '/dashboard' page */}
                {isDashboard && (
                  <div className="absolute -bottom-10 right-0 w-fit h-10 grid grid-cols-2 py-2 pl-2 gap-2">
                    {itemLink ? (
                      <Button 
                      iconLeft={Link}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(itemLink, '_blank');
                      }}
                      >
                        Link
                      </Button>) : (
                      <div className='grid place-items-center w-full h-full py-2 px-4 bg-btn-primary rounded-[6px] text-btn-primary-text opacity-30'>No link</div>)}
                      
                    {itemContact ? (
                      <Button 
                      className={'gap-2'} 
                      iconLeft={Call} 
                      variant='warning'
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${itemContact}`);
                      }}
                      >
                        Contact
                      </Button>) : (<div className='grid place-items-center w-full h-full py-2 px-4 bg-btn-primary rounded-[6px] text-btn-primary-text opacity-30'>No contact</div>)}
                  </div>
                )}
              </div>
            </div>
              )}
            </div>
        }
    </>
  )
}

export default ItemCard