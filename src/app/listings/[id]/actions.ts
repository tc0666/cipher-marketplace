'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import sqliteDb from '@/lib/db-sqlite';
import { getSession } from '@/app/(auth)/login/actions';

// Use either db or sqliteDb as a fallback
const database = db || sqliteDb;

export async function getListingData(id: string) {
  try {
    const session = await getSession();
    const userId = session?.userId;

    // Get listing data
    const result = await database.query(
      `SELECT l.*, u.username as seller_username 
       FROM listings l
       JOIN users u ON l.seller_id = u.id
       WHERE l.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const listing = result.rows[0];
    
    // Get reviews for this listing
    let reviews = [];
    try {
      const reviewsResult = await database.query(
        `SELECT r.*, u.username 
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.listing_id = $1
         ORDER BY r.created_at DESC`,
        [id]
      );
      reviews = reviewsResult.rows;
    } catch (reviewError) {
      console.error('Error fetching reviews:', reviewError);
      // Continue with empty reviews rather than failing the whole request
    }

    // Check if user has purchased this item
    let userHasPurchased = false;
    if (userId) {
      try {
        const purchaseResult = await database.query(
          `SELECT * FROM orders 
           WHERE listing_id = $1 AND buyer_id = $2 AND status = 'completed'`,
          [id, userId]
        );
        userHasPurchased = purchaseResult.rows.length > 0;
      } catch (purchaseError) {
        console.error('Error checking purchase status:', purchaseError);
        // Continue with userHasPurchased = false rather than failing
      }
    }
    
    // Check if current user is the owner
    const isOwner = userId === listing.seller_id;

    return {
      ...listing,
      reviews,
      userHasPurchased,
      isOwner
    };
  } catch (error) {
    console.error('Error fetching listing:', error);
    throw new Error('Failed to fetch listing');
  }
}

export async function deleteListingAction(prevState: any, formData: FormData) { 
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, message: 'Unauthorized' };
  }

  const listingIdStr = formData.get('id')?.toString();
  if (!listingIdStr) {
    return { success: false, message: 'Missing listing ID' };
  }

  const listingId = parseInt(listingIdStr, 10);
  if (isNaN(listingId)) {
    return { success: false, message: 'Invalid listing ID' };
  }

  try {
    // First verify the user owns this listing
    const listing = await database.query(
      'SELECT * FROM listings WHERE id = $1 AND seller_id = $2',
      [listingId, session.userId]
    );
    
    if (listing.rows.length === 0) {
      return { success: false, message: 'You do not have permission to delete this listing' };
    }
    
    // Delete the listing
    await database.query('DELETE FROM listings WHERE id = $1', [listingId]);
    
    revalidatePath('/listings');
    revalidatePath('/dashboard');
    
    return { success: true, message: 'Listing deleted successfully', redirectUrl: '/dashboard' };
  } catch (error) {
    console.error('Error deleting listing:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to delete listing' };
  }
}

export async function submitReviewAction(prevState: any, formData: FormData) {
  const session = await getSession();
  
  if (!session?.userId) {
    return { success: false, message: 'You must be logged in to submit a review' };
  }
  
  const listingId = formData.get('listingId') as string;
  const rating = formData.get('rating') as string;
  const comment = formData.get('comment') as string;
  
  if (!listingId || !rating || !comment) {
    return { success: false, message: 'All fields are required' };
  }
  
  try {
    // Verify the user has purchased this listing
    const hasPurchased = await database.query(
      'SELECT * FROM orders WHERE listing_id = $1 AND buyer_id = $2 AND status = $3',
      [listingId, session.userId, 'completed']
    );
    
    if (hasPurchased.rows.length === 0) {
      return { success: false, message: 'You must purchase this item before reviewing it' };
    }
    
    // Check if user already reviewed this listing
    const existingReview = await database.query(
      'SELECT * FROM reviews WHERE listing_id = $1 AND user_id = $2',
      [listingId, session.userId]
    );
    
    if (existingReview.rows.length > 0) {
      // Update existing review
      await database.query(
        'UPDATE reviews SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP WHERE listing_id = $3 AND user_id = $4',
        [rating, comment, listingId, session.userId]
      );
    } else {
      // Create new review
      await database.query(
        'INSERT INTO reviews (listing_id, user_id, rating, comment) VALUES ($1, $2, $3, $4)',
        [listingId, session.userId, rating, comment]
      );
    }
    
    revalidatePath(`/listings/${listingId}`);
    
    return { success: true, message: 'Review submitted successfully' };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, message: 'Failed to submit review' };
  }
}