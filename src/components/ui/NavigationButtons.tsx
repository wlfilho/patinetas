'use client'

interface NavigationButtonsProps {
  address: string
  businessName: string
  className?: string
}

export default function NavigationButtons({ 
  address, 
  businessName,
  className = "" 
}: NavigationButtonsProps) {
  if (!address) return null

  const encodedAddress = encodeURIComponent(`${address}`)
  const encodedBusinessName = encodeURIComponent(businessName)

  const navigationLinks = [
    {
      name: 'Waze',
      url: `https://waze.com/ul?q=${encodedAddress}&navigate=yes`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.184 10.036c-.503-5.55-5.139-9.96-10.77-10.036C5.864-.064.503 4.847.016 10.397c-.487 5.55 3.425 10.461 8.975 10.948.486.043.973.043 1.459 0 5.55-.487 10.461-3.425 10.948-8.975.043-.486.043-.973 0-1.459-.216-2.43-1.297-4.644-3.214-6.875zm-11.77 11.77c-4.644-.432-8.111-4.428-7.679-8.975.432-4.547 4.428-8.014 8.975-7.582 4.547.432 8.014 4.428 7.582 8.975-.432 4.547-4.428 8.014-8.975 7.582z"/>
          <path d="M12 6c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
        </svg>
      ),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Google Maps',
      url: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      ),
      color: 'bg-green-600 hover:bg-green-700'
    }
  ]

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-900 mb-2">Cómo llegar</h4>
      <div className="grid grid-cols-1 gap-2">
        {navigationLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center px-4 py-3 text-white rounded-lg transition-colors ${link.color}`}
          >
            {link.icon}
            <span className="ml-2">Abrir en {link.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
