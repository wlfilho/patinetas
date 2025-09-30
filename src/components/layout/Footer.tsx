import Link from 'next/link'

const footerNavigation = {
  directorio: [
    { name: 'Todas las Categorías', href: '/categorias' },
    { name: 'Venta de Patinetas', href: '/venta-patinetas-electricas' },
    { name: 'Reparación', href: '/reparacion-mantenimiento' },
    { name: 'Repuestos', href: '/repuestos-accesorios' },
    { name: 'Alquiler', href: '/alquiler-patinetas' },
  ],
  ciudades: [
    { name: 'Bogotá', href: '/ciudades/bogota' },
    { name: 'Medellín', href: '/ciudades/medellin' },
    { name: 'Cali', href: '/ciudades/cali' },
    { name: 'Barranquilla', href: '/ciudades/barranquilla' },
    { name: 'Cartagena', href: '/ciudades/cartagena' },
  ],
  empresa: [
    { name: 'Acerca de Nosotros', href: '/acerca' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Agregar Negocio', href: '/agregar-negocio' },
    { name: 'Términos de Uso', href: '/terminos' },
    { name: 'Política de Privacidad', href: '/privacidad' },
  ],
  soporte: [
    { name: 'Centro de Ayuda', href: '/ayuda' },
    { name: 'Preguntas Frecuentes', href: '/faq' },
    { name: 'Guía de Uso', href: '/guia' },
    { name: 'Reportar Problema', href: '/reportar' },
  ],
}

const socialLinks = [
  {
    name: 'Facebook',
    href: '#',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12.017 0C8.396 0 7.929.01 6.71.048 5.493.087 4.73.222 4.058.42a5.916 5.916 0 00-2.134 1.384A5.916 5.916 0 00.42 4.058C.222 4.73.087 5.493.048 6.71.01 7.929 0 8.396 0 12.017s.01 4.087.048 5.306c.039 1.217.174 1.98.372 2.652a5.916 5.916 0 001.384 2.134 5.916 5.916 0 002.134 1.384c.672.198 1.435.333 2.652.372 1.219.038 1.686.048 5.306.048s4.087-.01 5.306-.048c1.217-.039 1.98-.174 2.652-.372a5.916 5.916 0 002.134-1.384 5.916 5.916 0 001.384-2.134c.198-.672.333-1.435.372-2.652.038-1.219.048-1.686.048-5.306s-.01-4.087-.048-5.306c-.039-1.217-.174-1.98-.372-2.652A5.916 5.916 0 0019.638.42C18.966.222 18.203.087 16.986.048 15.767.01 15.3 0 11.983 0h.034zm-.717 1.442h.718c3.136 0 3.513.01 4.754.048 1.147.052 1.77.244 2.187.405.55.214.943.47 1.356.883.413.413.669.806.883 1.356.161.417.353 1.04.405 2.187.038 1.241.048 1.618.048 4.754s-.01 3.513-.048 4.754c-.052 1.147-.244 1.77-.405 2.187-.214.55-.47.943-.883 1.356-.413.413-.806.669-1.356.883-.417.161-1.04.353-2.187.405-1.241.038-1.618.048-4.754.048s-3.513-.01-4.754-.048c-1.147-.052-1.77-.244-2.187-.405a3.65 3.65 0 01-1.356-.883 3.65 3.65 0 01-.883-1.356c-.161-.417-.353-1.04-.405-2.187-.038-1.241-.048-1.618-.048-4.754s.01-3.513.048-4.754c.052-1.147.244-1.77.405-2.187.214-.55.47-.943.883-1.356a3.65 3.65 0 011.356-.883c.417-.161 1.04-.353 2.187-.405 1.086-.049 1.506-.063 3.996-.066v.069zm7.944 1.42a1.134 1.134 0 11-2.268 0 1.134 1.134 0 012.268 0zm-5.944 1.931a4.73 4.73 0 100 9.46 4.73 4.73 0 000-9.46zm0 1.441a3.288 3.288 0 110 6.577 3.288 3.288 0 010-6.577z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: '#',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: '#',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary">
                <span className="text-white font-bold text-lg">🛴</span>
              </div>
              <span className="text-xl font-bold text-white">
                Patinetas<span className="text-primary">Eléctricas</span>
              </span>
            </div>
            <p className="text-sm leading-6 text-gray-300">
              El directorio más completo de patinetas eléctricas en Colombia. 
              Encuentra tiendas, servicios técnicos, repuestos y todo lo que necesitas 
              para tu movilidad eléctrica.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Directorio</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.directorio.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Ciudades</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.ciudades.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Empresa</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.empresa.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Soporte</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.soporte.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <p className="text-xs leading-5 text-gray-400">
              &copy; 2024 Patinetas Eléctricas Colombia. Todos los derechos reservados.
            </p>
            <p className="mt-4 text-xs leading-5 text-gray-400 sm:mt-0">
              Hecho con ❤️ para la movilidad eléctrica en Colombia
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
