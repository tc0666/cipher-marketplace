'use server';

import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { verifyPassword, findUserByUsername } from '@/lib/auth-utils';
import { SessionData, sessionOptions } from '@/lib/session';
import { verify2FAToken } from '@/app/profile/2fa/actions';

// Define the schema for the login form using Zod for validation
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  token: z.string().optional(),
});

// Schema for 2FA verification
const twoFactorSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  token: z.string().length(6, '2FA token must be 6 digits'),
});

export async function loginUser(prevState: any, formData: FormData) {
  // 1. Validate the form data
  const token = formData.get('token') as string;
  const hasToken = token && token.length > 0;
  
  const parsed = (hasToken ? twoFactorSchema : loginSchema).safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
    token: token || undefined,
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors.map(e => e.message).join(', ') };
  }

  const { username, password } = parsed.data;

  try {
    // 2. Check if the user exists and verify password
    const user = await findUserByUsername(username);
    
    if (!user) {
      return { success: false, message: 'Invalid username or password.' };
    }

    const passwordMatch = await verifyPassword(password, user.password_hash);

    if (!passwordMatch) {
      return { success: false, message: 'Invalid username or password.' };
    }

    // 3. Check if 2FA is enabled
    if (user.two_factor_enabled) {
      if (!hasToken) {
        // User has 2FA enabled but no token provided - request 2FA
        return { 
          success: false, 
          message: 'Two-factor authentication required.',
          requires2FA: true,
          username: username
        };
      }

      // Verify 2FA token
      const tokenValid = await verify2FAToken(user.id, token!);
      if (!tokenValid) {
        return { 
          success: false, 
          message: 'Invalid verification code. Please try again.',
          requires2FA: true,
          username: username
        };
      }
    }

    // 4. Create session
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.isLoggedIn = true;
    session.userId = user.id;
    session.username = user.username;
    session.loginTime = Date.now();
    await session.save();

  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }

  // 5. Redirect to dashboard/home (outside try-catch to avoid catching redirect error)
  redirect('/dashboard');
}

export async function logoutUser() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.destroy();
  redirect('/');
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (session.isLoggedIn) {
      return session;
    }
    return null;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}
