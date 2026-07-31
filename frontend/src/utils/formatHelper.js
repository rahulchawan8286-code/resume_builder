export const formatHelper = {
  currency: (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount),
};