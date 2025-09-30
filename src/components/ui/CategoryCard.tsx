import Link from 'next/link'
import { getCategoryIcon } from '@/lib/utils'

interface CategoryCardProps {
  name: string
  description: string
  count: number
  slug: string
  featured?: boolean
  icon?: string
}

export default function CategoryCard({
  name,
  description,
  count,
  slug,
  featured = false,
  icon
}: CategoryCardProps) {
  const displayIcon = icon || getCategoryIcon(name)

  return (
    <Link
      href={`/${slug}`}
      className={`
        group block p-6 bg-white rounded-xl border border-gray-200 
        hover:border-primary hover:shadow-lg transition-all duration-300
        ${featured ? 'ring-2 ring-primary/20 shadow-md' : 'hover:shadow-md'}
      `}
    >
      <div className="flex items-start space-x-4">
        <div className={`
          flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl
          ${featured 
            ? 'bg-gradient-to-r from-primary to-secondary' 
            : 'bg-gray-100 group-hover:bg-primary/10'
          }
        `}>
          {featured ? (
            <span className="text-white">{displayIcon}</span>
          ) : (
            <span className="group-hover:scale-110 transition-transform">{displayIcon}</span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`
            text-lg font-semibold text-gray-900 group-hover:text-primary 
            transition-colors line-clamp-2
            ${featured ? 'text-primary' : ''}
          `}>
            {name}
          </h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {count} {count === 1 ? 'negocio' : 'negocios'}
            </span>
            <svg 
              className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </div>
        </div>
      </div>
      
      {featured && (
        <div className="mt-4 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full inline-block">
          Destacado
        </div>
      )}
    </Link>
  )
}
