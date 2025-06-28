import React from 'react'
import { Button } from '@/components/ui/button'

const CreditExhaustedBanner = () => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 mb-6 rounded-md shadow-sm dark:shadow-gray-700/50">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {/* Alert icon */}
          <svg className="h-5 w-5 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between md:items-center">
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>Credit exhausted!</strong> Your account has run out of credit. Voice AI features are currently unavailable.
          </p>
          <div className="mt-3 md:mt-0 md:ml-6">
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => window.location.href = '#recharge'}
            >
              Recharge Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditExhaustedBanner 