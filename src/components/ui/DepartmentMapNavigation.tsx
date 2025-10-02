'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { NegocioDirectorio } from '@/types'
import { getCitySlug } from '@/lib/slugs'
import '@/styles/map-markers.css'
import type * as LeafletTypes from 'leaflet'

// Import Leaflet only on client side
let L: typeof LeafletTypes | undefined
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  L = require('leaflet')
}

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

// Import useMapEvents directly (it's a hook, not a component)
// It will only be used inside components that are already client-side only
import { useMapEvents } from 'react-leaflet'

interface DepartmentMapNavigationProps {
  businesses: NegocioDirectorio[]
  businessesByCity: Record<string, NegocioDirectorio[]>
  departmentName: string
}

interface BusinessWithCoordinates extends NegocioDirectorio {
  coordinates?: [number, number]
  index: number
}

interface GeocodingCache {
  [address: string]: [number, number] | null
}

// Approximate coordinates for Colombian departments (center points)
const DEPARTMENT_COORDINATES: Record<string, [number, number]> = {
  'Antioquia': [6.2476, -75.5658],
  'Bogotá D.C.': [4.7110, -74.0721],
  'Cundinamarca': [5.0269, -74.0380],
  'Valle del Cauca': [3.4516, -76.5320],
  'Atlántico': [10.9685, -74.7813],
  'Santander': [7.1301, -73.1259],
  'Bolívar': [10.3910, -75.4794],
  'Tolima': [4.4389, -75.2322],
  'Nariño': [1.2136, -77.2811],
  'Córdoba': [8.7479, -75.8814],
  'Cauca': [2.4448, -76.6147],
  'Boyacá': [5.4545, -73.3623],
  'Meta': [4.1420, -73.6266],
  'Huila': [2.5359, -75.5277],
  'Norte de Santander': [7.9463, -72.8988],
  'Magdalena': [10.4111, -74.4056],
  'Caldas': [5.0689, -75.5174],
  'Risaralda': [4.8133, -75.6961],
  'Cesar': [9.3333, -73.6533],
  'Quindío': [4.4611, -75.6674],
  'Sucre': [9.3047, -75.3978],
  'La Guajira': [11.5444, -72.9072],
  'Caquetá': [1.6144, -75.6062],
  'Casanare': [5.7589, -71.5724],
  'Chocó': [5.6978, -76.6611],
  'Putumayo': [0.4897, -76.3997],
  'Arauca': [7.0902, -70.7619],
  'San Andrés y Providencia': [12.5847, -81.7006],
  'Guaviare': [2.5667, -72.6333],
  'Vaupés': [1.2500, -70.2333],
  'Amazonas': [-1.4442, -71.6653],
  'Guainía': [2.5833, -68.5833],
  'Vichada': [4.4228, -69.2877],
}

// Map setup component to capture map instance and adjust bounds
function MapSetup({
  businesses,
  onMapReady
}: {
  businesses: BusinessWithCoordinates[]
  onMapReady: (map: LeafletTypes.Map) => void
}) {
  const map = useMapEvents({})

  useEffect(() => {
    if (map) {
      onMapReady(map)
    }
  }, [map, onMapReady])

  useEffect(() => {
    if (!map || businesses.length === 0) return

    const businessesWithCoords = businesses.filter(b => b.coordinates)
    if (businessesWithCoords.length === 0) return

    // Small delay to ensure map is fully loaded
    setTimeout(() => {
      // Verify map has fitBounds method before calling
      if (!map || typeof map.fitBounds !== 'function') {
        console.warn('Map not ready or fitBounds not available')
        return
      }

      // Verify L is available
      if (!L || typeof L.latLngBounds !== 'function') {
        console.warn('Leaflet not loaded')
        return
      }

      const bounds = L.latLngBounds(
        businessesWithCoords.map(b => b.coordinates!)
      )

      // Adjust zoom for better visibility of markers
      // Use smaller padding and higher maxZoom for closer view
      map.fitBounds(bounds, {
        padding: [30, 30],
        maxZoom: 15,
        animate: true,
        duration: 0.5
      })
    }, 500)
  }, [map, businesses])

  return null
}

// Geocoding function using Nominatim API
async function geocodeAddress(address: string, city: string, department: string): Promise<[number, number] | null> {
  try {
    const fullAddress = `${address}, ${city}, ${department}, Colombia`
    const encodedAddress = encodeURIComponent(fullAddress)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PatinetaElectrica.com.co Directory App'
      }
    })

    if (!response.ok) return null

    const data = await response.json()
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
    }

    return null
  } catch (error) {
    console.warn('Geocoding error:', error)
    return null
  }
}

// Create numbered marker icon (circular badge)
function createNumberedIcon(number: number, isActive: boolean = false): LeafletTypes.DivIcon | null {
  if (!L || typeof L.divIcon !== 'function') {
    console.warn('Leaflet not loaded')
    return null
  }

  return L.divIcon({
    className: 'custom-numbered-marker',
    html: `
      <div class="marker-badge ${isActive ? 'active' : ''}">
        <div class="marker-number">${number}</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  })
}

export default function DepartmentMapNavigation({
  businesses,
  businessesByCity,
  departmentName,
}: DepartmentMapNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [businessesWithCoords, setBusinessesWithCoords] = useState<BusinessWithCoordinates[]>([])
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [geocodingProgress, setGeocodingProgress] = useState({ current: 0, total: 0 })
  const mapRef = useRef<LeafletTypes.Map | null>(null)
  const markersRef = useRef<{ [key: number]: LeafletTypes.Marker }>({})

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Process businesses: use stored coordinates or geocode if needed
  useEffect(() => {
    if (!isClient || businesses.length === 0) return

    const processBusinesses = async () => {
      const cache: GeocodingCache = {}
      const businessesWithNumbers: BusinessWithCoordinates[] = []
      const businessesToGeocode: number[] = []

      // First pass: identify businesses that need geocoding
      for (let i = 0; i < businesses.length; i++) {
        const business = businesses[i]
        const businessWithIndex: BusinessWithCoordinates = {
          ...business,
          index: i + 1
        }

        // Use stored GPS coordinates if available
        if (business.gps_coordinates?.latitude && business.gps_coordinates?.longitude) {
          businessWithIndex.coordinates = [
            business.gps_coordinates.latitude,
            business.gps_coordinates.longitude
          ]
        } else if (business.direccion && business.ciudad && business.departamento) {
          // Mark for geocoding if no stored coordinates but has address
          businessesToGeocode.push(i)
        }

        businessesWithNumbers.push(businessWithIndex)
      }

      // Set initial state with stored coordinates
      setBusinessesWithCoords(businessesWithNumbers)

      // Geocode remaining businesses if any
      if (businessesToGeocode.length > 0) {
        setIsGeocoding(true)
        setGeocodingProgress({ current: 0, total: businessesToGeocode.length })

        for (let idx = 0; idx < businessesToGeocode.length; idx++) {
          const i = businessesToGeocode[idx]
          const business = businesses[i]
          const cacheKey = `${business.direccion}, ${business.ciudad}, ${business.departamento}`

          // Check cache first
          if (cache[cacheKey] !== undefined) {
            if (cache[cacheKey]) {
              businessesWithNumbers[i].coordinates = cache[cacheKey]!
            }
          } else {
            // Geocode with delay to respect rate limits (1 request per second)
            if (idx > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000))
            }

            const coords = await geocodeAddress(
              business.direccion!,
              business.ciudad,
              business.departamento
            )

            cache[cacheKey] = coords
            if (coords) {
              businessesWithNumbers[i].coordinates = coords
            }
          }

          setGeocodingProgress({ current: idx + 1, total: businessesToGeocode.length })
          setBusinessesWithCoords([...businessesWithNumbers])
        }

        setIsGeocoding(false)
      }
    }

    processBusinesses()
  }, [isClient, businesses])

  // Get department center coordinates
  const departmentCenter = DEPARTMENT_COORDINATES[departmentName] || [4.5709, -74.2973] // Default to Colombia center

  // Filter businesses based on search query
  const filteredBusinessesWithCoords = useMemo(() => {
    if (!searchQuery.trim()) return businessesWithCoords

    const query = searchQuery.toLowerCase()
    return businessesWithCoords.filter(
      (business) =>
        business.nombre.toLowerCase().includes(query) ||
        business.descripcion?.toLowerCase().includes(query) ||
        business.ciudad.toLowerCase().includes(query)
    )
  }, [businessesWithCoords, searchQuery])

  // Group filtered businesses by city
  const filteredBusinessesByCity = useMemo(() => {
    const grouped: Record<string, BusinessWithCoordinates[]> = {}

    filteredBusinessesWithCoords.forEach((business) => {
      if (!grouped[business.ciudad]) {
        grouped[business.ciudad] = []
      }
      grouped[business.ciudad].push(business)
    })

    return grouped
  }, [filteredBusinessesWithCoords])

  // Count total filtered businesses
  const totalFilteredBusinesses = filteredBusinessesWithCoords.length

  // Scroll to business card and highlight on map
  const scrollToBusiness = (businessId: number, business: BusinessWithCoordinates) => {
    setSelectedBusiness(businessId)

    // Scroll to business card
    const element = document.getElementById(`business-${businessId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    // Pan to marker on map if coordinates exist
    if (business.coordinates && mapRef.current && typeof mapRef.current.setView === 'function') {
      mapRef.current.setView(business.coordinates, 16, { animate: true })

      // Open marker popup
      const marker = markersRef.current[businessId]
      if (marker) {
        marker.openPopup()
      }
    }

    // Reset selection after 3 seconds
    setTimeout(() => setSelectedBusiness(null), 3000)
  }

  // Scroll to city section
  const scrollToCity = (citySlug: string) => {
    const element = document.getElementById(`ciudad-${citySlug}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Handle marker click
  const handleMarkerClick = (business: BusinessWithCoordinates) => {
    setSelectedBusiness(business.id)

    // Scroll to business in navigation list
    const listElement = document.getElementById(`nav-business-${business.id}`)
    if (listElement) {
      listElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    // Reset selection after 3 seconds
    setTimeout(() => setSelectedBusiness(null), 3000)
  }

  return (
    <div className="mb-12 sm:mb-16">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Map */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] relative">
          {isClient && typeof window !== 'undefined' ? (
            <>
              <MapContainer
                center={departmentCenter}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Map setup and bounds adjustment */}
                <MapSetup
                  businesses={filteredBusinessesWithCoords}
                  onMapReady={(map) => {
                    mapRef.current = map
                  }}
                />

                {/* Business markers */}
                {filteredBusinessesWithCoords
                  .filter(business => business.coordinates)
                  .map((business) => {
                    const icon = createNumberedIcon(business.index, selectedBusiness === business.id)
                    if (!icon) return null

                    return (
                      <Marker
                        key={business.id}
                        position={business.coordinates!}
                        icon={icon}
                        ref={(marker) => {
                          if (marker) {
                            markersRef.current[business.id] = marker
                          }
                        }}
                        eventHandlers={{
                          click: () => handleMarkerClick(business)
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <h4 className="font-bold text-gray-900 mb-1">
                              {business.index}. {business.nombre}
                          </h4>
                          {business.direccion && (
                            <p className="text-sm text-gray-600 mb-1">
                              📍 {business.direccion}
                            </p>
                          )}
                          {business.categoria && (
                            <p className="text-xs text-gray-500">
                              {business.categoria}
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                    )
                  })}
              </MapContainer>

              {/* Geocoding progress indicator */}
              {isGeocoding && (
                <div className="absolute top-4 left-4 right-4 flex justify-center pointer-events-none z-[1000]">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 pointer-events-auto">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      <div className="text-sm text-gray-700">
                        Geocodificando direcciones... {geocodingProgress.current}/{geocodingProgress.total}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-lg text-gray-600 font-medium">
                  Cargando mapa...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Quick Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden flex flex-col max-h-[400px] sm:max-h-[500px] lg:max-h-[600px]">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                📋 Navegación Rápida
              </h3>
              <span className="text-sm text-gray-500 font-medium">
                {totalFilteredBusinesses} {totalFilteredBusinesses === 1 ? 'negocio' : 'negocios'}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar negocio o ciudad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm sm:text-base"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Business List */}
          <div className="overflow-y-auto flex-1 p-4 sm:p-6 pt-2">
            {Object.keys(filteredBusinessesByCity).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(filteredBusinessesByCity).map(([city, cityBusinesses]) => {
                  const citySlug = getCitySlug(city)
                  return (
                    <div key={city}>
                      {/* City Header */}
                      <button
                        onClick={() => scrollToCity(citySlug)}
                        className="flex items-center gap-2 mb-3 text-left w-full hover:text-primary transition-colors group"
                      >
                        <span className="text-lg">📍</span>
                        <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {city}
                        </h4>
                        <span className="text-sm text-gray-500 font-medium">
                          ({cityBusinesses.length})
                        </span>
                      </button>

                      {/* Business Links */}
                      <div className="space-y-1 ml-2">
                        {cityBusinesses.map((business) => {
                          return (
                            <button
                              key={business.id}
                              id={`nav-business-${business.id}`}
                              onClick={() => scrollToBusiness(business.id, business)}
                              className={`
                                w-full text-left py-2 px-3 rounded-lg transition-all text-sm sm:text-base
                                ${
                                  selectedBusiness === business.id
                                    ? 'bg-primary/10 text-primary font-medium ring-2 ring-primary/30'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                                }
                              `}
                            >
                              <div className="flex items-start gap-3">
                                {/* Numbered badge */}
                                <div className={`
                                  flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                  ${
                                    selectedBusiness === business.id
                                      ? 'bg-primary text-white'
                                      : 'bg-gray-200 text-gray-700'
                                  }
                                `}>
                                  {business.index}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate flex items-center gap-2">
                                    {business.nombre}
                                    {business.coordinates && (
                                      <span className="text-xs text-green-600" title="Ubicación en mapa">
                                        📍
                                      </span>
                                    )}
                                  </div>
                                  {business.categoria && (
                                    <div className="text-xs text-gray-500 truncate">
                                      {business.categoria}
                                    </div>
                                  )}
                                  {business.direccion && (
                                    <div className="text-xs text-gray-400 truncate">
                                      {business.direccion}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-lg text-gray-600 font-medium mb-1">
                  No se encontraron resultados
                </p>
                <p className="text-sm text-gray-500">
                  Intente con otros términos de búsqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

