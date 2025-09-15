'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Clock, Copy, Calendar, RotateCcw } from 'lucide-react'

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

interface BusinessHoursManagerProps {
  value: string
  onChange: (value: string) => void
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

const DEFAULT_SCHEDULE: WeeklySchedule = {
  lunes: { isOpen: false, timeSlots: [{ opening: '09:00', closing: '18:00' }] },
  martes: { isOpen: false, timeSlots: [{ opening: '09:00', closing: '18:00' }] },
  miercoles: { isOpen: false, timeSlots: [{ opening: '09:00', closing: '18:00' }] },
  jueves: { isOpen: false, timeSlots: [{ opening: '09:00', closing: '18:00' }] },
  viernes: { isOpen: false, timeSlots: [{ opening: '09:00', closing: '18:00' }] },
  sabado: { isOpen: false, timeSlots: [{ opening: '09:00', closing: '17:00' }] },
  domingo: { isOpen: false, timeSlots: [{ opening: '10:00', closing: '16:00' }] }
}

interface PresetSchedule {
  weekdays?: DaySchedule
  weekends?: DaySchedule
  saturday?: DaySchedule
  sunday?: DaySchedule
  all?: DaySchedule
}

const PRESET_TEMPLATES: { name: string; schedule: PresetSchedule }[] = [
  {
    name: 'Lunes-Viernes 9-18',
    schedule: {
      weekdays: { isOpen: true, timeSlots: [{ opening: '09:00', closing: '18:00' }] },
      weekends: { isOpen: false, timeSlots: [{ opening: '09:00', closing: '18:00' }] }
    }
  },
  {
    name: 'Lunes-Sábado 9-17',
    schedule: {
      weekdays: { isOpen: true, timeSlots: [{ opening: '09:00', closing: '17:00' }] },
      saturday: { isOpen: true, timeSlots: [{ opening: '09:00', closing: '17:00' }] },
      sunday: { isOpen: false, timeSlots: [{ opening: '09:00', closing: '17:00' }] }
    }
  },
  {
    name: 'Todos los días 8-20',
    schedule: {
      all: { isOpen: true, timeSlots: [{ opening: '08:00', closing: '20:00' }] }
    }
  }
]

export default function BusinessHoursManager({ value, onChange }: BusinessHoursManagerProps) {
  const [schedule, setSchedule] = useState<WeeklySchedule>(DEFAULT_SCHEDULE)
  const previousValueRef = useRef<string>('')
  const isInitializingRef = useRef<boolean>(false)
  const [copyFromDay, setCopyFromDay] = useState<string>('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  // Define parseSimpleTextFormat first, before using it in useEffect
  const parseSimpleTextFormat = useCallback((text: string) => {
    // Basic parsing for existing simple text formats
    // This is a fallback for backward compatibility
    const newSchedule = { ...DEFAULT_SCHEDULE }

    // Simple heuristic: if it contains time patterns, mark weekdays as open
    if (text.match(/\d{1,2}:\d{2}/)) {
      const weekdays = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'] as const
      weekdays.forEach(day => {
        newSchedule[day].isOpen = true
      })
    }

    setSchedule(newSchedule)
  }, [])

  // Parse existing value on component mount
  useEffect(() => {
    if (value && value !== previousValueRef.current) {
      isInitializingRef.current = true
      previousValueRef.current = value
      try {
        const parsed = JSON.parse(value)
        if (parsed && typeof parsed === 'object') {
          setSchedule({ ...DEFAULT_SCHEDULE, ...parsed })
        }
      } catch {
        // If not JSON, try to parse simple text format
        parseSimpleTextFormat(value)
      }
      // Reset the flag after a short delay to allow state updates to complete
      setTimeout(() => {
        isInitializingRef.current = false
      }, 0)
    }
  }, [value, parseSimpleTextFormat])

  // Convert schedule to JSON string and notify parent
  useEffect(() => {
    // Don't call onChange during initialization
    if (isInitializingRef.current) {
      return
    }

    const jsonValue = JSON.stringify(schedule)
    // Only call onChange if the value has actually changed
    if (jsonValue !== previousValueRef.current) {
      previousValueRef.current = jsonValue
      onChange(jsonValue)
    }
  }, [schedule, onChange])

  const updateDaySchedule = (day: keyof WeeklySchedule, updates: Partial<DaySchedule>) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], ...updates }
    }))
  }

  const updateTimeSlot = (day: keyof WeeklySchedule, slotIndex: number, updates: Partial<TimeSlot>) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, index) =>
          index === slotIndex ? { ...slot, ...updates } : slot
        )
      }
    }))
  }

  const addTimeSlot = (day: keyof WeeklySchedule) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { opening: '14:00', closing: '18:00' }]
      }
    }))
  }

  const removeTimeSlot = (day: keyof WeeklySchedule, slotIndex: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, index) => index !== slotIndex)
      }
    }))
  }

  const copyHoursToSelectedDays = () => {
    if (!copyFromDay || selectedDays.length === 0) return

    const sourceSchedule = schedule[copyFromDay as keyof WeeklySchedule]
    const updates: Partial<WeeklySchedule> = {}

    selectedDays.forEach(day => {
      updates[day as keyof WeeklySchedule] = {
        isOpen: sourceSchedule.isOpen,
        timeSlots: [...sourceSchedule.timeSlots]
      }
    })

    setSchedule(prev => ({ ...prev, ...updates }))
    setSelectedDays([])
    setCopyFromDay('')
  }

  const applyPreset = (preset: { name: string; schedule: PresetSchedule }) => {
    const newSchedule = { ...DEFAULT_SCHEDULE }

    if (preset.schedule.all) {
      DAYS_ES.forEach(({ key }) => {
        newSchedule[key as keyof WeeklySchedule] = { ...preset.schedule.all! }
      })
    } else {
      if (preset.schedule.weekdays) {
        ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].forEach(day => {
          newSchedule[day as keyof WeeklySchedule] = { ...preset.schedule.weekdays! }
        })
      }
      if (preset.schedule.saturday) {
        newSchedule.sabado = { ...preset.schedule.saturday }
      }
      if (preset.schedule.sunday) {
        newSchedule.domingo = { ...preset.schedule.sunday }
      }
      if (preset.schedule.weekends) {
        newSchedule.sabado = { ...preset.schedule.weekends }
        newSchedule.domingo = { ...preset.schedule.weekends }
      }
    }

    setSchedule(newSchedule)
  }

  const resetSchedule = () => {
    setSchedule(DEFAULT_SCHEDULE)
  }

  return (
    <div className="space-y-6">
      {/* Header with presets and reset */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Horarios de Funcionamiento</h3>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_TEMPLATES.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
            >
              {preset.name}
            </button>
          ))}
          <button
            type="button"
            onClick={resetSchedule}
            className="px-3 py-1 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Copy hours section */}
      {(copyFromDay || selectedDays.length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Copy className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Copiar Horarios</span>
            </div>
            
            <select
              value={copyFromDay}
              onChange={(e) => setCopyFromDay(e.target.value)}
              className="px-3 py-1 text-sm border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Copiar desde...</option>
              {DAYS_ES.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2">
              {DAYS_ES.map(({ key, label, short }) => (
                <label key={key} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDays(prev => [...prev, key])
                      } else {
                        setSelectedDays(prev => prev.filter(d => d !== key))
                      }
                    }}
                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{short}</span>
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={copyHoursToSelectedDays}
              disabled={!copyFromDay || selectedDays.length === 0}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* Weekly schedule - compact vertical list */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {DAYS_ES.map(({ key, label }, index) => {
          const daySchedule = schedule[key as keyof WeeklySchedule]

          return (
            <div key={key} className={`${index !== 0 ? 'border-t border-gray-100' : ''}`}>
              <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Day name and toggle */}
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={daySchedule.isOpen}
                        onChange={(e) => updateDaySchedule(key as keyof WeeklySchedule, { isOpen: e.target.checked })}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="font-medium text-gray-900 text-sm">{label}</span>
                    </label>

                    <div className={`px-2 py-1 text-xs rounded-full ${
                      daySchedule.isOpen
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {daySchedule.isOpen ? 'Abierto' : 'Cerrado'}
                    </div>
                  </div>

                  {/* Time slots */}
                  {daySchedule.isOpen && (
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {daySchedule.timeSlots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-2 py-1">
                            <input
                              type="time"
                              value={slot.opening}
                              onChange={(e) => updateTimeSlot(key as keyof WeeklySchedule, slotIndex, { opening: e.target.value })}
                              className="border-0 focus:ring-0 text-sm w-16 p-0"
                            />
                            <span className="text-gray-400 text-xs">-</span>
                            <input
                              type="time"
                              value={slot.closing}
                              onChange={(e) => updateTimeSlot(key as keyof WeeklySchedule, slotIndex, { closing: e.target.value })}
                              className="border-0 focus:ring-0 text-sm w-16 p-0"
                            />

                            {daySchedule.timeSlots.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTimeSlot(key as keyof WeeklySchedule, slotIndex)}
                                className="ml-1 text-red-500 hover:text-red-700 text-sm"
                                title="Eliminar horario"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addTimeSlot(key as keyof WeeklySchedule)}
                          className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-dashed border-blue-300"
                        >
                          + Horario
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Closed state */}
                  {!daySchedule.isOpen && (
                    <div className="flex-1 text-gray-500 text-sm italic">
                      Cerrado todo el día
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bulk actions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Acciones Rápidas</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const weekdays = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'] as const
                const updates: Partial<WeeklySchedule> = {}
                weekdays.forEach(day => {
                  updates[day] = { isOpen: true, timeSlots: [{ opening: '09:00', closing: '18:00' }] }
                })
                setSchedule(prev => ({ ...prev, ...updates }))
              }}
              className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
            >
              Abrir L-V 9-18
            </button>

            <button
              type="button"
              onClick={() => {
                const weekends = ['sabado', 'domingo'] as const
                const updates: Partial<WeeklySchedule> = {}
                weekends.forEach(day => {
                  updates[day] = { isOpen: true, timeSlots: [{ opening: '10:00', closing: '16:00' }] }
                })
                setSchedule(prev => ({ ...prev, ...updates }))
              }}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
            >
              Abrir Fines 10-16
            </button>

            <button
              type="button"
              onClick={() => {
                const updates: Partial<WeeklySchedule> = {}
                DAYS_ES.forEach(({ key }) => {
                  updates[key as keyof WeeklySchedule] = { isOpen: false, timeSlots: [{ opening: '09:00', closing: '18:00' }] }
                })
                setSchedule(prev => ({ ...prev, ...updates }))
              }}
              className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
            >
              Cerrar Todos
            </button>
          </div>
        </div>
      </div>

      {/* Preview/Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Vista Previa</h4>
        <div className="text-sm text-gray-600 space-y-1">
          {DAYS_ES.map(({ key, label }) => {
            const daySchedule = schedule[key as keyof WeeklySchedule]

            if (!daySchedule.isOpen) {
              return (
                <div key={key} className="flex justify-between">
                  <span>{label}:</span>
                  <span className="text-red-600">Cerrado</span>
                </div>
              )
            }

            return (
              <div key={key} className="flex justify-between">
                <span>{label}:</span>
                <span className="text-green-600">
                  {daySchedule.timeSlots.map(slot => `${slot.opening}-${slot.closing}`).join(', ')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
