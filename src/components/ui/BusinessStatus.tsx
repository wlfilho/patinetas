'use client'

import { useEffect, useState } from 'react'
import { getCurrentDayStatus } from '@/utils/businessHours'

interface BusinessStatusProps {
  hoursData: string | null | undefined
  className?: string
}

export default function BusinessStatus({ hoursData, className = '' }: BusinessStatusProps) {
  const [status, setStatus] = useState<{
    isOpenNow: boolean
    currentDayHours: string
    nextOpeningTime: string | null
  } | null>(null)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const updateStatus = () => {
      const currentStatus = getCurrentDayStatus(hoursData)
      setStatus(currentStatus)
    }

    // Update immediately
    updateStatus()

    // Update every minute to keep status current
    const interval = setInterval(updateStatus, 60000)

    return () => clearInterval(interval)
  }, [hoursData])

  // Show loading state while mounting to prevent layout shift
  if (!mounted) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-black/10 text-white/60 border border-white/20">
          <div className="w-1.5 h-1.5 rounded-full mr-1.5 bg-gray-400 animate-pulse" />
          <span className="animate-pulse">Verificando...</span>
        </div>
      </div>
    )
  }

  if (!status) {
    return null
  }

  const { isOpenNow, nextOpeningTime } = status

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      {/* Status Badge - Subtle Design */}
      <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
        isOpenNow
          ? 'bg-green-50 text-green-700 border border-green-100'
          : 'bg-black/10 text-white/70 border border-white/20'
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          isOpenNow ? 'bg-green-500' : 'bg-red-500'
        }`} />
        {isOpenNow ? 'Abierto' : 'Cerrado'}
      </div>

      {/* Next Opening Time - Matching Style */}
      {!isOpenNow && nextOpeningTime && (
        <div className="text-xs text-white/70 bg-black/10 border border-white/20 px-2 py-1 rounded-md">
          Abre {nextOpeningTime}
        </div>
      )}
    </div>
  )
}
