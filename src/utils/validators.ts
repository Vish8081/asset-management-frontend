export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

export const isValidAssetTag = (tag: string): boolean => {
  return tag.length >= 3 && tag.length <= 20;
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateRequired = (value: string): string | null => {
  if (!value || value.trim().length === 0) {
    return 'This field is required';
  }
  return null;
};

export const validateMinLength = (value: string, min: number): string | null => {
  if (value.length < min) {
    return `Must be at least ${min} characters`;
  }
  return null;
};

export const validateMaxLength = (value: string, max: number): string | null => {
  if (value.length > max) {
    return `Must be at most ${max} characters`;
  }
  return null;
};

export const validateNumber = (value: number): string | null => {
  if (isNaN(value) || value < 0) {
    return 'Must be a valid positive number';
  }
  return null;
};