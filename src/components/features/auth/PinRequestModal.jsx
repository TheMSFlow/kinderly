'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';

const PinRequestModal = ({ memberName, onSubmit, onClose, error }) => {
  const [pin, setPin] = useState(['', '', '', '']);

  const handleChange = (value, idx) => {
    if (!/^\d?$/.test(value)) return;
    const copy = [...pin];
    copy[idx] = value;
    setPin(copy);
    if (value && idx < 3) {
      document.getElementById(`pin-${idx + 1}`)?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.some((d) => d === '')) return;
    const pinCode = pin.join('');
    onSubmit(pinCode);
  };

  useEffect(() => {
    // Autofocus the first input when modal opens
    setTimeout(() => document.getElementById('pin-0')?.focus(), 100);
  }, []);

  return (
    <div className="fixed inset-0 bg-bg-modal-backdrop flex justify-center items-center z-50">
      <div className="bg-bg-primary w-full max-w-md p-6 rounded-lg mx-4 lg:mx-0">
        <div className="text-sm text-text-primary mb-6">
          <h1 className="font-playfair text-4xl font-semibold mb-2 text-heading">
            Hello, {memberName}
          </h1>
          <p>Enter your PIN to continue</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='relative mb-6'>
            <div className="flex justify-between">
                {pin.map((d, idx) => (
                <input
                    key={idx}
                    id={`pin-${idx}`}
                    className="w-14 h-14 md:w-20 md:h-20 text-xl text-text-primary text-center border border-b-border rounded-md bg-input-bg placeholder-placeholder-text focus:outline-none focus:ring focus:ring-b-border"
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleChange(e.target.value, idx)}
                    onKeyDown={(e) => {
                    if (e.key === 'Backspace' && d === '' && idx > 0) {
                        document.getElementById(`pin-${idx - 1}`)?.focus();
                    }
                    }}
                />
                ))}
            </div>
            <div className='h-2 w-full bg-transparent'>{error && <p className="text-red-500 text-xs pt-1 ">{error}</p>}</div>
          </div>


          <div className="flex justify-between w-full gap-2">
            <Button className={'w-full'} type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button className={'w-full'} type="submit">Enter</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PinRequestModal;
