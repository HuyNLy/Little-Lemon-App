export const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
// Validate name (only alphabetic characters, allow spaces, hyphens, apostrophes)
export const validateName = (name: string): boolean => {
  return name.trim().length > 0 && /^[a-zA-Z\s'-]+$/.test(name);
};

// Validate US phone number (10-digit numeric)
export const validatePhone = (phone: string): boolean => {
  return /^\d{10}$/.test(phone);
};