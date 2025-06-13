import React, { useEffect, useState } from 'react'
import Card from './Card';
import { Button } from '@/components/ui/button';

const Analytics = ({campaignId}: {campaignId: string}) => {
    const [analytics, setAnalytics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dataToShow, setDataToShow] = useState<any[]>([
      {
        title: "Total Calls",
        name: "total_calls",
        value: 0,
        width: '2/3'
      },
      {
        title: "Completed Calls",
        name: "completed_calls",
        value: 0,
        width: '1/3'
      },
      {
        title: "Failed Calls",
        name: "failed_calls",
        value: 0,
        width: '1/3'
      },
      {
        title: "Active Calls",
        name: "active_calls",
        value: 0,
        width: '1/3'
      },
      {
        title: "Pending Calls",
        name: "queued_calls",
        value: 0,
        width: '1/3'
      }
      
    ]);
    const url = process.env.NEXT_PUBLIC_CAMPAIGN_URL!;

    const fetchAnalytics = async () => {
      setLoading(true);
      const response = await fetch(`${url}/${campaignId}/status`, {
          method: 'GET',
          headers: {
              'x-api-key': 'supersecretapikey123'
          }
      });
      const data = await response.json();
      setAnalytics(data);
      console.log(data);
      let tempData = dataToShow;
      tempData.forEach((item) => {
        item.value = data[item.name];
      });
      setDataToShow(tempData);
      console.log(tempData);
      setLoading(false);
  }
    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(() => {
          fetchAnalytics();
        }, 60000);
        return () => clearInterval(interval);
    }, []);
    
  return (
    <div>
        <div className='flex flex-row justify-between items-center'>
            <h1 className='text-2xl font-bold'>Analytics</h1>
            <Button className='rounded-[4px] text-xs' onClick={fetchAnalytics} disabled={loading}>
                <span className='text-white'>Refresh</span>
            </Button>
        </div>
        <div className='flex flex-row flex-wrap justify-around gap-1'>
        {
          dataToShow.map((item) => (
            <Card key={item.name} title={item.title} value={item.value} loading={loading} width={item.width} />
          ))
        }
        </div>
    </div>
  )
}

export default Analytics