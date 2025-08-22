'use server';

import { getListingById } from '@/lib/listing-utils';
import { getSession } from '@/app/(auth)/login/actions';

export async function getListingData(id: string) {
  const listingId = parseInt(id);
  
  if (isNaN(listingId)) {
    return null;
  }

  try {
    const listing = await getListingById(listingId);
    
    if (!listing) {
      return null;
    }

    const session = await getSession();
    const isOwner = session?.userId === listing.seller_id;

    return {
      listing,
      isOwner,
      userId: session?.userId
    };
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}