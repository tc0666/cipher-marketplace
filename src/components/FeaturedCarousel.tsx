'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Listing } from '@/lib/listing-utils'

interface FeaturedCarouselProps {
  listings: Listing[]
}

export default function FeaturedCarousel({ listings }: FeaturedCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Split listings into chunks of 3 for carousel slides
  const slides = []
  for (let i = 0; i < listings.length; i += 3) {
    slides.push(listings.slice(i, i + 3))
  }
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }
  

  
  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">No listings available at the moment.</p>
        <Link href="/listings/create" className="inline-block mt-4 px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-300">
          Create First Listing
        </Link>
      </div>
    )
  }
  
  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {slide.map((listing) => (
                  <div key={listing.id} className="group bg-gray-900/30 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5">
                    <div className="mb-4">
                      <span className="text-xs text-gray-300 bg-gray-800/50 px-3 py-2 rounded-full font-medium border border-gray-700/50">
                        {listing.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-6 tracking-wide group-hover:text-green-400 transition-colors duration-300">{listing.title}</h3>
                    <p className="text-gray-400 mb-8 font-light leading-relaxed flex-grow">{listing.description.length > 80 ? listing.description.substring(0, 80) + '...' : listing.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium text-lg">{listing.price_xmr} <span className="text-green-400">XMR</span></span>
                      <Link href={`/listings/${listing.id}`} className="px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-sm font-medium transform hover:scale-105 inline-block">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
                {/* Fill empty slots if less than 3 items */}
                {slide.length < 3 && Array.from({ length: 3 - slide.length }).map((_, index) => (
                  <div key={`empty-${index}`} className="hidden md:block"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 group"
          >
            <svg className="w-6 h-6 text-white group-hover:text-green-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 group"
          >
            <svg className="w-6 h-6 text-white group-hover:text-green-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      
      {/* Carousel Dots */}
      {slides.length > 1 && (
        <div className="flex justify-center mt-12 space-x-3">
          {slides.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white/70 scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            ></button>
          ))}
        </div>
      )}
    </div>
  )
}