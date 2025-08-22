'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/app/(auth)/login/actions';
import { createListing, listingSchema } from '@/lib/listing-utils';
import { z } from 'zod';

// Extended schema for form data that includes string inputs
const createListingFormSchema = z.object({
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
  is_hidden: z.string().optional().transform(val => val === 'on'),
  is_time_locked: z.string().optional().transform(val => val === 'on'),
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

export async function createListingAction(prevState: any, formData: FormData) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    if (!session) {
      return { success: false, message: 'You must be logged in to create a listing.' };
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
    const parsed = createListingFormSchema.safeParse(rawData);
    
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

    // Create the listing
    const listingId = await createListing(session.userId, {
      title: validatedData.title,
      description: validatedData.description,
      price_xmr: validatedData.price_xmr,
      category: validatedData.category,
      condition: validatedData.condition,
      location: validatedData.location,
      is_hidden: validatedData.is_hidden,
      is_time_locked: validatedData.is_time_locked,
      visible_from: validatedData.visible_from,
      visible_until: validatedData.visible_until,
    });

    // Redirect to the created listing or dashboard
    redirect(`/listings/${listingId}`);
    
  } catch (error) {
    console.error('Create listing error:', error);
    
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}