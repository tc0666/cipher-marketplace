'use client';

import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 mb-8">
        <div className="aspect-video bg-gray-800/50 rounded-2xl flex items-center justify-center border border-gray-600/30">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400 font-light">No images available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Featured Image */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 mb-8">
        <div className="aspect-video bg-gray-700/50 rounded-2xl overflow-hidden">
          <img 
            src={images[selectedImage]} 
            alt={title}
            className="w-full h-full object-cover transition-all duration-500"
          />
        </div>
      </div>

      {/* Product Gallery */}
      {images.length > 1 && (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 mb-8">
          <h2 className="text-2xl font-light text-white mb-6 tracking-wide">Product Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="group relative">
                <div 
                  className={`aspect-square bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border hover:border-gray-600/50 ${
                    selectedImage === index 
                      ? 'border-green-500/70 ring-2 ring-green-500/30' 
                      : 'border-gray-700/50'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${title} - Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
                {index === 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                    Featured
                  </div>
                )}
                {selectedImage === index && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                    Selected
                  </div>
                )}
              </div>
            ))}
          </div>
          {images.length > 8 && (
            <div className="mt-6 text-center">
              <button className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-600/50">
                View All Images ({images.length})
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}