/**
 * Sanitizes and validates email format.
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    return { valid: false, message: "Email is required." };
  }

  const sanitized = email.trim().toLowerCase();

  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!regex.test(sanitized)) {
    return { valid: false, message: "Please enter a valid email address." };
  }

  return { valid: true, sanitized };
};