'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/app/(auth)/login/actions';
import { updateListing, listingSchema } from '@/lib/listing-utils';
import { z } from 'zod';

// Extended schema for form data that includes string inputs
const editListingFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title must be at most 255 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price_xmr: z.string().transform((val) => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
      throw new Error('Price must be a positive number');
    }
    return num;
  }),
  category: z.string().min(1, 'Category is required'),
  condition: z.string().min(1, 'Condition is required'),
  location: z.string().optional(),
  is_hidden: z.preprocess((val) => val === 'on', z.boolean()),
  is_time_locked: z.preprocess((val) => val === 'on', z.boolean()),
  visible_from: z.string().optional().transform((val) => {
    if (!val) return undefined;
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid visible from date');
    }
    return date;
  }),
  visible_until: z.string().optional().transform((val) => {
    if (!val) return undefined;
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid visible until date');
    }
    return date;
  }),
});

export async function editListingAction(prevState: any, formData: FormData) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    if (!session) {
      return { success: false, message: 'You must be logged in to edit a listing.' };
    }

    // Extract listing ID from form data
    const listingId = formData.get('id') as string;
    if (!listingId) {
      return { success: false, message: 'Listing ID is required.' };
    }

    // Extract and validate form data
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price_xmr: formData.get('price_xmr') as string,
      category: formData.get('category') as string,
      condition: formData.get('condition') as string,
      location: formData.get('location') as string || undefined,
      is_hidden: formData.get('is_hidden') as string,
      is_time_locked: formData.get('is_time_locked') as string,
      visible_from: formData.get('visible_from') as string,
      visible_until: formData.get('visible_until') as string,
    };

    // Validate the form data
    const parsed = editListingFormSchema.safeParse(rawData);
    
    if (!parsed.success) {
      const errorMessages = parsed.error.errors.map(e => e.message).join(', ');
      return { success: false, message: errorMessages };
    }

    const validatedData = parsed.data;

    // Additional validation for time-locked listings
    if (validatedData.is_time_locked) {
      if (!validatedData.visible_from) {
        return { success: false, message: 'Visible from date is required for time-locked listings.' };
      }
      
      if (validatedData.visible_from <= new Date()) {
        return { success: false, message: 'Visible from date must be in the future.' };
      }
      
      if (validatedData.visible_until && validatedData.visible_until <= validatedData.visible_from) {
        return { success: false, message: 'Visible until date must be after visible from date.' };
      }
    }

    // Update the listing
    const success = await updateListing(
      parseInt(listingId),
      session.userId,
      {
        title: validatedData.title,
        description: validatedData.description,
        price_xmr: validatedData.price_xmr,
        category: validatedData.category,
        condition: validatedData.condition,
        location: validatedData.location,
        is_hidden: validatedData.is_hidden,
      }
    );

    if (!success) {
      return { success: false, message: 'Failed to update listing.' };
    }

    // Show success toast and redirect to listing page
    return { 
      success: true, 
      message: 'Listing successfully updated',
      redirectUrl: `/listings/${listingId}`
    };
    
  } catch (error) {
    console.error('Edit listing error:', error);
    
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}