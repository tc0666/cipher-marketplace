'use server';

import { z } from 'zod';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import db from '@/lib/db';
import type { Pool } from 'pg';
import { getSession } from '@/app/(auth)/login/actions';
import { verifyPassword } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

// Schema for enabling 2FA
const enable2FASchema = z.object({
  password: z.string().min(1, 'Password is required'),
  token: z.string().length(6, 'Token must be 6 digits'),
});

// Schema for disabling 2FA
const disable2FASchema = z.object({
  password: z.string().min(1, 'Password is required'),
  token: z.string().length(6, 'Token must be 6 digits'),
});

// Schema for verifying 2FA token
const verify2FASchema = z.object({
  token: z.string().length(6, 'Token must be 6 digits'),
});

// Generate 2FA setup data
export async function generate2FASetup() {
  const session = await getSession();
  
  if (!session) {
    return { success: false, message: 'Not authenticated' };
  }

  if (!db) {
    return { success: false, message: 'Database not available' };
  }

  try {
    // Generate a secret for the user
    const secret = authenticator.generateSecret();
    
    // Get user data
    const userResult = await db.query(
      'SELECT username FROM users WHERE id = $1',
      [session.userId]
    );

    if (userResult.rows.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const user = userResult.rows[0] as any;
    const serviceName = 'Cipher Market';
    const accountName = user.username;
    
    // Generate the otpauth URL
    const otpauthUrl = authenticator.keyuri(accountName, serviceName, secret);
    
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
    
    return {
      success: true,
      secret,
      qrCodeDataUrl,
      manualEntryKey: secret,
      serviceName,
      accountName
    };
  } catch (error) {
    console.error('Error generating 2FA setup:', error);
    return { success: false, message: 'Failed to generate 2FA setup' };
  }
}

// Enable 2FA
export async function enable2FA(prevState: any, formData: FormData) {
  const session = await getSession();
  
  if (!session) {
    return { success: false, message: 'Not authenticated' };
  }

  // Validate form data
  const parsed = enable2FASchema.safeParse({
    password: formData.get('password'),
    token: formData.get('token'),
  });

  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.errors.map(e => e.message).join(', ') 
    };
  }

  const { password, token } = parsed.data;
  const secret = formData.get('secret') as string;

  if (!secret) {
    return { success: false, message: 'Invalid setup data' };
  }

  if (!db) {
    return { success: false, message: 'Database not available' };
  }

  try {
    // Get current user data
    const userResult = await db.query(
      'SELECT password_hash, two_factor_enabled FROM users WHERE id = $1',
      [session.userId]
    );

    if (userResult.rows.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const user = userResult.rows[0] as any;

    // Check if 2FA is already enabled
    if (user.two_factor_enabled) {
      return { success: false, message: '2FA is already enabled' };
    }

    // Verify password
    const passwordMatch = await verifyPassword(password, user.password_hash);
    if (!passwordMatch) {
      return { success: false, message: 'Incorrect password' };
    }

    // Verify the token with the secret
    const isValidToken = authenticator.verify({ token, secret });
    if (!isValidToken) {
      return { success: false, message: 'Invalid verification code' };
    }

    // Save the secret and enable 2FA
    await db.query(
      'UPDATE users SET two_factor_secret = $1, two_factor_enabled = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [secret, session.userId]
    );

    revalidatePath('/profile');
    revalidatePath('/profile/2fa');
    
    return { success: true, message: '2FA has been enabled successfully' };
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    return { success: false, message: 'Failed to enable 2FA' };
  }
}

// Disable 2FA
export async function disable2FA(prevState: any, formData: FormData) {
  const session = await getSession();
  
  if (!session) {
    return { success: false, message: 'Not authenticated' };
  }

  // Validate form data
  const parsed = disable2FASchema.safeParse({
    password: formData.get('password'),
    token: formData.get('token'),
  });

  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.errors.map(e => e.message).join(', ') 
    };
  }

  const { password, token } = parsed.data;

  if (!db) {
    return { success: false, message: 'Database not available' };
  }

  try {
    // Get current user data
    const userResult = await db.query(
      'SELECT password_hash, two_factor_secret, two_factor_enabled FROM users WHERE id = $1',
      [session.userId]
    );

    if (userResult.rows.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const user = userResult.rows[0] as any;

    // Check if 2FA is enabled
    if (!user.two_factor_enabled) {
      return { success: false, message: '2FA is not enabled' };
    }

    // Verify password
    const passwordMatch = await verifyPassword(password, user.password_hash);
    if (!passwordMatch) {
      return { success: false, message: 'Incorrect password' };
    }

    // Verify the token
    const isValidToken = authenticator.verify({ 
      token, 
      secret: user.two_factor_secret 
    });
    if (!isValidToken) {
      return { success: false, message: 'Invalid verification code' };
    }

    // Disable 2FA and remove secret
    await db.query(
      'UPDATE users SET two_factor_secret = NULL, two_factor_enabled = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [session.userId]
    );

    revalidatePath('/profile');
    revalidatePath('/profile/2fa');
    
    return { success: true, message: '2FA has been disabled successfully' };
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    return { success: false, message: 'Failed to disable 2FA' };
  }
}

// Verify 2FA token (for login purposes)
export async function verify2FAToken(userId: number, token: string): Promise<boolean> {
  if (!db) {
    return false;
  }
  
  try {
    const userResult = await db.query(
      'SELECT two_factor_secret, two_factor_enabled FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0 || !(userResult.rows[0] as any).two_factor_enabled) {
      return false;
    }

    const user = userResult.rows[0] as any;
    return authenticator.verify({ token, secret: user.two_factor_secret });
  } catch (error) {
    console.error('Error verifying 2FA token:', error);
    return false;
  }
}

// Generate backup codes
export async function generateBackupCodes() {
  const session = await getSession();
  
  if (!session) {
    return { success: false, message: 'Not authenticated' };
  }

  if (!db) {
    return { success: false, message: 'Database not available' };
  }

  try {
    // Check if 2FA is enabled
    const userResult = await db.query(
      'SELECT two_factor_enabled FROM users WHERE id = $1',
      [session.userId]
    );

    if (userResult.rows.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const user = userResult.rows[0] as any;
    if (!user.two_factor_enabled) {
      return { success: false, message: '2FA must be enabled to generate backup codes' };
    }

    // Generate 10 backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      backupCodes.push(code);
    }

    // In a real implementation, you would store these codes in the database
    // For now, we'll just return them
    return {
      success: true,
      backupCodes,
      message: 'Backup codes generated successfully'
    };
  } catch (error) {
    console.error('Error generating backup codes:', error);
    return { success: false, message: 'Failed to generate backup codes' };
  }
}