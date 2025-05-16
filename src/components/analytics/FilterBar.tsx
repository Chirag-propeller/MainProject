// components/Filters.tsx
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

export default function Filters({ onChange}: { onChange: (filters: any) => void,}) {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [agentId, setAgentId] = useState("");

  const handleFilterChange = (newRange: any, agent: any) => {
    console.log("newRange",newRange);
    const [start, end] = newRange;

    const startDateISO = start?.toISOString();
  
    // Set end to 23:59:59.999 to include the full end date
    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999);
    const endDateISO = endOfDay.toISOString();
  
    console.log("startDateISO", startDateISO);
    console.log("endDateISO", endDateISO);
  
    onChange({
      startDate: startDateISO,
      endDate: endDateISO,
    });
    console.log("onChange",startDateISO,endDateISO);
    // onChange({
    //   startDate: newRange[0]?.toISOString(),
    //   endDate: newRange[1]?.toISOString(),
    // });
  };

  return (
    <div className="flex gap-4 p-4 items-center">
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update: any) => {
          setDateRange(update);
          handleFilterChange(update, agentId);
        }}
        isClearable
        placeholderText="Select a date range"
        className="border px-3 py-2 rounded-md"
      />

      {/* <select
        value={agentId}
        onChange={(e) => {
          const newAgentId = e.target.value;
          setAgentId(newAgentId);
          handleFilterChange(dateRange, newAgentId);
        }}
        className="border px-3 py-2 rounded-md"
      >
        <option value="">All Agents</option>
        {agents.map((agent) => (
          <option key={agent._id} value={agent._id}>
            {agent.name}
          </option>
        ))}
      </select> */}
    </div>
  );
}
