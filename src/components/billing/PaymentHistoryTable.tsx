"use client"
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock data for payment history
const MOCK_PAYMENT_DATA = [
  { id: 'PAY-001', date: '2023-10-20', amount: 20, paymentMethod: 'Credit Card', status: 'successful' },
  { id: 'PAY-002', date: '2023-09-15', amount: 50, paymentMethod: 'PayPal', status: 'successful' },
  { id: 'PAY-003', date: '2023-08-22', amount: 10, paymentMethod: 'Credit Card', status: 'successful' },
  { id: 'PAY-004', date: '2023-07-10', amount: 15, paymentMethod: 'Credit Card', status: 'successful' },
  { id: 'PAY-005', date: '2023-06-05', amount: 5, paymentMethod: 'PayPal', status: 'successful' },
  { id: 'PAY-006', date: '2023-05-28', amount: 15, paymentMethod: 'Credit Card', status: 'failed' },
  { id: 'PAY-007', date: '2023-04-17', amount: 10, paymentMethod: 'Credit Card', status: 'successful' },
  { id: 'PAY-008', date: '2023-03-09', amount: 50, paymentMethod: 'PayPal', status: 'successful' },
]

type PaymentMethod = 'All' | 'Credit Card' | 'PayPal'
type PaymentStatus = 'All' | 'successful' | 'failed'

const PaymentHistoryTable = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<PaymentMethod>('All')
  const [statusFilter, setStatusFilter] = useState<PaymentStatus>('All')
  const itemsPerPage = 5
  
  // Apply filters
  const filteredData = MOCK_PAYMENT_DATA.filter(payment => {
    const matchesMethod = paymentMethodFilter === 'All' || payment.paymentMethod === paymentMethodFilter
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter
    return matchesMethod && matchesStatus
  })
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium'
    }).format(date)
  }
  
  // Status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'successful':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Reset filters
  const resetFilters = () => {
    setPaymentMethodFilter('All')
    setStatusFilter('All')
    setCurrentPage(1)
  }
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-gray-800">Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          <div>
            <label htmlFor="method-filter" className="block text-xs font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              id="method-filter"
              value={paymentMethodFilter}
              onChange={(e) => {
                setPaymentMethodFilter(e.target.value as PaymentMethod)
                setCurrentPage(1)
              }}
              className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              <option value="All">All Methods</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as PaymentStatus)
                setCurrentPage(1)
              }}
              className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              <option value="All">All Statuses</option>
              <option value="successful">Successful</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="text-xs"
            >
              Reset Filters
            </Button>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? currentItems.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(payment.date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-sm text-center text-gray-500">
                    No payment records found with the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
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

export default PaymentHistoryTable 