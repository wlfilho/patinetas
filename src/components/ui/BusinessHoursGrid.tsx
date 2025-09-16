'use client'

interface TimeSlot {
  opening: string
  closing: string
}

interface DaySchedule {
  isOpen: boolean
  timeSlots: TimeSlot[]
}

interface WeeklySchedule {
  lunes: DaySchedule
  martes: DaySchedule
  miercoles: DaySchedule
  jueves: DaySchedule
  viernes: DaySchedule
  sabado: DaySchedule
  domingo: DaySchedule
}

interface BusinessHoursGridProps {
  hoursData: string | null | undefined
  className?: string
}

const DAYS_ES = [
  { key: 'lunes', label: 'Lunes', short: 'L' },
  { key: 'martes', label: 'Martes', short: 'M' },
  { key: 'miercoles', label: 'Miércoles', short: 'X' },
  { key: 'jueves', label: 'Jueves', short: 'J' },
  { key: 'viernes', label: 'Viernes', short: 'V' },
  { key: 'sabado', label: 'Sábado', short: 'S' },
  { key: 'domingo', label: 'Domingo', short: 'D' }
] as const

function formatTime(time: string): string {
  return time
}

function formatTimeSlots(timeSlots: TimeSlot[]): string {
  return timeSlots
    .map(slot => `${formatTime(slot.opening)}-${formatTime(slot.closing)}`)
    .join(', ')
}

export default function BusinessHoursGrid({ hoursData, className = '' }: BusinessHoursGridProps) {
  if (!hoursData) {
    return (
      <div className={`text-gray-600 ${className}`}>
        Horarios no especificados
      </div>
    )
  }

  let schedule: WeeklySchedule | null = null
  let isLegacyFormat = false

  try {
    // Try to parse as JSON (new format)
    schedule = JSON.parse(hoursData)
  } catch {
    // Fallback to legacy text format
    isLegacyFormat = true
  }

  // If legacy format, display as simple text
  if (isLegacyFormat) {
    return (
      <div className={`text-gray-600 whitespace-pre-line ${className}`}>
        {hoursData}
      </div>
    )
  }

  // If no valid schedule, show fallback
  if (!schedule) {
    return (
      <div className={`text-gray-600 ${className}`}>
        Horarios no especificados
      </div>
    )
  }

  return (
    <div className={`space-y-2 max-w-xs pr-6 ${className}`}>
      {DAYS_ES.map(({ key, label }) => {
        const daySchedule = schedule![key as keyof WeeklySchedule]
        const isOpen = daySchedule?.isOpen && daySchedule.timeSlots.length > 0

        return (
          <div key={key} className="flex items-center py-1">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900 w-20 sm:w-22">
                {label}
              </span>
            </div>
            <div className="text-sm text-gray-600 ml-4">
              {isOpen ? (
                <span className="font-medium">
                  {formatTimeSlots(daySchedule.timeSlots)}
                </span>
              ) : (
                <span className="text-gray-400 italic">
                  Cerrado
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
