import React, { useEffect, useState } from 'react'
import Card from './Card';
import ProgressCard from './ProgressCard';
import { Button } from '@/components/ui/button';

const Analytics = ({campaignId, status}: {campaignId: string, status: string}) => {
    const [analytics, setAnalytics] = useState<any[]>([]);
    const [loading, setLoading] = useState((status === 'draft') ? false : true);
    const [isLive, setIsLive] = useState(status === 'ongoing');
    const [isDraft, setIsDraft] = useState(status === 'draft');
    const [campaignStatus, setCampaignStatus] = useState(status);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [dataToShow, setDataToShow] = useState<any[]>([
      {
        title: "Total Calls",
        name: "total_calls",
        value: 0
      },
      {
        title: "Completed Calls",
        name: "completed_calls",
        value: 0
      },
      {
        title: "Failed Calls",
        name: "failed_calls",
        value: 0
      },
      {
        title: "Active Calls",
        name: "active_calls",
        value: 0
      },
      {
        title: "Pending Calls",
        name: "queued_calls",
        value: 0
      },
      {
        title: "Average Talk Time",
        name: "average_talk_time",
        value: 0
      },
      {
        title: "Max Talk Time",
        name: "max_talk_time",
        value: 0
      }
      
    ]);
    const url = process.env.NEXT_PUBLIC_CAMPAIGN_URL!;

    const fetchAnalytics = async () => {
      setLoading(true);
      try{

      const response = await fetch(`${url}${campaignId}/status`, {
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
      setDataToShow([...tempData]);
      setLastUpdated(new Date());
      console.log(tempData);
      }catch(error){
        console.error('Error fetching analytics:', error);
      }finally{
        setLoading(false);
      }
  }

    useEffect(() => {
        
      if(isLive){
        fetchAnalytics();
        const interval = setInterval(() => {
            fetchAnalytics();
          }, 60000);
          return () => clearInterval(interval);
        }
    }, [isLive]);

    // Helper function to get data by name
    const getDataValue = (name: string) => {
      const item = dataToShow.find(d => d.name === name);
      return item ? item.value : 0;
    };

    // Helper function to format time values
    const formatTime = (seconds: number) => {
      if (seconds === 0) return "0s";
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };
    
  return (
    <div className="space-y-4 p-4 pt-0">
        {/* Header */}
        <div className='flex flex-row justify-between items-center sticky top-0 bg-white z-10 pt-2 pb-1'>
            <div>
              <h1 className='text-lg font-medium text-gray-800'>Live Analytics</h1>
              <p className='text-xs text-gray-500'>
                Last updated: {lastUpdated?.toLocaleTimeString() || "--"} • Auto-refresh: {isLive ? "60s" : "Off"}
              </p>
            </div>
            <Button 
              className='rounded-lg text-xs' 
              onClick={fetchAnalytics} 
              disabled={loading || !isLive}
              size="sm"
            >
                {loading ? 'Refreshing...' : 'Refresh Now'}
            </Button>
        </div>

        {/* Progress Card */}
        <ProgressCard 
          title="Campaign Progress"
          completedCalls={getDataValue('completed_calls')}
          totalCalls={getDataValue('total_calls')}
          loading={loading}
          isLive={isLive}
        />

        {/* Row 1: Planned vs Completed (50% each) */}
        <div className='flex flex-row gap-2'>
          <Card 
            title="Planned Calls" 
            value={getDataValue('total_calls')?.toLocaleString() || "0"} 
            widthPercentage="50"
            loading={loading}
            isLive={isLive}
            isDraft={isDraft}
          />
          <Card 
            title="Completed Calls" 
            value={getDataValue('completed_calls')?.toLocaleString() || "0"} 
            widthPercentage="50"
            loading={loading}
            isLive={isLive}
            isDraft={isDraft}
          />
        </div>

        {/* Row 2: Status Cards (33% each) */}
        <div className='flex flex-row gap-2'>

          <Card 
            title="Failed Calls" 
            value={getDataValue('failed_calls')?.toLocaleString() || "0"} 
            widthPercentage="33"
            loading={loading}
            theme="red"
            isLive={isLive}
            isDraft={isDraft}
          />
          <Card 
            title="Active Calls" 
            value={getDataValue('active_calls')?.toLocaleString() || "0"} 
            widthPercentage="33"
            loading={loading}
            theme="green"
            isLive={isLive}
            isDraft={isDraft}
          />
          <Card 
            title="Pending Calls" 
            value={getDataValue('queued_calls')?.toLocaleString() || "0"} 
            widthPercentage="33"
            loading={loading}
            theme="orange"
            isLive={isLive}
            isDraft={isDraft}
          />
        </div>

        {/* Row 3: Talk Time Cards (50% each) */}
        <div className='flex flex-row gap-2'>
          <Card 
            title="Average Talk Time" 
            value={getDataValue('average_talk_time')?.toLocaleString() || "0"} 
            widthPercentage="50"
            loading={loading}
            theme="default"
            isLive={isLive}
            isDraft={isDraft}
          />
          <Card 
            title="Max Talk Time" 
            value={getDataValue('max_talk_time')?.toLocaleString() || "0"} 
            widthPercentage="50"
            loading={loading}
            theme="default"
            isLive={isLive}
            isDraft={isDraft}
          />
        </div>

        {/* Follow Up Calls Section */}
        <div className="pt-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Follow Up Calls</h2>
          
          {/* Row 1: Total Follow Ups (50% each) */}
          <div className='flex flex-row gap-2 mb-3'>
            <Card 
              title="Total Follow Ups" 
              value="0" 
              widthPercentage="50"
              loading={loading}
              theme="default"
              isLive={isLive}
              isDraft={isDraft}
            />
            <Card 
              title="Total Unique Follow Ups" 
              value="0" 
              widthPercentage="50"
              loading={loading}
              theme="default"
              isLive={isLive}
              isDraft={isDraft}
            />
          </div>

          {/* Row 2: 2+ Metrics (50% each) */}
          <div className='flex flex-row gap-2 mb-3'>
            <Card 
              title="2+ Dials" 
              value="0" 
              widthPercentage="50"
              loading={loading}
              theme="default"
              isLive={isLive}
              isDraft={isDraft}
            />
            <Card 
              title="2+ Connects" 
              value="0" 
              widthPercentage="50"
              loading={loading}
              theme="default"
              isLive={isLive}
              isDraft={isDraft}
            />
          </div>

          {/* Row 3: 3+ Metrics (50% each) */}
          <div className='flex flex-row gap-2 mb-3'>
            <Card 
              title="3+ Dials" 
              value="0" 
              widthPercentage="50"
              loading={loading}
              theme="default"
              isLive={isLive}
              isDraft={isDraft}
            />
            <Card 
              title="3+ Connects" 
              value="0" 
              widthPercentage="50"
              loading={loading}
              theme="default"
              isLive={isLive}
              isDraft={isDraft}
            />
          </div>

          {/* Row 4: 4+ Metrics (50% each) */}
          <div className='flex flex-row gap-2'>
            <Card 
              title="4+ Dials" 
              value="0" 
              widthPercentage="50"
              loading={loading}
              theme="default"
              isLive={isLive}
              isDraft={isDraft}
              />
            <Card 
              title="4+ Connects" 
              value="0" 
              widthPercentage="50"
              loading={loading}
              theme="default"
              isLive={isLive}
              isDraft={isDraft}
            />
          </div>
        </div>
    </div>
  )
}

export default Analytics