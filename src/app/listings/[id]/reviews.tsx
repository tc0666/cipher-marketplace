'use client';

import { useState } from 'react';
import { submitReviewAction } from './actions';
import { useActionState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface Review {
  id: number;
  user_id: number;
  listing_id: number;
  username: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsProps {
  listingId: number;
  reviews: Review[];
  hasPurchased: boolean;
  userId?: number;
}

export function Reviews({ listingId, reviews, hasPurchased, userId }: ReviewsProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewState, reviewFormAction] = useActionState(submitReviewAction, { success: false, message: '' });

  const handleSubmit = (formData: FormData) => {
    formData.append('rating', rating.toString());
    formData.append('listingId', listingId.toString());
    if (userId) {
      formData.append('userId', userId.toString());
    }
    reviewFormAction(formData);
  };

  return (
    <div className="mt-16 border-t border-gray-800 pt-10">
      <h2 className="text-2xl font-light text-white mb-6">Customer Reviews</h2>
      
      {reviews.length === 0 ? (
        <p className="text-gray-400 mb-8">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-6 mb-10">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600/80 to-emerald-600/80 rounded-full flex items-center justify-center border border-green-500/30 mr-3">
                    <span className="text-sm font-light text-white">
                      {review.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-medium">{review.username}</span>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    i < review.rating ? (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <StarOutlineIcon key={i} className="h-5 w-5 text-gray-500" />
                    )
                  ))}
                </div>
              </div>
              <p className="text-gray-300">{review.comment}</p>
              <p className="text-gray-500 text-sm mt-2">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {hasPurchased ? (
        <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
          <h3 className="text-xl font-light text-white mb-4">Write a Review</h3>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    {star <= rating ? (
                      <StarIcon className="h-8 w-8 text-yellow-400" />
                    ) : (
                      <StarOutlineIcon className="h-8 w-8 text-gray-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="comment" className="block text-gray-300 mb-2">Your Review</label>
              <textarea
                id="comment"
                name="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Share your experience with this product..."
              ></textarea>
            </div>
            
            {reviewState.message && (
              <div className={`p-3 rounded-lg ${reviewState.success ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 'bg-red-900/30 text-red-400 border border-red-800/50'}`}>
                {reviewState.message}
              </div>
            )}
            
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Submit Review
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
          <div className="flex items-center space-x-3 text-gray-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Only verified purchasers can write reviews for this product.</p>
          </div>
        </div>
      )}
    </div>
  );
}