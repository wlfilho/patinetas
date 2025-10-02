'use client'

import { getCitySlug } from '@/lib/slugs'

interface CityCardProps {
  city: string
  businessCount: number
}

export default function CityCard({ city, businessCount }: CityCardProps) {
  const citySlug = getCitySlug(city)

  const handleClick = () => {
    const element = document.getElementById(`ciudad-${citySlug}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <button
      onClick={handleClick}
      className="group relative w-full bg-white border-2 border-gray-100 rounded-xl shadow-md hover:shadow-xl hover:border-primary hover:-translate-y-1 transition-all duration-300 p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="relative">
        {/* City Name */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🏙️</span>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
            {city}
          </h3>
        </div>

        {/* Business Count Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 group-hover:bg-primary/10 rounded-full mb-4 transition-colors duration-300">
          <svg className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">
            {businessCount} {businessCount === 1 ? 'negocio' : 'negocios'}
          </span>
        </div>

        {/* Link Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 group-hover:border-primary/20 transition-colors duration-300">
          <span className="text-sm font-semibold text-primary group-hover:text-primary-dark transition-colors">
            Ver negocios
          </span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
            <svg className="w-4 h-4 text-primary group-hover:text-white group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  )
}

