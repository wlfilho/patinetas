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

const DAYS_ES = [
  { key: 'lunes', label: 'Lunes', short: 'L' },
  { key: 'martes', label: 'Martes', short: 'M' },
  { key: 'miercoles', label: 'Miércoles', short: 'X' },
  { key: 'jueves', label: 'Jueves', short: 'J' },
  { key: 'viernes', label: 'Viernes', short: 'V' },
  { key: 'sabado', label: 'Sábado', short: 'S' },
  { key: 'domingo', label: 'Domingo', short: 'D' }
] as const

/**
 * Formats business hours for public display
 * Supports both new JSON format and legacy text format
 */
export function formatBusinessHours(hoursData: string | null | undefined): string {
  if (!hoursData) return 'Horarios no especificados'

  try {
    // Try to parse as JSON (new format)
    const schedule: WeeklySchedule = JSON.parse(hoursData)
    return formatStructuredSchedule(schedule)
  } catch {
    // Fallback to legacy text format
    return hoursData
  }
}

/**
 * Formats structured schedule data into readable text
 */
function formatStructuredSchedule(schedule: WeeklySchedule): string {
  const openDays: string[] = []
  const closedDays: string[] = []

  DAYS_ES.forEach(({ key, label }) => {
    const daySchedule = schedule[key as keyof WeeklySchedule]
    
    if (daySchedule?.isOpen && daySchedule.timeSlots.length > 0) {
      const timeSlots = daySchedule.timeSlots
        .map(slot => `${formatTime(slot.opening)}-${formatTime(slot.closing)}`)
        .join(', ')
      openDays.push(`${label}: ${timeSlots}`)
    } else {
      closedDays.push(label)
    }
  })

  let result = ''
  
  if (openDays.length > 0) {
    result = openDays.join('\n')
  }
  
  if (closedDays.length > 0) {
    if (result) result += '\n'
    result += `Cerrado: ${closedDays.join(', ')}`
  }

  return result || 'Horarios no especificados'
}

/**
 * Formats time from 24h format to 12h format (optional)
 */
function formatTime(time: string): string {
  // For now, keep 24h format as it's common in Colombia
  // Can be modified to use 12h format if needed
  return time
}

/**
 * Gets current day status and next opening time
 */
export function getCurrentDayStatus(hoursData: string | null | undefined): {
  isOpenNow: boolean
  currentDayHours: string
  nextOpeningTime: string | null
} {
  if (!hoursData) {
    return {
      isOpenNow: false,
      currentDayHours: 'Horarios no especificados',
      nextOpeningTime: null
    }
  }

  try {
    const schedule: WeeklySchedule = JSON.parse(hoursData)
    const now = new Date()
    const currentDay = getCurrentDayKey(now.getDay())
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    const todaySchedule = schedule[currentDay]
    
    if (!todaySchedule?.isOpen) {
      return {
        isOpenNow: false,
        currentDayHours: 'Cerrado hoy',
        nextOpeningTime: findNextOpeningTime(schedule, now)
      }
    }

    // Check if currently within any time slot
    const isOpenNow = todaySchedule.timeSlots.some(slot => 
      currentTime >= slot.opening && currentTime <= slot.closing
    )

    const timeSlots = todaySchedule.timeSlots
      .map(slot => `${formatTime(slot.opening)}-${formatTime(slot.closing)}`)
      .join(', ')

    return {
      isOpenNow,
      currentDayHours: timeSlots,
      nextOpeningTime: isOpenNow ? null : findNextOpeningTime(schedule, now)
    }
  } catch {
    return {
      isOpenNow: false,
      currentDayHours: hoursData,
      nextOpeningTime: null
    }
  }
}

/**
 * Gets the day key for the current day of week
 */
function getCurrentDayKey(dayOfWeek: number): keyof WeeklySchedule {
  // JavaScript: Sunday = 0, Monday = 1, etc.
  // Our format: Monday = lunes, Sunday = domingo
  const dayMap = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
  return dayMap[dayOfWeek] as keyof WeeklySchedule
}

/**
 * Finds the next opening time from the current moment
 */
function findNextOpeningTime(schedule: WeeklySchedule, currentDate: Date): string | null {
  const currentDay = getCurrentDayKey(currentDate.getDay())
  const currentTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`

  // Check remaining time slots today
  const todaySchedule = schedule[currentDay]
  if (todaySchedule?.isOpen) {
    const nextSlotToday = todaySchedule.timeSlots.find(slot => slot.opening > currentTime)
    if (nextSlotToday) {
      return `Hoy a las ${formatTime(nextSlotToday.opening)}`
    }
  }

  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(currentDate)
    nextDate.setDate(nextDate.getDate() + i)
    const nextDayKey = getCurrentDayKey(nextDate.getDay())
    const nextDaySchedule = schedule[nextDayKey]

    if (nextDaySchedule?.isOpen && nextDaySchedule.timeSlots.length > 0) {
      const dayLabel = DAYS_ES.find(d => d.key === nextDayKey)?.label || nextDayKey
      const firstSlot = nextDaySchedule.timeSlots[0]
      return `${dayLabel} a las ${formatTime(firstSlot.opening)}`
    }
  }

  return null
}

/**
 * Validates that opening time is before closing time
 */
export function validateTimeSlot(opening: string, closing: string): boolean {
  return opening < closing
}

/**
 * Converts legacy text format to structured format (best effort)
 */
export function migrateLegacyFormat(legacyText: string): WeeklySchedule {
  const defaultSchedule: WeeklySchedule = {
    lunes: { isOpen: false, timeSlots: [{ opening: '09:00', closing: '18:00' }] },
    martes: { isOpen: false, timeSlots: [{ opening: '09:00', closing: '18:00' }] },
    miercoles: { isOpen: false, timeSlots: [{ opening: '09:00', closing: '18:00' }] },
    jueves: { isOpen: false, timeSlots: [{ opening: '09:00', closing: '18:00' }] },
    viernes: { isOpen: false, timeSlots: [{ opening: '09:00', closing: '18:00' }] },
    sabado: { isOpen: false, timeSlots: [{ opening: '09:00', closing: '17:00' }] },
    domingo: { isOpen: false, timeSlots: [{ opening: '10:00', closing: '16:00' }] }
  }

  // Basic heuristics for common patterns
  const text = legacyText.toLowerCase()
  
  // If contains time patterns, assume weekdays are open
  if (text.match(/\d{1,2}:\d{2}/) || text.includes('lunes') || text.includes('monday')) {
    const weekdays = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'] as const
    weekdays.forEach(day => {
      defaultSchedule[day].isOpen = true
    })
  }

  // If mentions weekend days, mark them as open
  if (text.includes('sábado') || text.includes('sabado') || text.includes('saturday')) {
    defaultSchedule.sabado.isOpen = true
  }
  
  if (text.includes('domingo') || text.includes('sunday')) {
    defaultSchedule.domingo.isOpen = true
  }

  return defaultSchedule
}
