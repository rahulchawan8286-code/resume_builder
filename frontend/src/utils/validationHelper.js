export const validationHelper = {
  isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isStrongPassword: (password) => password.length >= 8,
};