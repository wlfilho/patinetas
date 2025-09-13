import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marca no encontrada | Patinetas Eléctricas Colombia',
  description: 'La marca que buscas no existe o no está disponible. Explora nuestro catálogo completo de marcas de patinetas eléctricas.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="text-8xl mb-6">🔍</div>
        
        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Marca no encontrada
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Lo sentimos, la marca que buscas no existe o no está disponible en nuestro catálogo.
        </p>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/marcas"
            className="block w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Ver Todas las Marcas
          </Link>
          
          <Link
            href="/catalogo"
            className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Ver Catálogo Completo
          </Link>
          
          <Link
            href="/"
            className="block w-full px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
        
        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>¿No encuentras lo que buscas?</p>
          <Link
            href="/contacto"
            className="text-primary hover:text-primary-dark font-medium"
          >
            Contáctanos para ayudarte
          </Link>
        </div>
      </div>
    </div>
  )
}
