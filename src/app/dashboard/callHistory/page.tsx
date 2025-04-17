"use client"
import MetricsTable from '@/components/callHistory/MetricsTable';
import React, { useEffect, useState } from 'react'

const page = () => {
    // const [metrics, setMetrics] = useState<any[]>([]);
    // const [loading, setLoading] = useState(true);
  
    // useEffect(() => {
    //   fetch('/api/callHistory/get')
    //     .then(res => res.json())
    //     .then(data => {
    //       setMetrics(data);
    //       setLoading(false);
    //     });
    // }, []);
  
    // if (loading) return <p>Loading...</p>;
  
    return (
      <div className="p-4">

        <div className="fixed left-64 top-3 right-1 z-50 bg-white p-4 flex justify-start items-center">


            <h1 className="text-xl font-bold p-2 m-4 fixed bg-white ">Metrics</h1>
        </div>


        <pre className="p-4 rounded  overflow-auto">
          {/* {JSON.stringify(metrics, null, 2)} */}
          {/* {
            metrics.length > 0 && (
                <MetricsTable/>
            )
          } */}
          <MetricsTable/>
        </pre>
      </div>
    );
}

export default page