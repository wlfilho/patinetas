'use client'

import { useState } from 'react'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  activeLabel?: string
  inactiveLabel?: string
  className?: string
}

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  activeLabel = 'Activar',
  inactiveLabel = 'Desactivar',
  className = ''
}: ToggleSwitchProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    if (disabled) return
    
    setIsAnimating(true)
    onChange(!checked)
    
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 200)
  }

  // Size configurations
  const sizeConfig = {
    sm: {
      track: 'w-8 h-4',
      handle: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    md: {
      track: 'w-11 h-6',
      handle: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    lg: {
      track: 'w-14 h-7',
      handle: 'w-6 h-6',
      translate: 'translate-x-7'
    }
  }

  const config = sizeConfig[size]

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? inactiveLabel : activeLabel}
      title={checked ? inactiveLabel : activeLabel}
      onClick={handleToggle}
      disabled={disabled}
      className={`
        relative inline-flex items-center rounded-full transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${config.track}
        ${checked 
          ? 'bg-green-500 hover:bg-green-600' 
          : 'bg-gray-300 hover:bg-gray-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isAnimating ? 'scale-105' : ''}
        ${className}
      `}
    >
      {/* Toggle Handle */}
      <span
        className={`
          inline-block rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out
          ${config.handle}
          ${checked ? config.translate : 'translate-x-0.5'}
          ${isAnimating ? 'scale-110' : ''}
        `}
      />
      
      {/* Screen reader text */}
      <span className="sr-only">
        {checked ? `Marca activa. ${inactiveLabel}` : `Marca inactiva. ${activeLabel}`}
      </span>
    </button>
  )
}
