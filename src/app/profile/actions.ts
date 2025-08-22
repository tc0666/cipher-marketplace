'use server';

import { z } from 'zod';
import db from '@/lib/db';
import { getSession } from '@/app/(auth)/login/actions';
import { hashPassword, verifyPassword } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

// Define the user profile interface
export interface UserProfile {
  id: number;
  username: string;
  email: string | null;
  pgp_public_key: string | null;
  two_factor_enabled: boolean;
  is_verified_seller: boolean;
  subscription_tier: string;
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

// Get user profile by ID
export async function getUserProfile(userId: number): Promise<UserProfile | null> {
  if (!db) {
    console.error('Database not available');
    return null;
  }
  
  try {
    const result = await db.query(
      'SELECT id, username, email, pgp_public_key, two_factor_enabled, is_verified_seller, subscription_tier, subscription_expires_at, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );
    
    return (result.rows[0] as UserProfile) || null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Schema for profile update
const profileUpdateSchema = z.object({
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  pgp_public_key: z.string().optional().or(z.literal('')),
});

// Update user profile
export async function updateProfile(prevState: any, formData: FormData) {
  const session = await getSession();
  
  if (!session) {
    return { success: false, message: 'Not authenticated' };
  }

  if (!db) {
    return { success: false, message: 'Database not available' };
  }

  // Validate form data
  const parsed = profileUpdateSchema.safeParse({
    email: formData.get('email'),
    pgp_public_key: formData.get('pgp_public_key'),
  });

  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.errors.map(e => e.message).join(', ') 
    };
  }

  const { email, pgp_public_key } = parsed.data;

  try {
    // Check if email is already taken by another user
    if (email && email.trim() !== '') {
      const existingUser = await db.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, session.userId]
      );
      
      if (existingUser.rows.length > 0) {
        return { success: false, message: 'Email is already in use by another account' };
      }
    }

    // Update user profile
    await db.query(
      `UPDATE users 
       SET email = $1, pgp_public_key = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3`,
      [
        email && email.trim() !== '' ? email : null,
        pgp_public_key && pgp_public_key.trim() !== '' ? pgp_public_key : null,
        session.userId
      ]
    );

    revalidatePath('/profile');
    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, message: 'Failed to update profile' };
  }
}

// Schema for password change
const passwordChangeSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters long'),
  confirm_password: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

// Change user password
export async function changePassword(prevState: any, formData: FormData) {
  const session = await getSession();
  
  if (!session) {
    return { success: false, message: 'Not authenticated' };
  }

  if (!db) {
    return { success: false, message: 'Database not available' };
  }

  // Validate form data
  const parsed = passwordChangeSchema.safeParse({
    current_password: formData.get('current_password'),
    new_password: formData.get('new_password'),
    confirm_password: formData.get('confirm_password'),
  });

  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.errors.map(e => e.message).join(', ') 
    };
  }

  const { current_password, new_password } = parsed.data;

  try {
    // Get current user data
    const userResult = await db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [session.userId]
    );

    if (userResult.rows.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const user = userResult.rows[0] as any;

    // Verify current password
    const passwordMatch = await verifyPassword(current_password, user.password_hash);
    if (!passwordMatch) {
      return { success: false, message: 'Current password is incorrect' };
    }

    // Hash new password
    const newPasswordHash = await hashPassword(new_password);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, session.userId]
    );

    return { success: true, message: 'Password changed successfully' };
  } catch (error) {
    console.error('Error changing password:', error);
    return { success: false, message: 'Failed to change password' };
  }
}

// Get user statistics
export async function getUserStats(userId: number) {
  if (!db) {
    return {
      activeListings: 0,
      completedOrders: 0,
      totalEarned: '0.00'
    };
  }
  
  try {
    const [listingsResult, ordersResult] = await Promise.all([
      db.query(
        'SELECT COUNT(*) as count FROM listings WHERE seller_id = $1 AND status = $2',
        [userId, 'active']
      ),
      db.query(
        'SELECT COUNT(*) as count FROM orders WHERE seller_id = $1 AND status = $2',
        [userId, 'completed']
      )
    ]);

    return {
      activeListings: parseInt((listingsResult.rows[0] as any)?.count || '0'),
      completedOrders: parseInt((ordersResult.rows[0] as any)?.count || '0'),
      totalEarned: '0.00' // TODO: Calculate from completed orders
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      activeListings: 0,
      completedOrders: 0,
      totalEarned: '0.00'
    };
  }
}