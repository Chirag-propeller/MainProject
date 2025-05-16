import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CurrentBalanceCardProps {
  balance: number
}

const CurrentBalanceCard = ({ balance }: CurrentBalanceCardProps) => {
  // Determine balance status for color coding
  const getBalanceStatus = () => {
    if (balance <= 0) return 'danger'
    if (balance < 10) return 'warning'
    return 'healthy'
  }

  const statusStyles = {
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    healthy: 'text-indigo-600'
  }

  const balanceStatus = getBalanceStatus()

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-gray-800">Current Balance</CardTitle>
        {balanceStatus !== 'healthy' && (
          <Button 
            variant="ghost"
            size="sm"
            className={`${balanceStatus === 'danger' ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'}`}
            onClick={() => window.location.href = '#recharge'}
          >
            {balanceStatus === 'danger' ? 'Recharge Now!' : 'Low Balance'}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline mt-4">
          <div className={`text-5xl font-bold ${statusStyles[balanceStatus]}`}>
            ${balance.toFixed(2)}
          </div>
          <div className="text-gray-500 ml-2">credit remaining</div>
        </div>
        
        {/* Balance indicator bar */}
        <div className="mt-6 mb-2">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div 
              className={`h-2 rounded-full ${
                balanceStatus === 'danger' 
                  ? 'bg-red-500' 
                  : balanceStatus === 'warning' 
                    ? 'bg-yellow-500' 
                    : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.min(100, (balance / 50) * 100)}%` }}
            />
          </div>
        </div>
        
        {/* Balance status message */}
        <div className={`text-sm mt-2 ${statusStyles[balanceStatus]}`}>
          {balanceStatus === 'danger' 
            ? 'Your credit has been exhausted. Please recharge to continue using the service.' 
            : balanceStatus === 'warning' 
              ? 'Your credit is running low. Consider recharging soon.' 
              : 'Your balance is healthy.'}
        </div>
      </CardContent>
    </Card>
  )
}

export default CurrentBalanceCard 