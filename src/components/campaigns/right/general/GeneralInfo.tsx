import React, { useState } from 'react';
import { Campaign } from '../../types';
import { Info, Triangle, Calendar, Clock } from 'lucide-react';

interface GeneralInfoProps {
  campaign: Campaign;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({ campaign }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to format call timing
  const formatCallTiming = (slotTime?: string) => {
    if (!slotTime) return 'Not specified';
    
    switch (slotTime) {
      case 'fullDay':
        return 'Full day (10 AM to 6 PM)';
      case 'firstHalf':
        return '1st Half only (10 AM to 2 PM)';
      case 'secondHalf':
        return '2nd Half only (2 PM to 6 PM)';
      default:
        // Check if it's a custom time format
        const timeMatch = slotTime.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
        if (timeMatch) {
          return `Custom (${timeMatch[1]} to ${timeMatch[2]})`;
        }
        return slotTime;
    }
  };

  // Helper function to format selected days
  const formatSelectedDays = (slotDates?: string[]) => {
    if (!slotDates || slotDates.length === 0) return 'Not specified';
    return slotDates.join(', ');
  };

  return (
    <div className='border border-gray-200 rounded-lg'>
      <header 
        className='cursor-pointer bg-gray-100 p-2'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <Info className='w-3.5 h-3.5 text-gray-900 self-center' />
            <h2 className='text-md text-gray-900'>General Info</h2>
          </div>
          <Triangle 
            className={`w-3 h-3 self-center ${isOpen ? "rotate-180" : "rotate-90"}`} 
            style={{ fill: "lightgray" }}
          />
        </div>
      </header>
      {isOpen && (
        <div className='p-4 bg-gray-50'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-white p-3 rounded-md border border-gray-200'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>Created At</span>
                <span className='text-sm text-gray-900'>{new Date(campaign.createdAt).toLocaleString()}</span>
              </div>
            </div>
            
            <div className='bg-white p-3 rounded-md border border-gray-200'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>From Number</span>
                <span className='text-sm text-gray-900'>{campaign.fromNumber || 'Not specified'}</span>
              </div>
            </div>
            
            <div className='bg-white p-3 rounded-md border border-gray-200'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>Concurrent Calls</span>
                <span className='text-sm text-gray-900'>{campaign.concurrentCalls || 'Not specified'}</span>
              </div>
            </div>
            
            <div className='bg-white p-3 rounded-md border border-gray-200'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>Status</span>
                <div className='mt-1'>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                    campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Scheduling Information */}
            <div className='bg-white p-3 rounded-md border border-gray-200'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1'>
                  <Calendar className='w-3 h-3' />
                  Scheduled Days
                </span>
                <span className='text-sm text-gray-900'>{formatSelectedDays(campaign.slotDates)}</span>
              </div>
            </div>

            <div className='bg-white p-3 rounded-md border border-gray-200'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1'>
                  <Clock className='w-3 h-3' />
                  Call Timing
                </span>
                <span className='text-sm text-gray-900'>{formatCallTiming(campaign.slotTime)}</span>
              </div>
            </div>

            {/* Follow-up Information */}
            <div className='bg-white p-3 rounded-md border border-gray-200'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>Follow-ups</span>
                <span className='text-sm text-gray-900'>
                  {campaign.noOfFollowUps && campaign.noOfFollowUps !== "0" 
                    ? `Yes (${campaign.noOfFollowUps} follow-ups)` 
                    : 'No'}
                </span>
              </div>
            </div>

            {/* Timezone if available */}
            {campaign.callTimezone && (
              <div className='bg-white p-3 rounded-md border border-gray-200'>
                <div className='flex flex-col'>
                  <span className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>Timezone</span>
                  <span className='text-sm text-gray-900'>{campaign.callTimezone}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralInfo; 