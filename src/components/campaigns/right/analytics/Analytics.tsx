import React, { useEffect, useState } from 'react'

const Analytics = ({campaignId}: {campaignId: string}) => {
    const [analytics, setAnalytics] = useState<any[]>([]);
    useEffect(() => {
        const fetchAnalytics = async () => {
            const response = await fetch('/api/createCampaign/analytics', {
                method: 'POST',
                body: JSON.stringify({campaignId: campaignId}),
            });
            const data = await response.json();
            setAnalytics(data);
            console.log(data);
        }
        fetchAnalytics();
    }, []);
    
  return (
    <div>Analytics</div>
  )
}

export default Analytics