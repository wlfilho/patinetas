// Especialidades predefinidas para negocios de patinetas eléctricas
export const ESPECIALIDADES_NEGOCIO = [
  {
    id: 'venta-patinetas-electricas',
    nombre: 'Venta de Patinetas Eléctricas',
    descripcion: 'Venta de patinetas nuevas y usadas',
    icono: '🛴'
  },
  {
    id: 'venta-accesorios',
    nombre: 'Venta de Accesorios para Patinetas',
    descripcion: 'Cascos, guantes, luces, soportes, mochilas, etc.',
    icono: '🎒'
  },
  {
    id: 'venta-repuestos',
    nombre: 'Venta de Repuestos y Piezas',
    descripcion: 'Baterías, neumáticos, frenos, motores, cargadores, etc.',
    icono: '🔧'
  },
  {
    id: 'taller-reparacion',
    nombre: 'Taller de Reparación y Mantenimiento',
    descripcion: 'Cambio de piezas, mantenimiento general, revisión eléctrica/mecánica',
    icono: '🔨'
  },
  {
    id: 'lavado-limpieza',
    nombre: 'Lavado y Limpieza de Patinetas',
    descripcion: 'Servicio especializado de lavado',
    icono: '🧽'
  },
  {
    id: 'personalizacion',
    nombre: 'Personalización y Modificación',
    descripcion: 'Personalización de color, calcomanías, mejora de componentes',
    icono: '🎨'
  },
  {
    id: 'alquiler',
    nombre: 'Alquiler de Patinetas Eléctricas',
    descripcion: 'Alquiler por hora, día, semana',
    icono: '⏰'
  },
  {
    id: 'diagnostico-tecnico',
    nombre: 'Diagnóstico Técnico',
    descripcion: 'Evaluación del estado del vehículo, pruebas de batería, etc.',
    icono: '🔍'
  },
  {
    id: 'servicio-recogida',
    nombre: 'Servicio de Recogida y Entrega',
    descripcion: 'Recoger y entregar patinetas para mantenimiento o reparación',
    icono: '🚚'
  },
  {
    id: 'asesoria-compra',
    nombre: 'Asesoría para Compra y Uso',
    descripcion: 'Consultoría personalizada en la elección de la patineta ideal',
    icono: '💡'
  },
  {
    id: 'seguro-patinetas',
    nombre: 'Seguro para Patinetas',
    descripcion: 'Alianza para ofrecer seguros contra robo/daños',
    icono: '🛡️'
  },
  {
    id: 'equipos-seguridad',
    nombre: 'Venta de Equipos de Seguridad',
    descripcion: 'Cascos, rodilleras, coderas, luces, reflectores',
    icono: '🦺'
  },
  {
    id: 'financiacion',
    nombre: 'Financiación y Métodos de Pago',
    descripcion: 'Cuotas, financiamientos, pagos digitales',
    icono: '💳'
  },
  {
    id: 'tienda-online',
    nombre: 'Tienda Online',
    descripcion: 'Venta y atención 100% digital, envío a todo el país',
    icono: '🌐'
  },
  {
    id: 'atencion-domicilio',
    nombre: 'Atención Técnica a Domicilio',
    descripcion: 'Reparación o revisión directamente en casa del cliente',
    icono: '🏠'
  },
  {
    id: 'capacitacion-cursos',
    nombre: 'Capacitación y Cursos',
    descripcion: 'Clases de uso seguro, mantenimiento básico, consejos de manejo',
    icono: '📚'
  },
  {
    id: 'venta-empresas',
    nombre: 'Venta de Patinetas para Empresas/Flotas',
    descripcion: 'Venta y mantenimiento para empresas de delivery, turismo, etc.',
    icono: '🏢'
  },
  {
    id: 'recarga-baterias',
    nombre: 'Recarga de Baterías',
    descripcion: 'Puntos de recarga rápida o alquiler de baterías',
    icono: '🔋'
  },
  {
    id: 'test-drive',
    nombre: 'Test Drive / Prueba de Patinetas',
    descripcion: 'Permite que el cliente pruebe antes de comprar',
    icono: '🚀'
  }
] as const

export type EspecialidadId = typeof ESPECIALIDADES_NEGOCIO[number]['id']
export type Especialidad = typeof ESPECIALIDADES_NEGOCIO[number]
