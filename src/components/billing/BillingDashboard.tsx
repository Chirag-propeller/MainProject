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

  useEffect(() => {
    const fetchUserBalance = async () => {
      // const user = await axios.get('/api/user/getCurrentUser');
      const user = await axios.get('/api/user/getCurrentUser');
      console.log(user);
      const credits = parseFloat(user.data?.credits?.$numberDecimal) || 0;
      const creditsUsed = parseFloat(user.data?.creditsUsed?.$numberDecimal) || 0;
      setUserCredits(credits);
      setUserCreditsUsed(creditsUsed);
      setUserBalance(credits - creditsUsed);
      
    }
    fetchUserBalance()
  }, [])
  useEffect(() => {
    setUserBalance(userCredits - userCreditsUsed);
  }, [userCredits, userCreditsUsed])

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