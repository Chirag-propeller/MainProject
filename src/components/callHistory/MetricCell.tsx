// // app/components/MetricCell.tsx
// type MetricCellProps = {
//     value: any;
//   };
  
//   export default function MetricCell({ value }: MetricCellProps) {
//     return (
//       <td className="px-6 py-4 whitespace-pre-wrap text-gray-700">
//         {typeof value === 'object' ? JSON.stringify(value, null, 2) : value?.toString() || '-'}
//       </td>
//     );
//   }
  

// app/components/MetricCell.tsx
type MetricCellProps = {
    value: any;
    field?: string;
  };
  
  export default function MetricCell({ value, field }: MetricCellProps) {
    let displayValue = value;
  
    if (typeof value === 'number') {
    //   displayValue = value.toFixed(5);
    const isInteger = Number.isInteger(value);
    displayValue = isInteger ? value.toString() : value.toFixed(5);
    } else if (typeof value === 'object') {
      displayValue = JSON.stringify(value, null, 2);
    }
  
    return (
      <td className="px-6 py-4 whitespace-pre-wrap text-gray-700">
        {displayValue ?? '-'}
      </td>
    );
  }
  