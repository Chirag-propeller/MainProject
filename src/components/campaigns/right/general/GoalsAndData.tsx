import React, { useState } from 'react';
import { Campaign } from '../../types';
import { Target, Triangle, Database, Shield } from 'lucide-react';

interface GoalsAndDataProps {
  campaign: Campaign;
}

const GoalsAndData: React.FC<GoalsAndDataProps> = ({ campaign }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Check if there's any goals/data information to display
  const hasGoalsData = campaign.goal || 
                      (campaign.dataToCollect && campaign.dataToCollect.length > 0) || 
                      campaign.mandatoryAdherence;

  if (!hasGoalsData) {
    return null; // Don't render if no data
  }

  return (
    <div className='border border-gray-200 dark:border-gray-700 rounded-lg'>
      <header 
        className='cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-indigo-600 dark:hover:bg-indigo-700 p-2 transition-colors'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <Target className='w-3.5 h-3.5 text-gray-900 dark:text-white self-center' />
            <h2 className='text-md text-gray-900 dark:text-white'>Goals & Data Collection</h2>
          </div>
          <Triangle 
            className={`w-3 h-3 self-center text-gray-500 dark:text-white ${isOpen ? "rotate-180" : "rotate-90"}`} 
          />
        </div>
      </header>
      {isOpen && (
        <div className='p-4 bg-gray-50 dark:bg-gray-950 space-y-4'>
          {/* Campaign Goal */}
          {campaign.goal && (
            <div className='bg-white dark:bg-gray-950 p-4 rounded-md border border-gray-200 dark:border-gray-700'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1'>
                  <Target className='w-3 h-3' />
                  Campaign Goal
                </span>
                <div className='text-sm text-gray-900 dark:text-gray-100 leading-relaxed'>
                  {campaign.goal}
                </div>
              </div>
            </div>
          )}

          {/* Data to Collect */}
          {campaign.dataToCollect && campaign.dataToCollect.length > 0 && (
            <div className='bg-white dark:bg-gray-950 p-4 rounded-md border border-gray-200 dark:border-gray-700'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1'>
                  <Database className='w-3 h-3' />
                  Data to Collect
                </span>
                <div className='text-sm text-gray-900 dark:text-gray-100'>
                  <ul className='list-disc list-inside space-y-1'>
                    {campaign.dataToCollect.map((item, index) => (
                      <li key={index} className='leading-relaxed'>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Mandatory Adherence */}
          {campaign.mandatoryAdherence && (
            <div className='bg-white dark:bg-gray-950 p-4 rounded-md border border-gray-200 dark:border-gray-700'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1'>
                  <Shield className='w-3 h-3' />
                  Mandatory Adherence
                </span>
                <div className='text-sm text-gray-900 dark:text-gray-100 leading-relaxed'>
                  {campaign.mandatoryAdherence}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalsAndData; 