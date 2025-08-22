'use server';

import { z } from 'zod';
import { findUserByUsername, createUser, hashPassword } from '@/lib/auth-utils';

// Define the schema for the registration form using Zod for validation
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long').max(30, 'Username must be at most 30 characters long'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export async function registerUser(prevState: any, formData: FormData) {
  // 1. Validate the form data
  const parsed = registerSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors.map(e => e.message).join(', ') };
  }

  const { username, password } = parsed.data;

  try {
    // 2. Check if the username already exists
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return { success: false, message: 'Username already exists.' };
    }

    // 3. Hash the password
    const passwordHash = await hashPassword(password);

    // 4. Insert the new user into the database
    await createUser(username, passwordHash);

    return { success: true, message: 'Registration successful!' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}

