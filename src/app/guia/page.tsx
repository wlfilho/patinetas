import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Guía de Uso | Patinetas Eléctricas Colombia',
  description: 'Aprende a usar nuestro directorio de patinetas eléctricas. Guía completa para encontrar tiendas, servicios y todo lo que necesitas.',
  keywords: 'guía patinetas eléctricas, cómo usar directorio, tutorial, ayuda',
}

export default function GuiaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Guía de Uso
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Aprende a sacar el máximo provecho de nuestro directorio de patinetas eléctricas. 
              Todo lo que necesitas saber en una guía fácil de seguir.
            </p>
          </div>
        </div>
      </section>

      {/* Guide Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-12">
            
            {/* Getting Started */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                Comenzando
              </h2>
              <div className="space-y-4 ml-11">
                <p className="text-gray-600">
                  Bienvenido al directorio más completo de patinetas eléctricas en Colombia. Aquí encontrarás:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Tiendas especializadas en venta de patinetas eléctricas</li>
                  <li>Servicios técnicos y reparación</li>
                  <li>Repuestos y accesorios</li>
                  <li>Servicios de alquiler</li>
                  <li>Información sobre marcas y modelos</li>
                </ul>
              </div>
            </div>

            {/* Searching */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                Buscando Negocios
              </h2>
              <div className="space-y-4 ml-11">
                <h3 className="text-lg font-semibold text-gray-900">Búsqueda por ubicación</h3>
                <p className="text-gray-600">
                  Usa el buscador principal para encontrar negocios cerca de ti. Puedes buscar por:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Ciudad (ej: "Bogotá", "Medellín", "Cali")</li>
                  <li>Barrio o zona específica</li>
                  <li>Nombre del negocio</li>
                  <li>Tipo de servicio</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-6">Filtros por categoría</h3>
                <p className="text-gray-600">
                  Navega por categorías específicas desde la página principal:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900">🛴 Venta</h4>
                    <p className="text-sm text-gray-600">Tiendas que venden patinetas nuevas</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900">🔧 Reparación</h4>
                    <p className="text-sm text-gray-600">Servicios técnicos especializados</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900">⚙️ Repuestos</h4>
                    <p className="text-sm text-gray-600">Accesorios y partes de repuesto</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900">📅 Alquiler</h4>
                    <p className="text-sm text-gray-600">Renta por horas, días o semanas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                Explorando el Catálogo
              </h2>
              <div className="space-y-4 ml-11">
                <p className="text-gray-600">
                  Nuestro catálogo te permite comparar diferentes modelos y marcas:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li><strong>Ver todos los modelos:</strong> Explora nuestra base de datos completa</li>
                  <li><strong>Filtrar por marca:</strong> Encuentra modelos de marcas específicas</li>
                  <li><strong>Comparar especificaciones:</strong> Velocidad, autonomía, precio</li>
                  <li><strong>Ver disponibilidad:</strong> Qué modelos están disponibles en Colombia</li>
                </ul>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Consejo</h4>
                  <p className="text-blue-800 text-sm">
                    Usa los filtros de precio y especificaciones para encontrar la patineta perfecta para tus necesidades.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Business */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                Contactando Negocios
              </h2>
              <div className="space-y-4 ml-11">
                <p className="text-gray-600">
                  Cada negocio en nuestro directorio incluye información de contacto:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li><strong>WhatsApp:</strong> Contacto directo e inmediato</li>
                  <li><strong>Teléfono:</strong> Para llamadas tradicionales</li>
                  <li><strong>Dirección:</strong> Ubicación física del negocio</li>
                  <li><strong>Horarios:</strong> Cuándo están abiertos</li>
                  <li><strong>Sitio web:</strong> Información adicional y catálogos</li>
                </ul>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-green-900 mb-2">✅ Recomendación</h4>
                  <p className="text-green-800 text-sm">
                    Siempre confirma disponibilidad y precios antes de visitar el negocio.
                  </p>
                </div>
              </div>
            </div>

            {/* Add Business */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                ¿Tienes un Negocio?
              </h2>
              <div className="space-y-4 ml-11">
                <p className="text-gray-600">
                  Si tienes un negocio relacionado con patinetas eléctricas, puedes agregarlo a nuestro directorio:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Registro gratuito y fácil</li>
                  <li>Aumenta tu visibilidad online</li>
                  <li>Llega a más clientes potenciales</li>
                  <li>Actualiza tu información cuando quieras</li>
                </ul>
                
                <div className="mt-6">
                  <Link
                    href="/contacto"
                    className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Agregar mi negocio
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Support */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                ¿Necesitas Ayuda?
              </h2>
              <div className="space-y-4 ml-11">
                <p className="text-gray-600">
                  Si tienes alguna pregunta o problema, estamos aquí para ayudarte:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/contacto"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Contacto</h4>
                      <p className="text-sm text-gray-600">Envíanos un mensaje</p>
                    </div>
                  </Link>
                  
                  <Link
                    href="/reportar"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Reportar problema</h4>
                      <p className="text-sm text-gray-600">Información incorrecta</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
