'use server';
import { deleteListing } from '@/lib/listing-utils';
import { getSession } from '@/app/(auth)/login/actions';

export async function deleteListingAction(prevState: any, formData: FormData) { 
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, message: 'Unauthorized' };
  }

  const listingId = formData.get('id')?.toString();
  if (!listingId) {
    return { success: false, message: 'Missing listing ID' };
  }

  try {
    await deleteListing(listingId, session.userId);
    return { success: true, message: 'Listing deleted', redirectUrl: '/listings' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Failed to delete listing' };
  }
}