'use client'

interface ItemsPerPageSelectorProps {
  value: number
  onChange: (value: number) => void
  options?: number[]
  className?: string
}

export default function ItemsPerPageSelector({
  value,
  onChange,
  options = [10, 25, 50, 100],
  className = ''
}: ItemsPerPageSelectorProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label htmlFor="items-per-page" className="text-sm text-gray-600 whitespace-nowrap">
        Mostrar:
      </label>
      <div className="relative">
        <select
          id="items-per-page"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            appearance-none bg-white border border-gray-300 rounded-lg
            pl-3 pr-8 py-2 text-sm font-medium text-gray-700
            hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            transition-colors duration-200
          "
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option} establecimientos
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
