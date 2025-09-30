'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { brandService, MarcaPatineta } from '@/lib/supabase'
import { getBrandSlug } from '@/lib/slugs'

interface BrandCarouselProps {
  autoPlay?: boolean
  autoPlayInterval?: number
  showNavigation?: boolean
  showDots?: boolean
  className?: string
}

export default function BrandCarousel({
  autoPlay = true,
  autoPlayInterval = 4000,
  showNavigation = true,
  showDots = true,
  className = ''
}: BrandCarouselProps) {
  const [brands, setBrands] = useState<MarcaPatineta[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Number of brands to show per slide based on screen size
  const [brandsPerSlide, setBrandsPerSlide] = useState(4)

  const loadBrands = useCallback(async () => {
    try {
      setLoading(true)
      const data = await brandService.getAll(false) // Only active brands
      setBrands(data.filter(brand => brand.logo_url)) // Only brands with logos
    } catch (error) {
      console.error('Error loading brands:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBrands()
  }, [loadBrands])

  // Handle responsive brands per slide
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setBrandsPerSlide(2) // Mobile: 2 brands
      } else if (window.innerWidth < 768) {
        setBrandsPerSlide(3) // Tablet: 3 brands
      } else if (window.innerWidth < 1024) {
        setBrandsPerSlide(4) // Desktop small: 4 brands
      } else {
        setBrandsPerSlide(5) // Desktop large: 5 brands
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || brands.length <= brandsPerSlide) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const maxIndex = Math.max(0, brands.length - brandsPerSlide)
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, isHovered, brands.length, brandsPerSlide])

  const goToSlide = (index: number) => {
    const maxIndex = Math.max(0, brands.length - brandsPerSlide)
    setCurrentIndex(Math.min(index, maxIndex))
  }

  const goToPrevious = () => {
    setCurrentIndex(prev => {
      const maxIndex = Math.max(0, brands.length - brandsPerSlide)
      return prev <= 0 ? maxIndex : prev - 1
    })
  }

  const goToNext = () => {
    setCurrentIndex(prev => {
      const maxIndex = Math.max(0, brands.length - brandsPerSlide)
      return prev >= maxIndex ? 0 : prev + 1
    })
  }

  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (brands.length === 0) {
    return null
  }

  const totalSlides = Math.max(1, Math.ceil(brands.length / brandsPerSlide))

  return (
    <div 
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / brandsPerSlide)}%)` }}
        >
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex-shrink-0 px-2 sm:px-3"
              style={{ width: `${100 / brandsPerSlide}%` }}
            >
              {/* TEMPORARY: Brand cards are not clickable until catalog is fully populated */}
              {/* TODO: Uncomment Link wrapper when electric scooter specifications are complete */}
              {/* <Link
                href={`/catalogo/marcas/${getBrandSlug(brand.nombre)}`}
                className="block group"
                aria-label={`Ver modelos de ${brand.nombre}`}
              > */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 transition-all duration-300">
                  <div className="aspect-square relative mb-3">
                    <Image
                      src={brand.logo_url!}
                      alt={`Logo de ${brand.nombre}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base transition-colors">
                      {brand.nombre}
                    </h3>
                    {brand.pais_origen && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {brand.pais_origen}
                      </p>
                    )}
                  </div>
                </div>
              {/* </Link> */}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showNavigation && brands.length > brandsPerSlide && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-200 z-10"
            aria-label="Marca anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-200 z-10"
            aria-label="Marca siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && totalSlides > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === Math.floor(currentIndex / brandsPerSlide)
                  ? 'bg-primary w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir a la página ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
