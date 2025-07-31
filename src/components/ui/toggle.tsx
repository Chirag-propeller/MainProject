import React from 'react'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
  size?: 'default' | 'small'
}

const Toggle: React.FC<ToggleProps> = ({ 
  checked, 
  onChange, 
  disabled = false, 
  className = '',
  size = 'default'
}) => {
  const sizeClasses = {
    default: {
      container: 'h-6 w-11',
      thumb: 'h-4 w-4',
      translate: checked ? 'translate-x-6' : 'translate-x-1'
    },
    small: {
      container: 'h-4 w-8',
      thumb: 'h-3 w-3',
      translate: checked ? 'translate-x-4' : 'translate-x-0.5'
    }
  }

  const currentSize = sizeClasses[size]

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${currentSize.container}
        ${checked ? 'bg-indigo-600' : 'bg-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <span
        className={`
          inline-block transform rounded-full bg-white transition-transform shadow-sm
          ${currentSize.thumb}
          ${currentSize.translate}
        `}
      />
    </button>
  )
}

export default Toggle 