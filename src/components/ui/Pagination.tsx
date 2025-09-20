'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
  generatePaginationUrl: (page: number) => string
  className?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  generatePaginationUrl,
  className = ''
}: PaginationProps) {
  const router = useRouter()
  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) return null

  // Don't render if generatePaginationUrl is not available yet
  if (!generatePaginationUrl || typeof generatePaginationUrl !== 'function') {
    return null
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 7

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 4) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push('...')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className={`flex items-center justify-center space-x-1 ${className}`} aria-label="Pagination">
      {/* Previous Button */}
      {currentPage === 1 ? (
        <span
          className="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-300 cursor-not-allowed bg-gray-50"
          aria-label="Página anterior"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="ml-1 hidden sm:inline">Anterior</span>
        </span>
      ) : (
        <button
          onClick={() => router.push(generatePaginationUrl(currentPage - 1))}
          className="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-500 bg-white hover:bg-gray-50 hover:text-primary border border-gray-300 transition-colors duration-200"
          aria-label="Página anterior"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="ml-1 hidden sm:inline">Anterior</span>
        </button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sm text-gray-500"
              >
                ...
              </span>
            )
          }

          const pageNumber = page as number
          const isCurrentPage = pageNumber === currentPage

          return isCurrentPage ? (
            <span
              key={pageNumber}
              className="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-primary text-white shadow-sm"
              aria-label={`Página ${pageNumber}`}
              aria-current="page"
            >
              {pageNumber}
            </span>
          ) : (
            <button
              key={pageNumber}
              onClick={() => router.push(generatePaginationUrl(pageNumber))}
              className="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-500 bg-white hover:bg-gray-50 hover:text-primary border border-gray-300 transition-colors duration-200"
              aria-label={`Página ${pageNumber}`}
            >
              {pageNumber}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      {currentPage === totalPages ? (
        <span
          className="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-300 cursor-not-allowed bg-gray-50"
          aria-label="Página siguiente"
        >
          <span className="mr-1 hidden sm:inline">Siguiente</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      ) : (
        <button
          onClick={() => router.push(generatePaginationUrl(currentPage + 1))}
          className="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-500 bg-white hover:bg-gray-50 hover:text-primary border border-gray-300 transition-colors duration-200"
          aria-label="Página siguiente"
        >
          <span className="mr-1 hidden sm:inline">Siguiente</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  )
}
