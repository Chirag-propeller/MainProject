import { Trash2 } from 'lucide-react'; // Cleaner trash icon

import React from 'react'
import { useEffect, useState } from 'react';

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

  return (
    <div>
      
      {loading ? (<p className="text-gray-600">Loading Phone Numbers...</p>) : (
        phoneNumber.map((phone) => {
          const isActive = phone.phoneNumber === selectedPhoneNumber;
          return (
            <div
              key={phone.phoneNumber}
              className={`flex justify-between cursor-pointer p-1 rounded-sm ${
                isActive ? 'bg-gray-300 font-bold' : 'hover:bg-gray-200'
              }`}
              onClick={() => setSelectedPhoneRecord(phone)}

              // onClick={() => setSelectedPhoneNumber(phone.phoneNumber)}
            >
              <p>{phone.phoneNumber}</p>
              <button onClick={(e) => handleDelete(phone.phoneNumber, e)} className="text-gray-700 cursor-pointer hover:text-red-800">
                <Trash2 className="w-4 h-4" />
              </button>

              
            </div>
          );
        })
      )}
    </div>
  )
}

export default List