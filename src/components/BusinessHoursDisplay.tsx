'use client'

import { Clock, CheckCircle, XCircle } from 'lucide-react'
import { formatBusinessHours, getCurrentDayStatus } from '@/utils/businessHours'

interface BusinessHoursDisplayProps {
  hoursData: string | null | undefined
  showCurrentStatus?: boolean
  compact?: boolean
  className?: string
}

export default function BusinessHoursDisplay({ 
  hoursData, 
  showCurrentStatus = true, 
  compact = false,
  className = '' 
}: BusinessHoursDisplayProps) {
  const formattedHours = formatBusinessHours(hoursData)
  const currentStatus = showCurrentStatus ? getCurrentDayStatus(hoursData) : null

  if (!hoursData || formattedHours === 'Horarios no especificados') {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <Clock className="h-4 w-4" />
        <span className="text-sm">Horarios no especificados</span>
      </div>
    )
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Clock className="h-4 w-4 text-gray-600" />
        {currentStatus && (
          <div className="flex items-center gap-1">
            {currentStatus.isOpenNow ? (
              <CheckCircle className="h-3 w-3 text-green-600" />
            ) : (
              <XCircle className="h-3 w-3 text-red-600" />
            )}
            <span className={`text-xs font-medium ${
              currentStatus.isOpenNow ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentStatus.isOpenNow ? 'Abierto' : 'Cerrado'}
            </span>
          </div>
        )}
        <span className="text-sm text-gray-600">
          {currentStatus?.currentDayHours || 'Ver horarios'}
        </span>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Current status */}
      {currentStatus && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Estado Actual</span>
          </div>
          
          <div className="flex items-center gap-2">
            {currentStatus.isOpenNow ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">Abierto ahora</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-600 font-medium">Cerrado ahora</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Today's hours */}
      {currentStatus && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Hoy: </span>
          {currentStatus.currentDayHours}
        </div>
      )}

      {/* Next opening time */}
      {currentStatus && !currentStatus.isOpenNow && currentStatus.nextOpeningTime && (
        <div className="text-sm text-blue-600">
          <span className="font-medium">Próxima apertura: </span>
          {currentStatus.nextOpeningTime}
        </div>
      )}

      {/* Full schedule */}
      <div className="bg-gray-50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Horarios Completos</h4>
        <div className="text-sm text-gray-600 whitespace-pre-line">
          {formattedHours}
        </div>
      </div>
    </div>
  )
}

// Simplified version for cards and listings
export function BusinessHoursCompact({ hoursData, className = '' }: { 
  hoursData: string | null | undefined
  className?: string 
}) {
  return (
    <BusinessHoursDisplay 
      hoursData={hoursData} 
      showCurrentStatus={true} 
      compact={true} 
      className={className}
    />
  )
}

// Status badge component
export function BusinessStatusBadge({ hoursData, className = '' }: { 
  hoursData: string | null | undefined
  className?: string 
}) {
  const currentStatus = getCurrentDayStatus(hoursData)

  if (!currentStatus) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 ${className}`}>
        <Clock className="h-3 w-3" />
        Sin horarios
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
      currentStatus.isOpenNow 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    } ${className}`}>
      {currentStatus.isOpenNow ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}
      {currentStatus.isOpenNow ? 'Abierto' : 'Cerrado'}
    </span>
  )
}
