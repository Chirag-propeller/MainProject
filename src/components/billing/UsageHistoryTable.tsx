"use client"

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock data for usage history
const MOCK_USAGE_DATA = [
  { id: 1, startTime: '2023-10-20T14:32:00', duration: '4:23', cost: 0.87, status: 'completed' },
  { id: 2, startTime: '2023-10-19T11:15:00', duration: '2:50', cost: 0.57, status: 'completed' },
  { id: 3, startTime: '2023-10-18T09:47:00', duration: '6:12', cost: 1.24, status: 'completed' },
  { id: 4, startTime: '2023-10-17T16:05:00', duration: '1:30', cost: 0.30, status: 'interrupted' },
  { id: 5, startTime: '2023-10-16T13:22:00', duration: '5:45', cost: 1.15, status: 'completed' },
  { id: 6, startTime: '2023-10-15T10:10:00', duration: '3:18', cost: 0.66, status: 'completed' },
  { id: 7, startTime: '2023-10-14T15:40:00', duration: '0:45', cost: 0.15, status: 'failed' },
  { id: 8, startTime: '2023-10-13T12:33:00', duration: '8:21', cost: 1.67, status: 'completed' },
  { id: 9, startTime: '2023-10-12T11:05:00', duration: '2:10', cost: 0.43, status: 'completed' },
  { id: 10, startTime: '2023-10-11T09:58:00', duration: '4:05', cost: 0.82, status: 'completed' },
]

const UsageHistoryTable = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = MOCK_USAGE_DATA.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(MOCK_USAGE_DATA.length / itemsPerPage)
  
  // Format date to display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date)
  }
  
  // Status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      case 'interrupted':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }
  }
  
  return (
    <Card className="h-full bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Usage History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Call Start Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(item.startTime)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {item.duration}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    ${item.cost.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, MOCK_USAGE_DATA.length)} of {MOCK_USAGE_DATA.length} entries
            </div>
            <div className="flex space-x-1">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UsageHistoryTable 