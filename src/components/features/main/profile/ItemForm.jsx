'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import SuccessToast from '@/components/common/SuccessToast';

import { supabase } from '@/supabaseClient'
import { useSelectedKin } from '@/context/SelectedKinContext';

const ItemForm = ({ initialData = null, onCancel, onSuccess}) => {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null)
  const [pendingFileUpload, setPendingFileUpload] = useState(null);
  const [submitting, setSubmitting] = useState(false);


  const { kin: selectedKin, loading } = useSelectedKin();

  useEffect(() => {
  console.log('🔍 Selected Kin:', selectedKin);
  console.log('🔢 kin.id:', selectedKin?.id);
  console.log('🧬 kin.kindred_id:', selectedKin?.kindred_id);
}, [selectedKin]);



  const [formData, setFormData] = useState({
    id: null,
    item_name: '',
    item_link: '',
    item_contact: '',
    item_amount: '',
    item_info: '',
    item_image: null,
  });


  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        id: initialData.id ?? null,
        item_name: initialData.item_name ?? '',
        item_link: initialData.item_link ?? '',
        item_contact: initialData.item_contact ?? '',
        item_amount: initialData.item_amount?.toString() ?? '',
        item_info: initialData.item_info ?? '',
        item_image: initialData.item_image ?? null,
      });
      setPreviewImage(initialData.item_image ?? null)
    }
  }, [initialData, isEditMode]);

    const MAX_AMOUNT = 9999999999.99;
    const validate = () => {
    const newErrors = {};

    const rawAmount = formData.item_amount.replace(/,/g, '');
    const numericAmount = parseFloat(rawAmount);

    if (!formData.item_name.trim()) newErrors.item_name = 'Name is required';
    if (!rawAmount || isNaN(numericAmount)) newErrors.item_amount = 'Amount is required';
    else if (numericAmount > MAX_AMOUNT) newErrors.item_amount = 'Amount exceeds ₦9,999,999,999.99';
    if (!formData.item_info.trim()) newErrors.item_info = 'Reason is required';
    if (!previewImage && !pendingFileUpload) newErrors.item_image = 'Photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image.');
      return;
    }

    const previewURL = URL.createObjectURL(file);
    setPreviewImage(previewURL);
    setPendingFileUpload(file);
  };
    

      useEffect(() => {
      return () => {
        if (previewImage?.startsWith('blob:')) {
          URL.revokeObjectURL(previewImage);
        }
      };
    }, [previewImage]);

    const uploadImageToSupabase = async (existingUrl = null) => {
      const file = pendingFileUpload;
      if (!file) return null;

      const kindredId = selectedKin?.kindred_id;
      const kinId = selectedKin?.id;

      if (!kindredId || !kinId) {
        alert('Missing kindred or kin info');
        return null;
      }

      // ✅ Pre-flight validation: Ensure metadata will include kin_id
      const metadata = { kin_id: kinId };
      if (!metadata.kin_id) {
        alert('Missing kin_id in metadata');
        return null;
      }

      let filePath;

      if (existingUrl) {
        const segments = existingUrl.split('/');
        const idx = segments.findIndex(s => s === 'item-images');
        filePath = segments.slice(idx + 1).join('/');
      } else {
        const mimeMap = {
          'image/jpeg': 'jpg',
          'image/png': 'png',
          'image/webp': 'webp',
        };
        const fileExt = mimeMap[file.type] || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        filePath = `${kindredId}/${kinId}/${fileName}`;
      }

      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: '3600',
          metadata, // ✅ Explicit and verified
        });

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        alert('Image upload failed');
        return null;
      }

      const { data, error: urlError } = supabase
        .storage
        .from('item-images')
        .getPublicUrl(filePath);

      if (urlError || !data?.publicUrl) {
        console.error('Public URL error:', urlError);
        alert('Failed to get image URL');
        return null;
      }

      return data.publicUrl;
    };





    const handleSubmit = async (e) => {
      e.preventDefault();
      if (submitting) return;
      if (!validate()) return;
      if (!selectedKin?.id || !selectedKin?.kindred_id) return alert('Kin info missing');

      setSubmitting(true);

      let imageUrl = formData.item_image;

      if (pendingFileUpload) {
        imageUrl = await uploadImageToSupabase(isEditMode ? initialData?.item_image : null);
        if (!imageUrl) {
          setSubmitting(false);
          return;
        }
      }



      // 🌐 Fix link
      const correctedLink = formData.item_link.trim();
      const linkWithProtocol =
        correctedLink && !/^https?:\/\//i.test(correctedLink)
          ? 'https://' + correctedLink
          : correctedLink;

      if (isEditMode) {
        const clean = (val) => (val || '').toString().replace(/,/g, '').trim();

        // Only include changed fields
        const payload = {};
        Object.entries(formData).forEach(([key, value]) => {
          const original = clean(initialData?.[key]);
          const current = clean(value);
          if (original !== current) {
            payload[key] = value;
          }
        });

        // Always required
        payload.kin_id = selectedKin.id;
        payload.kindred_id = selectedKin.kindred_id;
        payload.type = 'want';

        // Link
        if (payload.item_link) {
          payload.item_link = linkWithProtocol;
        }

        // Format amount if present
        if (payload.item_amount) {
          payload.item_amount = payload.item_amount.replace(/,/g, '');
        }

        // Update image only if changed
        if (imageUrl && imageUrl !== initialData?.item_image) {
          payload.item_image = imageUrl;
        }

        // Skip if no changes
        if (Object.keys(payload).length <= 3) {
          alert('No changes to update.');
          if (onCancel) onCancel();
          setSubmitting(false);
          return;
        }

        try {
          const { error } = await supabase
            .from('items')
            .update(payload)
            .eq('id', formData.id);

          if (error) throw error;

          setToastMessage('Item updated successfully');

          // 🚀 Notify of update
          if (typeof window !== 'undefined') {
            const updatedItem = { ...formData, item_image: imageUrl };
            const updateEvent = new CustomEvent('item-updated', { detail: updatedItem });
            window.dispatchEvent(updateEvent);
          }

          setTimeout(() => {
            setToastMessage('');
            if (onSuccess) onSuccess();
          }, 800);
        } catch (err) {
          console.error('Supabase Update Error:', err);
          alert('Something went wrong. Please try again.');
        } finally {
          setSubmitting(false);
        }

        return;
      }

      // ✅ Add new item flow
      const payload = {
        kin_id: selectedKin.id,
        kindred_id: selectedKin.kindred_id,
        type: 'want',
        item_name: formData.item_name.trim(),
        item_link: linkWithProtocol || null,
        item_amount: formData.item_amount.replace(/,/g, ''),
        item_info: formData.item_info.trim(),
        item_image: imageUrl,
        item_contact: formData.item_contact || null,
      };

      try {
        const { error, data } = await supabase.from('items').insert(payload);
        if (error) throw error;

        setToastMessage('Item added successfully');

        if (typeof window !== 'undefined') {
          const addedItem = { ...formData, item_image: imageUrl };
          const addEvent = new CustomEvent('item-added', { detail: addedItem });
          window.dispatchEvent(addEvent);
        }

        setTimeout(() => {
          setToastMessage('');
          if (onSuccess) onSuccess();
          router.push('/profile');
        }, 800);
      } catch (err) {
        console.error('Supabase Insert Error:', err);
        alert('Something went wrong. Please try again.');
      } finally {
        setSubmitting(false); 
      }
    };



  if (isEditMode) {
    return (
      <form onSubmit={handleSubmit} noValidate className="space-y-4 bg-bg-form-modal p-4 rounded-md w-full max-w-xl">
        <SuccessToast message={toastMessage} onClose={() => setToastMessage('')} />
          <div className='grid grid-cols-[80px_1fr] gap-4'>
            <div className="relative w-full h-full rounded-md overflow-hidden  cursor-pointer">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-20 h-20 object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-slate-300 rounded-md grid place-content-center text-xs text-slate-600 p-4 text-center">
                  Choose image
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-text-secondary">
                Product name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="item_name"
                  value={formData.item_name}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 20) {
                      setFormData((prev) => ({ ...prev, item_name: value }));
                    }
                  }}
                  placeholder="e.g Chiropractor appointment"
                  className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem] text-text-secondary"
                  required
                />
                <div className="absolute bottom-1 right-1 text-right text-[0.5rem] text-text-secondary">
                  {formData.item_name.length} / 20
                </div>
                {errors.item_name && <p className="text-red-500 text-xs mt-1">{errors.item_name}</p>}
              </div>
            </div>
          </div>
          <div className="space-y-1">
              <label className="text-sm text-text-secondary">Add a purchase link if any</label>
              <input
                type="url"
                name="item_link"
                value={formData.item_link}
                onChange={handleChange}
                placeholder="www.chiropractor.com/order"
                className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
              />
            </div>
          <div className="flex flex-row gap-4">
            
            <div className="space-y-1">
              <label className="text-sm text-text-secondary">Contact</label>
              <input
                type="text"
                name="item_contact"
                value={formData.item_contact}
                onChange={handleChange}
                placeholder="0800 000 0000"
                className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-text-secondary">Amount (₦)</label>
              <input
                type="text"
                name="item_amount"
                value={formData.item_amount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  const limited = raw.slice(0, 10); // only allow 10 digits before decimal
                  const formatted = Number(limited).toLocaleString();
                  setFormData(prev => ({ ...prev, item_amount: formatted }));
                }}

                placeholder="150,000"
                className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
                required
              />
              {errors.item_amount && <p className="text-red-500 text-xs mt-1">{errors.item_amount}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-text-secondary">Why is this item special to you?</label>
            <div className='relative'>
              <textarea
                name="item_info"
                value={formData.item_info}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 125) {
                    setFormData((prev) => ({ ...prev, item_info: value }));
                  }
                }}
                placeholder="I want to get back in shape..."
                className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text text-text-secondary focus:outline-none focus:ring focus:ring-b-border resize-none"
                rows={4}
                required
              />
              <div className="absolute bottom-[10px] right-1 text-right text-[0.5rem] text-text-secondary">
                {formData.item_info.length} / 125
              </div>
              {errors.item_info && <p className="text-red-500 text-xs mt-1">{errors.item_info}</p>}
            </div>
          </div>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? 'Updating item...' : 'Update'}
          </Button>
          <Button type="button" variant="secondary" className="w-full" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-4 pt-6">
      {toastMessage && <SuccessToast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div className="space-y-1">
        <label className="text-sm text-text-secondary">
          Name of product, service or experience
        </label>
        <div className="relative">
          <input
            type="text"
            name="item_name"
            value={formData.item_name}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 20) {
                setFormData((prev) => ({ ...prev, item_name: value }));
              }
            }}
            placeholder="e.g Chiropractor appointment"
            className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem] text-text-secondary"
            required
          />
          <div className="absolute bottom-1 right-1 text-right text-[0.5rem] text-text-secondary">
            {formData.item_name.length} / 20
          </div>
          {errors.item_name && <p className="text-red-500 text-xs mt-1">{errors.item_name}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="flex items-center justify-center w-full bg-input-bg text-center text-text-secondary border border-b-border rounded-md py-8 cursor-pointer focus:outline-none focus:ring focus:ring-b-border">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <div className='flex flex-row items-center justify-center gap-2'>
            {previewImage && (
              <div className="w-12 h-12">
                <img
                  src={previewImage}
                  alt="Uploaded preview"
                  className="rounded-md object-cover w-full h-full border"
                />
              </div>
            )}
            <div className='flex flex-col'>
              <div className="text-base">Upload a photo of the item</div>
              <div className="text-xs">jpg, png, & webp (200 × 200 px)</div>
            </div>
          </div>
        </label>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-text-secondary">Add a purchase link if any</label>
        <input
          type="url"
          name="item_link"
          value={formData.item_link}
          onChange={handleChange}
          placeholder="www.chiropractor.com/order"
          className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-text-secondary">Add phone number if any</label>
        <input
          type="text"
          name="item_contact"
          value={formData.item_contact}
          onChange={handleChange}
          placeholder="0800 000 0000"
          className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-text-secondary">Amount (₦)</label>
        <input
          type="text"
          name="item_amount"
          value={formData.item_amount}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, '');
            const limited = raw.slice(0, 10); // only allow 10 digits before decimal
            const formatted = Number(limited).toLocaleString();
            setFormData(prev => ({ ...prev, item_amount: formatted }));
          }}
          placeholder="150,000"
          className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
          required
        />
        {errors.item_amount && <p className="text-red-500 text-xs mt-1">{errors.item_amount}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm text-text-secondary">Why is this item special to you?</label>
        <div className='relative'>
          <textarea
            name="item_info"
            value={formData.item_info}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 125) {
                setFormData((prev) => ({ ...prev, item_info: value }));
              }
            }}
            placeholder="I want to get back in shape..."
            className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text text-text-secondary focus:outline-none focus:ring focus:ring-b-border resize-none"
            rows={4}
            required
          />
          <div className="absolute bottom-[10px] right-1 text-right text-[0.5rem] text-text-secondary">
            {formData.item_info.length} / 125
          </div>
          {errors.item_info && <p className="text-red-500 text-xs mt-1">{errors.item_info}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" variant="primary" className="w-full mt-4" disabled={submitting}>
          {submitting ? 'Adding item...' : 'Add item'}
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;
