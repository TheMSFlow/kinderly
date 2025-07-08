'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import SuccessToast from '@/components/common/SuccessToast';

const ItemForm = ({ initialData = null, onCancel, onSuccess}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    link: '',
    phone: '',
    amount: '',
    reason: '',
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
  if (isEditMode && initialData) {
    setFormData({
      id: initialData.id ?? null,
      name: initialData.name ?? '',
      link: initialData.link ?? '',
      phone: initialData.phone ?? '',
      amount: initialData.amount ?? '',
      reason: initialData.reason ?? '',
      photo: initialData.photo ?? null,
    });
  }
}, [initialData, isEditMode]);


  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.amount.trim()) newErrors.amount = 'Amount is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
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
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setFormData((prev) => ({
          ...prev,
          photo: base64,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const correctedLink = formData.link.trim();
    const linkWithProtocol = correctedLink && !/^https?:\/\//i.test(correctedLink)
      ? 'https://' + correctedLink
      : correctedLink;

      const existing = JSON.parse(localStorage.getItem('wishlist') || '[]');

      let newItem = { ...formData, link: linkWithProtocol };

      // Ensure the item has a valid ID
      if (!isEditMode) {
        const nextId = existing.length ? Math.max(...existing.map(i => i.id || 0)) + 1 : 0;
        newItem.id = nextId;
      }

      const updatedList = isEditMode
        ? existing.map((item) => (item.id === newItem.id ? newItem : item))
        : [...existing, newItem];

      setToastMessage(isEditMode ? 'Item updated successfully' : 'Item added successfully');


    localStorage.setItem('wishlist', JSON.stringify(updatedList));
    setTimeout(() => {
      setToastMessage('');
      if (onSuccess) onSuccess();
      if (!isEditMode) {
      router.push('/profile');
    }
    }, 800);

  };

  if (isEditMode) {
    return (
      <form onSubmit={handleSubmit} noValidate className="space-y-4 bg-bg-form-modal p-4 rounded-md w-full max-w-xl">
        <SuccessToast message={toastMessage} onClose={() => setToastMessage('')} />
          <div className='grid grid-cols-[80px_1fr] gap-4'>
            <div className="relative w-full h-full rounded-md overflow-hidden  cursor-pointer">
              {formData.photo ? (
                <img
                  src={formData.photo}
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
                  name="name"
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 20) {
                      setFormData((prev) => ({ ...prev, name: value }));
                    }
                  }}
                  placeholder="e.g Chiropractor appointment"
                  className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem] text-text-secondary"
                  required
                />
                <div className="absolute bottom-1 right-1 text-right text-[0.5rem] text-text-secondary">
                  {formData.name.length} / 20
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
            </div>
          </div>
          <div className="space-y-1">
              <label className="text-sm text-text-secondary">Add a purchase link if any</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="www.chiropractor.com/order"
                className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
              />
            </div>
          <div className="flex flex-row gap-4">
            
            <div className="space-y-1">
              <label className="text-sm text-text-secondary">Contact</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0800 000 0000"
                className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-text-secondary">Amount (₦)</label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="₦150,000"
                className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
                required
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-text-secondary">Why is this item special to you?</label>
            <div className='relative'>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 125) {
                    setFormData((prev) => ({ ...prev, reason: value }));
                  }
                }}
                placeholder="I want to get back in shape..."
                className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text text-text-secondary focus:outline-none focus:ring focus:ring-b-border resize-none"
                rows={4}
                required
              />
              <div className="absolute bottom-[10px] right-1 text-right text-[0.5rem] text-text-secondary">
                {formData.reason.length} / 125
              </div>
              {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
            </div>
          </div>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" className="w-full">Update</Button>
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
            name="name"
            value={formData.name}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 20) {
                setFormData((prev) => ({ ...prev, name: value }));
              }
            }}
            placeholder="e.g Chiropractor appointment"
            className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem] text-text-secondary"
            required
          />
          <div className="absolute bottom-1 right-1 text-right text-[0.5rem] text-text-secondary">
            {formData.name.length} / 20
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
            {formData.photo && (
              <div className="w-12 h-12">
                <img
                  src={formData.photo}
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
          name="link"
          value={formData.link}
          onChange={handleChange}
          placeholder="www.chiropractor.com/order"
          className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-text-secondary">Add phone number if any</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="0800 000 0000"
          className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-text-secondary">Amount (₦)</label>
        <input
          type="text"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="₦150,000"
          className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border h-[2.5rem]"
          required
        />
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm text-text-secondary">Why is this item special to you?</label>
        <div className='relative'>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 125) {
                setFormData((prev) => ({ ...prev, reason: value }));
              }
            }}
            placeholder="I want to get back in shape..."
            className="w-full px-3 py-2 border border-b-border rounded-md text-sm bg-input-bg placeholder-placeholder-text text-text-secondary focus:outline-none focus:ring focus:ring-b-border resize-none"
            rows={4}
            required
          />
          <div className="absolute bottom-[10px] right-1 text-right text-[0.5rem] text-text-secondary">
            {formData.reason.length} / 125
          </div>
          {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" variant="primary" className="w-full mt-4">
          Add item
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;
