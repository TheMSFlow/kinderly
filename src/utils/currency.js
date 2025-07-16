export const formatNaira = (value) => {
  if (!value) return '₦0';

  // Convert to number if it's a string like "900000"
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};
