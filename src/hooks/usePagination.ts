'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

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
}

export function usePagination({
  defaultItemsPerPage = 10,
  defaultPage = 1
}: UsePaginationProps = {}): UsePaginationReturn {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state directly from URL parameters
  const pageParam = searchParams.get('page')
  const perPageParam = searchParams.get('per_page')

  const initialPage = pageParam ? Math.max(1, parseInt(pageParam, 10)) : defaultPage
  const initialItemsPerPage = perPageParam && [10, 25, 50, 100].includes(parseInt(perPageParam, 10))
    ? parseInt(perPageParam, 10)
    : defaultItemsPerPage



  const [currentPage, setCurrentPageState] = useState(initialPage)
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage)

  // Sync with URL parameter changes
  useEffect(() => {
    const pageParam = searchParams.get('page')
    const perPageParam = searchParams.get('per_page')

    const newPage = pageParam ? Math.max(1, parseInt(pageParam, 10)) : defaultPage
    const newItemsPerPage = perPageParam && [10, 25, 50, 100].includes(parseInt(perPageParam, 10))
      ? parseInt(perPageParam, 10)
      : defaultItemsPerPage

    if (newPage !== currentPage) {
      setCurrentPageState(newPage)
    }

    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPageState(newItemsPerPage)
    }
  }, [searchParams, defaultPage, defaultItemsPerPage, currentPage, itemsPerPage])

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
    updateUrlParams({ page: page > 1 ? page : null })
  }, [updateUrlParams])

  // Set items per page and update URL
  const setItemsPerPage = useCallback((items: number) => {
    setItemsPerPageState(items)
    setCurrentPageState(1) // Reset to first page when changing items per page
    updateUrlParams({ 
      per_page: items !== defaultItemsPerPage ? items : null,
      page: null // Reset page to 1
    })
  }, [updateUrlParams, defaultItemsPerPage])

  // Reset pagination to defaults
  const resetPagination = useCallback(() => {
    setCurrentPageState(defaultPage)
    setItemsPerPageState(defaultItemsPerPage)
    updateUrlParams({ page: null, per_page: null })
  }, [updateUrlParams, defaultPage, defaultItemsPerPage])

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    resetPagination,
    updateUrlParams
  }
}
