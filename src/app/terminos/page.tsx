import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos de Uso | Patinetas Eléctricas Colombia',
  description: 'Términos y condiciones de uso del directorio de patinetas eléctricas más completo de Colombia.',
  keywords: 'términos de uso, condiciones, directorio patinetas eléctricas',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Términos de Uso
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Términos y condiciones que rigen el uso de nuestro directorio de patinetas eléctricas.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            
            <div className="text-sm text-gray-500 mb-8">
              <p><strong>Última actualización:</strong> Enero 2024</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
              <p className="text-gray-600 leading-relaxed">
                Al acceder y utilizar el sitio web Patinetas Eléctricas Colombia, usted acepta estar sujeto a estos 
                términos de uso, todas las leyes y regulaciones aplicables, y acepta que es responsable del 
                cumplimiento de las leyes locales aplicables.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Uso del Sitio Web</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Este sitio web es un directorio informativo de negocios relacionados con patinetas eléctricas en Colombia. 
                Usted puede usar nuestro sitio para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Buscar información sobre tiendas, servicios técnicos y repuestos</li>
                <li>Consultar especificaciones de modelos y marcas</li>
                <li>Contactar directamente con los negocios listados</li>
                <li>Obtener información general sobre patinetas eléctricas</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Información de Negocios</h2>
              <p className="text-gray-600 leading-relaxed">
                La información sobre los negocios listados en nuestro directorio es proporcionada por los propios 
                negocios o recopilada de fuentes públicas. Aunque nos esforzamos por mantener la información 
                actualizada y precisa, no garantizamos la exactitud, completitud o actualidad de toda la información.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Responsabilidades del Usuario</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Al utilizar nuestro sitio web, usted se compromete a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Usar el sitio solo para fines legales y legítimos</li>
                <li>No interferir con el funcionamiento del sitio</li>
                <li>No intentar acceder a áreas restringidas del sitio</li>
                <li>Respetar los derechos de propiedad intelectual</li>
                <li>No usar el sitio para actividades fraudulentas o maliciosas</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Propiedad Intelectual</h2>
              <p className="text-gray-600 leading-relaxed">
                El contenido de este sitio web, incluyendo pero no limitado a texto, gráficos, logotipos, 
                imágenes y software, es propiedad de Patinetas Eléctricas Colombia o sus proveedores de 
                contenido y está protegido por las leyes de derechos de autor colombianas e internacionales.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Enlaces a Terceros</h2>
              <p className="text-gray-600 leading-relaxed">
                Nuestro sitio puede contener enlaces a sitios web de terceros. Estos enlaces se proporcionan 
                únicamente para su conveniencia. No tenemos control sobre el contenido de estos sitios y no 
                somos responsables de su contenido o políticas de privacidad.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitación de Responsabilidad</h2>
              <p className="text-gray-600 leading-relaxed">
                En ningún caso Patinetas Eléctricas Colombia será responsable por daños directos, indirectos, 
                incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar este 
                sitio web, incluso si hemos sido advertidos de la posibilidad de tales daños.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modificaciones</h2>
              <p className="text-gray-600 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos de uso en cualquier momento. Las 
                modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web. 
                Su uso continuado del sitio después de dichas modificaciones constituye su aceptación de 
                los nuevos términos.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Ley Aplicable</h2>
              <p className="text-gray-600 leading-relaxed">
                Estos términos de uso se rigen por las leyes de la República de Colombia. Cualquier disputa 
                relacionada con estos términos será resuelta en los tribunales competentes de Colombia.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contacto</h2>
              <p className="text-gray-600 leading-relaxed">
                Si tiene preguntas sobre estos términos de uso, puede contactarnos a través de:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  <strong>Email:</strong> contacto@patinetaelectrica.com.co<br />
                  <strong>WhatsApp:</strong> +57 300 123 4567
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500">
                Al continuar usando nuestro sitio web, usted reconoce que ha leído, entendido y acepta 
                estar sujeto a estos términos de uso.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
