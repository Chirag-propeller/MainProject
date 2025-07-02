"use client"
import React, { useEffect, useState } from 'react'
import CurrentBalanceCard from './CurrentBalanceCard'
import UsageHistoryTable from './UsageHistoryTable'
import PaymentHistoryTable from './PaymentHistoryTable'
import RechargeSection from './RechargeSection'
import CreditExhaustedBanner from './CreditExhaustedBanner'
import axios from 'axios'
// Mock user balance for demo



const BillingDashboard = () => {
  const [userCredits, setUserCredits] = useState(0);
  const [userCreditsUsed, setUserCreditsUsed] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchUserBalance = async () => {
      setLoading(true);
      const user = await axios.get('/api/user/getCurrentUser');
      console.log(user);
      const credits = parseFloat(user.data?.credits?.$numberDecimal) || 0;
      const creditsUsed = parseFloat(user.data?.creditsUsed?.$numberDecimal) || 0;
      setUserCredits(credits);
      setUserCreditsUsed(creditsUsed);
      setUserBalance(credits - creditsUsed);
      setLoading(false);
    }
    
    fetchUserBalance()
  }, [])
  useEffect(() => {
    setUserBalance(userCredits - userCreditsUsed);
  }, [userCredits, userCreditsUsed])

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Billing & Usage</h1>
        
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Current Balance Card Skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-12 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            
            {/* Recharge Section Skeleton */}
            <div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage History Skeleton */}
            <div>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="grid grid-cols-4 gap-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment History Skeleton */}
            <div>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="grid grid-cols-3 gap-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Billing & Usage</h1>
      
      {/* Show banner if credit is exhausted */}
      {userBalance <= 0 && <CreditExhaustedBanner />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Current Balance Card */}
        <div className="lg:col-span-2">
          <CurrentBalanceCard balance={userBalance} />
        </div>
        
        {/* Recharge Section */}
        <div>
          <RechargeSection />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage History */}
        <div>
          <UsageHistoryTable />
        </div>
        
        {/* Payment History */}
        <div>
          <PaymentHistoryTable />
        </div>
      </div>
    </div>
  )
}

export default BillingDashboard