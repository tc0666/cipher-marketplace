'use server';

import { getSession } from '@/app/(auth)/login/actions';
import { getListingById } from '@/lib/listing-utils';

export async function getListingEditData(listingId: number) {
  const session = await getSession();
  if (!session) {
    return { error: 'Unauthorized', listing: null };
  }

  const listing = await getListingById(listingId);
  if (!listing) {
    return { error: 'Listing not found', listing: null };
  }

  if (listing.seller_id !== session.userId) {
    return { error: 'Forbidden', listing: null };
  }

  return { listing, error: null };
}