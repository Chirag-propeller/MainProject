import React from 'react'
import { useEffect, useState } from 'react';

interface Phone {
  phoneNumber : string;
}

const List = ({ refreshTrigger, selectedPhoneNumber,setSelectedPhoneNumber }: { refreshTrigger: boolean , setSelectedPhoneNumber :  (phoneNumber: string) => void ,selectedPhoneNumber:string }) => {

  const [phoneNumber, setPhoneNumber] = useState<Phone[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAgents = async () => {
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
    fetchAgents();
  }, [refreshTrigger]);

  return (
    <div>
      
      {loading ? (<p className="text-gray-600">Loading agents...</p>) : (
        phoneNumber.map((phone) => {
          const isActive = phone.phoneNumber === selectedPhoneNumber;
          return (
            <div
              key={phone.phoneNumber}
              className={`cursor-pointer p-1 rounded-sm ${
                isActive ? 'bg-gray-300 font-bold' : 'hover:bg-gray-200'
              }`}
              onClick={() => setSelectedPhoneNumber(phone.phoneNumber)}
            >
              {phone.phoneNumber}
            </div>
          );
        })
      )}
    </div>
  )
}

export default List