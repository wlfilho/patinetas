'use client'

import { useEffect, useState } from 'react'

interface BusinessMapProps {
  address: string
  businessName: string
  city: string
  className?: string
}

export default function BusinessMap({ 
  address, 
  businessName, 
  city,
  className = "" 
}: BusinessMapProps) {
  const [mapError, setMapError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (!address) return null

  // Create a search query for the business location
  const searchQuery = encodeURIComponent(`${address}, ${city}, Colombia`)
  
  // OpenStreetMap embed URL using Nominatim for geocoding
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=-74.2,4.5,-74.0,4.7&layer=mapnik&marker=4.6,-74.1`
  
  // Alternative: Use a more specific map service
  const mapboxUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-l+000(-74.1,4.6)/-74.1,4.6,12/400x300?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`

  const handleMapLoad = () => {
    setIsLoading(false)
  }

  const handleMapError = () => {
    setMapError(true)
    setIsLoading(false)
  }

  if (mapError) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-gray-600 mb-4">No se pudo cargar el mapa</p>
        <div className="mt-4 space-y-2">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${searchQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Ver en Google Maps
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '300px' }}>
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=-74.2,4.5,-74.0,4.7&layer=mapnik`}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa de ${businessName}`}
          onLoad={handleMapLoad}
          onError={handleMapError}
        />
      </div>
    </div>
  )
}
