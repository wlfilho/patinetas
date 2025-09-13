import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Patinetas Eléctricas Colombia',
  description: 'Política de privacidad y protección de datos del directorio de patinetas eléctricas más completo de Colombia.',
  keywords: 'política de privacidad, protección de datos, directorio patinetas eléctricas',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Política de Privacidad
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Cómo recopilamos, usamos y protegemos su información personal en nuestro directorio.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            
            <div className="text-sm text-gray-500 mb-8">
              <p><strong>Última actualización:</strong> Enero 2024</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Información que Recopilamos</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                En Patinetas Eléctricas Colombia, recopilamos información limitada para brindar nuestros servicios:
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Información que usted nos proporciona:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mb-4">
                <li>Datos de contacto cuando nos envía un mensaje (nombre, email, teléfono)</li>
                <li>Información del negocio si solicita ser incluido en el directorio</li>
                <li>Comentarios y sugerencias que nos comparte</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Información recopilada automáticamente:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Dirección IP y ubicación aproximada</li>
                <li>Tipo de navegador y dispositivo</li>
                <li>Páginas visitadas y tiempo de navegación</li>
                <li>Fuente de referencia (cómo llegó a nuestro sitio)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Cómo Usamos su Información</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Proporcionar y mantener nuestro servicio de directorio</li>
                <li>Responder a sus consultas y solicitudes</li>
                <li>Mejorar la funcionalidad y experiencia del sitio web</li>
                <li>Enviar actualizaciones importantes sobre el servicio</li>
                <li>Analizar el uso del sitio para mejoras futuras</li>
                <li>Prevenir fraude y garantizar la seguridad del sitio</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartir Información</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en las siguientes circunstancias:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li><strong>Con su consentimiento:</strong> Cuando usted nos autoriza expresamente</li>
                <li><strong>Proveedores de servicios:</strong> Con empresas que nos ayudan a operar el sitio (hosting, analytics)</li>
                <li><strong>Cumplimiento legal:</strong> Cuando sea requerido por ley o autoridades competentes</li>
                <li><strong>Protección de derechos:</strong> Para proteger nuestros derechos, propiedad o seguridad</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies y Tecnologías Similares</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Utilizamos cookies y tecnologías similares para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mb-4">
                <li>Recordar sus preferencias de navegación</li>
                <li>Analizar el tráfico y uso del sitio web</li>
                <li>Mejorar la funcionalidad del sitio</li>
                <li>Proporcionar contenido personalizado</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seguridad de los Datos</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Cifrado SSL/TLS para todas las transmisiones de datos</li>
                <li>Acceso restringido a la información personal</li>
                <li>Monitoreo regular de vulnerabilidades de seguridad</li>
                <li>Copias de seguridad regulares de los datos</li>
                <li>Políticas internas de manejo de datos</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Sus Derechos</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                De acuerdo con la Ley 1581 de 2012 de Colombia, usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li><strong>Acceso:</strong> Conocer qué información tenemos sobre usted</li>
                <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
                <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos</li>
                <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos</li>
                <li><strong>Portabilidad:</strong> Obtener una copia de sus datos en formato estructurado</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retención de Datos</h2>
              <p className="text-gray-600 leading-relaxed">
                Conservamos su información personal solo durante el tiempo necesario para cumplir con los 
                propósitos descritos en esta política, a menos que la ley requiera o permita un período 
                de retención más largo. Los datos de contacto se conservan mientras mantenga una relación 
                activa con nosotros o según lo requiera la ley.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Menores de Edad</h2>
              <p className="text-gray-600 leading-relaxed">
                Nuestro sitio web no está dirigido a menores de 18 años. No recopilamos conscientemente 
                información personal de menores de edad. Si descubrimos que hemos recopilado información 
                de un menor, la eliminaremos inmediatamente.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cambios a esta Política</h2>
              <p className="text-gray-600 leading-relaxed">
                Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos sobre 
                cambios significativos publicando la nueva política en nuestro sitio web y actualizando 
                la fecha de "última actualización". Su uso continuado del sitio después de dichos cambios 
                constituye su aceptación de la nueva política.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contacto</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Si tiene preguntas sobre esta política de privacidad o desea ejercer sus derechos, 
                puede contactarnos:
              </p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  <strong>Email:</strong> privacidad@patinetaelectrica.com.co<br />
                  <strong>WhatsApp:</strong> +57 300 123 4567<br />
                  <strong>Dirección:</strong> Bogotá, Colombia
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500">
                Esta política de privacidad cumple con la Ley 1581 de 2012 de Protección de Datos Personales 
                de Colombia y el Decreto 1377 de 2013.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
