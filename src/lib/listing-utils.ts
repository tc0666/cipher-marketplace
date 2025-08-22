import db from './db-sqlite';
import { z } from 'zod';

// Define the listing schema for validation
export const listingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title must be at most 255 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price_xmr: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  condition: z.string().min(1, 'Condition is required'),
  location: z.string().optional(),
  is_hidden: z.boolean().default(false),
});

export type ListingData = z.infer<typeof listingSchema>;

export interface Listing {
  id: number;
  seller_id: number;
  title: string;
  description: string;
  price_xmr: number;
  category: string;
  condition: string;
  location?: string;
  is_hidden: boolean;
  status: string;
  created_at: Date;
  updated_at: Date;
  seller_username?: string;
}

// Create a new listing
export async function createListing(sellerId: number, listingData: ListingData): Promise<number> {
  const {
    title,
    description,
    price_xmr,
    category,
    condition,
    location,
    is_hidden
  } = listingData;

  const result = await db.query(
    `INSERT INTO listings 
     (seller_id, title, description, price_xmr, category, condition, location, is_hidden)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [sellerId, title, description, price_xmr, category, condition, location, is_hidden]
  );

  return (result.rows[0] as any).id;
}

// Get listing by ID
export async function getListingById(id: number): Promise<Listing | null> {
  const result = await db.query(
    `SELECT l.*, u.username as seller_username 
     FROM listings l 
     JOIN users u ON l.seller_id = u.id 
     WHERE l.id = $1`,
    [id]
  );

  return (result.rows[0] as Listing) || null;
}

// Get listings by seller ID
export async function getListingsBySeller(sellerId: number): Promise<Listing[]> {
  const result = await db.query(
    `SELECT l.*, u.username as seller_username 
     FROM listings l 
     JOIN users u ON l.seller_id = u.id 
     WHERE l.seller_id = $1 
     ORDER BY l.created_at DESC`,
    [sellerId]
  );

  return result.rows as Listing[];
}

// Get all active listings (public view)
export async function getActiveListings(limit: number = 20, offset: number = 0, category?: string): Promise<Listing[]> {
  let query = `
    SELECT l.*, u.username as seller_username 
    FROM listings l 
    JOIN users u ON l.seller_id = u.id 
    WHERE l.status = 'active' 
      AND l.is_hidden = false
  `;
  
  const params: any[] = [];
  
  if (category) {
    query += ` AND l.category = $${params.length + 1}`;
    params.push(category);
  }
  
  query += ` ORDER BY l.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await db.query(query, params);
  return result.rows as Listing[];
}

// Update listing
export async function updateListing(id: number, sellerId: number, listingData: Partial<ListingData>): Promise<boolean> {
  const fields = [];
  const values = [];
  let paramCount = 1;

  for (const [key, value] of Object.entries(listingData)) {
    if (value !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  }

  if (fields.length === 0) return false;

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id, sellerId);

  const query = `
    UPDATE listings 
    SET ${fields.join(', ')} 
    WHERE id = $${paramCount} AND seller_id = $${paramCount + 1}
  `;

  const result = await db.query(query, values);
  return (result.rowCount || 0) > 0;
}

// Delete listing
export async function deleteListing(id: number, sellerId: number): Promise<boolean> {
  const result = await db.query(
    'DELETE FROM listings WHERE id = $1 AND seller_id = $2',
    [id, sellerId]
  );

  return (result.rowCount || 0) > 0;
}

// Get categories
export async function getCategories(): Promise<string[]> {
  const result = await db.query(
    'SELECT DISTINCT category FROM listings WHERE status = \'active\' ORDER BY category'
  );

  return result.rows.map((row: any) => row.category);
}

// Search listings
export async function searchListings(searchTerm: string, limit: number = 20, offset: number = 0): Promise<Listing[]> {
  const result = await db.query(
    `SELECT l.*, u.username as seller_username 
     FROM listings l 
     JOIN users u ON l.seller_id = u.id 
     WHERE l.status = 'active' 
       AND l.is_hidden = false 
       AND (l.title LIKE $1 COLLATE NOCASE OR l.description LIKE $1 COLLATE NOCASE OR l.category LIKE $1 COLLATE NOCASE)
     ORDER BY l.created_at DESC 
     LIMIT $2 OFFSET $3`,
    [`%${searchTerm}%`, limit, offset]
  );

  return result.rows as Listing[];
}