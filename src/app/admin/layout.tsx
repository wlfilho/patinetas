import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Admin - Patinetas Eléctricas Colombia',
  description: 'Panel de administración para gestionar el directorio de patinetas eléctricas',
  robots: 'noindex, nofollow'
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600">
                  <span className="text-white font-bold text-lg">⚙️</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Admin <span className="text-primary">Panel</span>
                </span>
              </Link>
            </div>
            
            <nav className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:text-primary hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/businesses"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:text-primary hover:bg-gray-50"
              >
                Negocios
              </Link>
              <Link
                href="/admin/categories"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:text-primary hover:bg-gray-50"
              >
                Categorías
              </Link>
              <Link
                href="/admin/brands"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:text-primary hover:bg-gray-50"
              >
                Marcas
              </Link>
              <Link
                href="/admin/models"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:text-primary hover:bg-gray-50"
              >
                Modelos
              </Link>
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:text-primary hover:bg-gray-50"
                target="_blank"
              >
                Ver Sitio
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
