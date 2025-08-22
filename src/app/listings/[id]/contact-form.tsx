'use client';

import { useState } from 'react';

interface ContactSellerFormProps {
  listingId: number;
  sellerId: number;
}

export function ContactSellerForm({ listingId, sellerId }: ContactSellerFormProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setStatus({ type: 'error', message: 'Please enter a message.' });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          sellerId,
          message: message.trim(),
        }),
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully!' });
        setMessage('');
      } else {
        const error = await response.text();
        setStatus({ type: 'error', message: error || 'Failed to send message.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          Your Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Hi, I'm interested in your listing..."
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isSubmitting}
        />
      </div>

      {status && (
        <div className={`p-3 rounded-md text-sm ${
          status.type === 'success' 
            ? 'bg-green-900 text-green-300 border border-green-700' 
            : 'bg-red-900 text-red-300 border border-red-700'
        }`}>
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !message.trim()}
        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>

      <div className="text-xs text-gray-500">
        💡 Tip: Be specific about your interest and ask relevant questions to get a faster response.
      </div>
    </form>
  );
}