// components/TimeZoneDropdown.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type TimeZoneDropdownProps = {
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  timeZones: string[];
};


const TimeZoneDropdown: React.FC<TimeZoneDropdownProps> = ({selectedZone, setSelectedZone, timeZones} ) => {
  // const [timeZones, setTimeZones] = useState<string[]>([]);
  // const [selectedZone, setSelectedZone] = useState('');

  // useEffect(() => {
  //   const fetchTimeZones = async () => {
  //     try {
  //       // const res = await axios.get('https://worldtimeapi.org/api/timezone');
  //       const res = await axios.get('https://timeapi.io/api/timezone/availabletimezones');
  //       setTimeZones(res.data);
  //     } catch (error) {
  //       console.error('Failed to fetch time zones:', error);
  //     }
  //   };

  //   fetchTimeZones();
  // }, []);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
        Select Time Zone
      </label>
      <select
        id="timezone"
        className="w-full border border-gray-300 rounded-lg p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedZone}
        onChange={(e) => setSelectedZone(e.target.value)}
      >
        <option value="">-- Select a Time Zone --</option>
        {timeZones.map((zone) => (
          <option key={zone} value={zone}>
            {zone}
          </option>
        ))}
      </select>

      {selectedZone && (
        <p className="mt-4 text-sm text-gray-600">
          Selected Time Zone: <span className="font-medium">{selectedZone}</span>
        </p>
      )}
    </div>
  );
};

export default TimeZoneDropdown;
