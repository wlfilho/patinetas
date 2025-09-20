'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface UsePaginationProps {
  defaultItemsPerPage?: number
  defaultPage?: number
}

interface UsePaginationReturn {
  currentPage: number
  itemsPerPage: number
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
  resetPagination: () => void
  updateUrlParams: (params: Record<string, string | number | null>) => void
  generatePaginationUrl: (page: number, otherParams?: Record<string, string | number | null>) => string
}

export function usePagination({
  defaultItemsPerPage = 10,
  defaultPage = 1
}: UsePaginationProps = {}): UsePaginationReturn {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Extract page from SEO-friendly URL path or query parameters (for backward compatibility)
  const getPageFromUrl = useCallback(() => {
    // Check for SEO-friendly URL pattern: /directorio/p/[page]
    const pathMatch = pathname.match(/\/directorio\/p\/(\d+)/)
    if (pathMatch) {
      return Math.max(1, parseInt(pathMatch[1], 10))
    }

    // Fallback to query parameter for backward compatibility
    const pageParam = searchParams.get('page')
    if (pageParam) {
      return Math.max(1, parseInt(pageParam, 10))
    }

    return defaultPage
  }, [pathname, searchParams, defaultPage])

  const perPageParam = searchParams.get('per_page')
  const initialPage = getPageFromUrl()
  const initialItemsPerPage = perPageParam && [10, 25, 50, 100].includes(parseInt(perPageParam, 10))
    ? parseInt(perPageParam, 10)
    : defaultItemsPerPage



  const [currentPage, setCurrentPageState] = useState(initialPage)
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage)

  // Sync with URL changes (both pathname and search params)
  useEffect(() => {
    const newPage = getPageFromUrl()
    const perPageParam = searchParams.get('per_page')

    const newItemsPerPage = perPageParam && [10, 25, 50, 100].includes(parseInt(perPageParam, 10))
      ? parseInt(perPageParam, 10)
      : defaultItemsPerPage

    console.log('🔄 usePagination URL sync:', {
      pathname,
      currentPage,
      newPage,
      shouldUpdate: newPage !== currentPage
    })

    if (newPage !== currentPage) {
      console.log('📝 Updating currentPage from', currentPage, 'to', newPage)
      setCurrentPageState(newPage)
    }

    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPageState(newItemsPerPage)
    }
  }, [pathname, searchParams, defaultPage, defaultItemsPerPage, currentPage, itemsPerPage, getPageFromUrl])

  // Generate SEO-friendly URL for pagination
  const generatePaginationUrl = useCallback((page: number, otherParams?: Record<string, string | number | null>) => {
    let basePath = '/directorio'

    // Add pagination path for pages > 1
    if (page > 1) {
      basePath = `/directorio/p/${page}`
    }

    // Handle other query parameters (like per_page, filters, etc.)
    const current = new URLSearchParams(Array.from(searchParams.entries()))

    // Remove page parameter since it's now in the path
    current.delete('page')

    // Add other parameters if provided
    if (otherParams) {
      Object.entries(otherParams).forEach(([key, value]) => {
        if (value === null || value === '' || value === undefined) {
          current.delete(key)
        } else {
          current.set(key, String(value))
        }
      })
    }

    const search = current.toString()
    const query = search ? `?${search}` : ''

    return `${basePath}${query}`
  }, [searchParams])

  // Update URL parameters
  const updateUrlParams = useCallback((params: Record<string, string | number | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === '' || value === undefined) {
        current.delete(key)
      } else {
        current.set(key, String(value))
      }
    })

    const search = current.toString()
    const query = search ? `?${search}` : ''

    // Use replace instead of push to avoid adding to browser history for every page change
    // and ensure scroll: false is respected
    router.replace(`${window.location.pathname}${query}`, { scroll: false })
  }, [router, searchParams])

  // Set current page and update URL
  const setCurrentPage = useCallback((page: number) => {
    setCurrentPageState(page)
    const newUrl = generatePaginationUrl(page)
    router.replace(newUrl, { scroll: false })
  }, [generatePaginationUrl, router])

  // Set items per page and update URL
  const setItemsPerPage = useCallback((items: number) => {
    setItemsPerPageState(items)
    setCurrentPageState(1) // Reset to first page when changing items per page
    const newUrl = generatePaginationUrl(1, {
      per_page: items !== defaultItemsPerPage ? items : null
    })
    router.replace(newUrl, { scroll: false })
  }, [generatePaginationUrl, router, defaultItemsPerPage])

  // Reset pagination to defaults
  const resetPagination = useCallback(() => {
    setCurrentPageState(defaultPage)
    setItemsPerPageState(defaultItemsPerPage)
    const newUrl = generatePaginationUrl(defaultPage)
    router.replace(newUrl, { scroll: false })
  }, [generatePaginationUrl, router, defaultPage, defaultItemsPerPage])

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    resetPagination,
    updateUrlParams,
    generatePaginationUrl
  }
}
