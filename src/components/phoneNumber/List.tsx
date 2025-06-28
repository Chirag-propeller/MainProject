import { Trash2 } from 'lucide-react'; // Cleaner trash icon

import React, { useEffect, useState } from 'react';

// interface Phone {
//   phoneNumber : string;
// }

interface Phone {
  phoneNumber: string;
  name?: string;
  createdAt?: string;
  // Add other fields here
}

const List = ({ refreshTrigger, selectedPhoneNumber,setSelectedPhoneRecord }: { refreshTrigger: boolean ,  setSelectedPhoneRecord: (record: Phone|null) => void ,selectedPhoneNumber:string }) => {

  const [phoneNumber, setPhoneNumber] = useState<Phone[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  const handleDelete = async (number: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents selecting the number when clicking delete
  
    const confirmed = confirm(`Are you sure you want to delete number ${number}?`);
    if (!confirmed) return;
  
    try {
      const res = await fetch('/api/phoneNumber/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: number }),
      });
  
      if (res.ok) {
        setPhoneNumber(prev => prev.filter(p => p.phoneNumber !== number));
        if (selectedPhoneNumber === number) {
          setSelectedPhoneRecord(null);
        }
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete phone number.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Something went wrong.');
    }
  };
  

  const fetchPhone = async () => {
    try {
      const res = await fetch('/api/phoneNumber/get');
      const data = await res.json();
      console.log(data)
      setPhoneNumber(data || []);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhone();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 dark:border-indigo-400 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (phoneNumber.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        No phone numbers found. Click Create to add your first phone number.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {phoneNumber.map((phone) => {
        const isActive = phone.phoneNumber === selectedPhoneNumber;
        return (
          <div
            key={phone.phoneNumber}
            className={`group p-2 px-2 border rounded-md mb-2 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer ${
              isActive 
                ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => setSelectedPhoneRecord(phone)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {phone.phoneNumber}
                </h3>
                {phone.name && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {phone.name}
                  </p>
                )}
              </div>
              
              <button 
                onClick={(e) => handleDelete(phone.phoneNumber, e)} 
                className="ml-2 p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default List