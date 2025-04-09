import { z } from 'zod';

/**
 * Validates an email address
 */
export const isValidEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

/**
 * Validates a phone number
 */
export const isValidPhone = (phone: string): boolean => {
  return z.string()
    .regex(/^[0-9+\-\s()]*$/)
    .min(10)
    .safeParse(phone).success;
};

/**
 * Validates a name
 */
export const isValidName = (name: string): boolean => {
  return z.string().min(2).safeParse(name).success;
};

/**
 * Validates a message
 */
export const isValidMessage = (message: string): boolean => {
  return z.string().min(10).safeParse(message).success;
};