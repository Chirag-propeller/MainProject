import { Button } from '@/components/ui/button'
import React from 'react'
import { FilterState } from './Filter'
import { DateRangeFilter } from './DateFilter'
import axios from 'axios';


interface ExportProps {
    filters: FilterState;
    dateRange: DateRangeFilter;
}

const Export: React.FC<ExportProps> = ({ filters, dateRange }) => {

    const handleExport = async () => {
        try {
            const response = await axios.post('/api/callHistory/download', {
                filters,
                dateRange
            }, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'call_history.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error exporting CSV:', error);
        }
    }

  return (
    <div className=''>
        <Button variant='default' size='sm' className='rounded-[4px] text-xs px-4 py-2' onClick={handleExport}>Export CSV</Button>
    </div>
  )
}

export default Export