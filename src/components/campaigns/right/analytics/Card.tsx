import { Loader2 } from 'lucide-react';
import React from 'react'

interface CardProps {
  title: string;
  value: string;
  width?: '1/3' | '2/3' | '3/3' | 'full';   
  className?: string;
  loading?: boolean;
}

const Card = ({ title, value, width = '1/3', className = '' , loading}: CardProps) => {
  const getWidthClass = () => {
    switch (width) {
      case '1/3':
        return 'w-[30%]';
      case '2/3':
        return 'w-[60%]';
      case '3/3':
        return 'w-full';
      case 'full':
        return 'w-full';
      default:
        return 'w-1/3';
    }
  };

  return (
    <div className={`${getWidthClass()} p-1`}>
      <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full ${className}`}>
        <div className="flex flex-col justify-between h-full">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
            {title}
          </h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-indigo-500 leading-none">
              {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : value}
            </span>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card