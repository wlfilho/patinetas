// FAQ Types and Data Structure

export interface FAQItem {
  id: string
  question: string
  answer: string
  category?: string
}

export interface FAQSection {
  title: string
  description: string
  items: FAQItem[]
}

// FAQ Data - Questions and Answers in Spanish
export const faqData: FAQItem[] = [
  {
    id: 'como-encontrar-negocios',
    question: '¿Cómo puedo encontrar negocios de patinetas eléctricas cerca de mí?',
    answer: 'Puedes usar nuestro buscador en la página principal para filtrar por ciudad, categoría o tipo de servicio. También puedes navegar por nuestro directorio completo organizizado por ciudades y categorías. Cada negocio incluye información detallada como ubicación, horarios, servicios ofrecidos y datos de contacto.',
    category: 'busqueda'
  },
  {
    id: 'agregar-negocio',
    question: '¿Cómo puedo agregar mi negocio al directorio?',
    answer: 'Es muy fácil agregar tu negocio. Haz clic en el botón "Agregar Mi Negocio" en la página principal o ve directamente a la sección de registro. Necesitarás proporcionar información básica como nombre del negocio, ubicación, categoría, servicios que ofreces y datos de contacto. El registro es completamente gratuito.',
    category: 'negocio'
  },
  {
    id: 'categorias-disponibles',
    question: '¿Qué tipos de negocios puedo encontrar en el directorio?',
    answer: 'Nuestro directorio incluye una amplia variedad de categorías: tiendas de venta de patinetas eléctricas, servicios técnicos y reparación, repuestos y accesorios, alquiler de patinetas, importadores y distribuidores, tiendas multimarca, servicios de delivery, escuelas de conducción y seguros especializados.',
    category: 'categorias'
  },
  {
    id: 'cobertura-geografica',
    question: '¿En qué ciudades de Colombia está disponible el directorio?',
    answer: 'Tenemos cobertura en las principales ciudades de Colombia incluyendo Bogotá, Medellín, Cali, Barranquilla, Cartagena, Bucaramanga, Pereira, Manizales, Ibagué, Santa Marta y muchas más. Constantemente estamos expandiendo nuestra cobertura a nuevas ciudades. Si tu ciudad no aparece, puedes contactarnos para incluirla.',
    category: 'cobertura'
  },
  {
    id: 'costo-servicio',
    question: '¿Tiene algún costo usar el directorio o agregar mi negocio?',
    answer: 'No, nuestro directorio es completamente gratuito tanto para usuarios que buscan negocios como para empresarios que quieren agregar su negocio. No cobramos comisiones ni tarifas ocultas. Nuestro objetivo es conectar a la comunidad de patinetas eléctricas en Colombia de manera gratuita.',
    category: 'costos'
  },
  {
    id: 'actualizar-informacion',
    question: '¿Cómo puedo actualizar la información de mi negocio?',
    answer: 'Si ya tienes tu negocio registrado, puedes contactarnos a través del formulario de contacto o enviarnos un email con los cambios que necesitas realizar. Estamos trabajando en un panel de administración para que puedas actualizar tu información directamente. Mientras tanto, nuestro equipo te ayudará con cualquier actualización.',
    category: 'negocio'
  },
  {
    id: 'soporte-tecnico',
    question: '¿Ofrecen soporte técnico o asesoría sobre patinetas eléctricas?',
    answer: 'Nuestro directorio conecta usuarios con negocios especializados que ofrecen soporte técnico y asesoría. Puedes encontrar servicios técnicos certificados, talleres de reparación y tiendas con personal experto que te pueden ayudar con mantenimiento, reparaciones y recomendaciones sobre patinetas eléctricas.',
    category: 'soporte'
  },
  {
    id: 'verificacion-negocios',
    question: '¿Cómo verifican que los negocios listados son confiables?',
    answer: 'Realizamos un proceso de verificación básica de la información proporcionada por cada negocio. Además, fomentamos que los usuarios dejen reseñas y calificaciones basadas en su experiencia. Los negocios con mejores calificaciones aparecen destacados en nuestras búsquedas, ayudando a la comunidad a identificar los servicios más confiables.',
    category: 'verificacion'
  }
]

// FAQ Section Configuration
export const faqSection: FAQSection = {
  title: 'Preguntas Frecuentes',
  description: 'Encuentra respuestas a las preguntas más comunes sobre nuestro directorio de patinetas eléctricas',
  items: faqData
}
