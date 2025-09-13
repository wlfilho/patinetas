'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const catalogNavigation = [
  { name: 'Todos los Modelos', href: '/catalogo', icon: '🛴' },
  { name: 'Marcas', href: '/marcas', icon: '🏷️' },
]

export default function CatalogNavigation() {
  const pathname = usePathname()

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <nav className="flex space-x-8" aria-label="Navegación del catálogo">
          {catalogNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                pathname === item.href
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
