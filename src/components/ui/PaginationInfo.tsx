'use client'

interface PaginationInfoProps {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  className?: string
}

export default function PaginationInfo({
  currentPage,
  itemsPerPage,
  totalItems,
  className = ''
}: PaginationInfoProps) {
  if (totalItems === 0) {
    return (
      <p className={`text-sm text-gray-600 ${className}`}>
        No se encontraron resultados
      </p>
    )
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <p className={`text-sm text-gray-600 ${className}`}>
      Mostrando <span className="font-medium text-gray-900">{startItem}</span> a{' '}
      <span className="font-medium text-gray-900">{endItem}</span> de{' '}
      <span className="font-medium text-gray-900">{totalItems}</span> negocios
    </p>
  )
}
