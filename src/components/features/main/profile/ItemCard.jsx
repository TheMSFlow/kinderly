'use client'

import React, { useState } from 'react';
import Image from 'next/image'
import { usePathname } from 'next/navigation'


import ItemImageDefault from './ItemImageDefault';
import ItemForm from './ItemForm';

import Button from '@/components/common/Button';
import Edit from '@/components/icons/Edit';
import Delete from '@/components/icons/Delete';
import Call from '@/components/icons/Call';
import Product from '@/components/icons/Product';

import { useItemView } from '@/context/useItemView';
import { supabase } from '@/supabaseClient'

const ItemCard = ({id, itemImage, itemTitle, itemAmount, itemReason, itemLink, itemContact, openItemId, setOpenItemId}) => {
    const pathname = usePathname()
    const isProfile = pathname.includes('/profile')
    const isDashboard = pathname.includes('/dashboard') 
    const [isEditing, setIsEditing] = useState(false);
    const [deleteItemModal, setDeletItemModal] = useState(false);

    const { view } = useItemView()
    const isOpen  = openItemId === id
    const toggleOpen = () => setOpenItemId(prev => prev === id ? null : id)

    const detailed = view === 'detailed'
    const compact = view === 'compact'
    const visual = view === 'visual'

    const handleSuccess = () => {
      setIsEditing(false);
      window.location.reload();
    }

    if (isEditing) {
  return (
    <div className="w-full max-w-[35rem]">
      <ItemForm
        initialData={{
          id,
          name: itemTitle,
          link: itemLink,
          phone: itemContact,
          amount: itemAmount,
          reason: itemReason,
          photo: itemImage
        }}
        onCancel={() => setIsEditing(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

const handleDelete = async () => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete item:', error)
    return
  }

  window.location.reload()
}

        
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
            onClick={() => {setDeletItemModal(false)}}
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
        { detailed &&
        <div className='relative grid grid-cols-[100px_1fr] lg:grid-cols-[128px_1fr] gap-0 justify-center items-start w-full lg:w-[35rem] h-[10rem] lg:h-[9rem] bg-gradient-to-b from-slate-300 to-slate-400  rounded-tl-lg rounded-tr-lg rounded-bl-lg  text-slate-800 '>
            {itemImage ? (
              <div className="relative w-full h-full rounded-tl-lg rounded-bl-lg overflow-hidden">
                <Image 
                  src={itemImage}
                  alt={itemTitle}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <ItemImageDefault />
            )}
            <div className='flex flex-col gap-2 justify-center items-center h-full px-2 py-2'>
                <div className='grid grid-cols-[1fr_auto] xs:grid-cols-[1fr_auto] gap-1 justify-between items-center w-full'>
                    <h2 className='font-playfair text-base xs:text-xl md:text-2xl break-keep -mt-1 lg:mt-0 leading-tight xs:leading-tight'>{itemTitle}</h2>
                    <div className='bg-slate-800 p-2 text-xs xs:text-sm md:text-base leading-none text-slate-50 rounded-lg text-center'>{`₦ ${itemAmount}`}</div>
                </div>
                <p className='text-xs xs:text-base w-full break-all xs:break-keep '>{itemReason}</p>
            </div>
            {/* When in '/profile' page */}
            {isProfile && (
            <div className='absolute -bottom-10 right-0 w-3/4 xs:w-1/2 h-10 grid grid-cols-[1fr_1fr] p-1 gap-2'>
              <Button iconLeft={Edit} onClick={() => setIsEditing(true)}>Edit</Button>
              <Button onClick={() => {setDeletItemModal(true)}} className={'gap-1'} iconLeft={Delete} variant='warning'>Delete</Button>
            </div>
            )}
            {/* When in '/dashboard' page */}
            {isDashboard && (
            <div className='absolute -bottom-10 right-0 w-3/4 h-10 grid grid-cols-[1fr_1fr] py-2 pl-2 gap-2'>
              {itemLink ? <Button iconLeft={Product}>Product link</Button> : <div className='grid place-items-center w-full h-full py-2 px-4 bg-btn-primary rounded-[6px] text-btn-primary-text opacity-30'>No link</div>}
              {itemContact ? <Button className={'gap-1'} iconLeft={Call} variant='warning'>No Contact</Button> : <div className='grid place-items-center w-full h-full py-2 px-4 bg-btn-primary rounded-[6px] text-btn-primary-text opacity-30'>No contact</div>}
            </div>
            )}
        </div>}

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
                  <div className="grid grid-cols-[100px_1fr] xs:grid-cols-[128px_1fr] gap-2 w-full md:w-1/2 lg:w-[18rem] bg-gradient-to-b from-slate-300 to-slate-400 rounded-lg text-slate-800 overflow-hidden">
                    <div className="relative w-full h-full">
                      {itemImage ? (
                        <Image src={itemImage} alt={itemTitle} fill className="object-cover" />
                      ) : <ItemImageDefault />}
                    </div>
                    <div className="flex flex-col gap-2 mr-2 py-2 xs:py-4">
                      <h2 className="font-playfair text-lg break-keep leading-tight">{itemTitle}</h2>
                      <div className="w-fit bg-slate-800 py-2 px-4 text-xs xs:text-sm text-slate-50 rounded-lg">
                        ₦ {itemAmount}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-[9.375rem] w-[9.375rem] overflow-hidden rounded-lg">
                    {itemImage ? (
                      <Image src={itemImage} alt={itemTitle} fill className="object-cover" />
                    ) : <ItemImageDefault />}
                    <div className="absolute top-0 right-0 bg-slate-900/85 p-4 text-xl text-slate-50">
                      ₦ {itemAmount}
                    </div>
                  </div>
                )
              ) : (
                // === Expanded Detailed View (Inline) ===
                <div className="relative grid grid-cols-[100px_1fr] lg:grid-cols-[128px_1fr] gap-0 w-full lg:w-[35rem] h-[10rem] bg-gradient-to-b from-slate-300 to-slate-400 rounded-lg text-slate-800">
                  <div className="relative w-full h-full rounded-l-lg overflow-hidden">
                    {itemImage ? (
                      <Image src={itemImage} alt={itemTitle} fill className="object-cover" />
                    ) : <ItemImageDefault />}
                  </div>
                  <div className="flex flex-col gap-2 justify-center h-full px-2 py-2">
                    <div className="grid grid-cols-[1fr_auto] gap-1 items-center w-full">
                      <h2 className="font-playfair text-base xs:text-xl md:text-2xl">{itemTitle}</h2>
                      <div className="bg-slate-800 p-2 text-xs xs:text-sm md:text-base text-slate-50 rounded-lg">
                        ₦ {itemAmount}
                      </div>
                    </div>
                    <p className="text-xs xs:text-base w-full break-words">{itemReason}</p>
                  </div>

                  {/* Actions */}
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
                        setDeletItemModal(true)}
                        }>
                        Delete
                      </Button>
                    </div>
                  )}

                  {isDashboard && (
                    <div className="absolute -bottom-10 right-0 w-3/4 h-10 grid grid-cols-2 py-2 pl-2 gap-2">
                      {itemLink ? <Button iconLeft={Product}>Product</Button> : <div className="opacity-30">No link</div>}
                      {itemContact ? <Button iconLeft={Call} variant="warning">Call</Button> : <div className="opacity-30">No contact</div>}
                    </div>
                  )}
                </div>
              )}
            </div>
        }
    </>
  )
}

export default ItemCard