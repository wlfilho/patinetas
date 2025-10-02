'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DepartmentSelectorProps {
  departments: Array<{
    departamento: string
    count: number
    slug: string
    emoji: string
  }>
}

export default function DepartmentSelector({ departments }: DepartmentSelectorProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value) {
      router.push(value)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8 mb-8 sm:mb-12 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <span className="text-2xl">📍</span>
        </div>
        <div>
          <label
            htmlFor="department-select"
            className="block text-lg font-bold text-gray-900"
          >
            Seleccionar Departamento
          </label>
          <p className="text-sm text-gray-600">
            Acceso rápido a cualquier departamento
          </p>
        </div>
      </div>

      <div className="relative">
        <select
          id="department-select"
          className="w-full px-4 py-3.5 pr-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base bg-white hover:border-primary/50 transition-colors cursor-pointer appearance-none font-medium text-gray-700"
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          defaultValue=""
        >
          <option value="" className="text-gray-500">
            -- Selecciona un departamento --
          </option>
          {departments.map(({ departamento, count, slug, emoji }) => (
            <option
              key={departamento}
              value={`/departamentos/${slug}`}
              className="py-2"
            >
              {emoji} {departamento} • {count} {count === 1 ? 'negocio' : 'negocios'}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Helper text */}
      <p className="mt-3 text-xs text-gray-500 flex items-center gap-1.5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Selecciona un departamento para ver todos los negocios disponibles
      </p>
    </div>
  )
}

