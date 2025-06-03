'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'

const page = () => {
    const [sheets, setSheets] = useState<any[]>([]);
    const [selectedSheet, setSelectedSheet] = useState("");
    const [selectedSheetName, setSelectedSheetName] = useState("");
    const [sheetData, setSheetData] = useState<any[]>([]);
    const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const ListSheets = async () => {
        const res = await fetch('/api/integration/googleSheet/listSheet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(res);
        const data = await res.json();
        setSheets(data.files);
        console.log(data);
    }

    const readSheet = async () => {
        if (!selectedSheet) return;
        
        setLoading(true);
        try {
            const res = await fetch('/api/integration/googleSheet/readSheet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spreadsheetId: selectedSheet,
                    range: 'Sheet1!A:Z'
                })
            });
            const data = await res.json();
            console.log("data", data);
            
            if (data.values && data.values.length > 0) {
                setSheetData(data.values);
                extractPhoneNumbers(data.values);
            }
        } catch (error) {
            console.error("Error reading sheet:", error);
        }
        setLoading(false);
    }

    const extractPhoneNumbers = (data: any[][]) => {
        if (data.length === 0) return;
        
        const headers = data[0];
        const phoneColumnIndex = headers.findIndex((header: string) => 
            header.toLowerCase().includes('phone') || 
            header.toLowerCase().includes('number') ||
            header.toLowerCase().includes('contact')
        );
        
        if (phoneColumnIndex !== -1) {
            const numbers = data.slice(1)
                .map(row => row[phoneColumnIndex])
                .filter(cell => cell && cell.toString().trim() !== '')
                .map(cell => cell.toString());
            setPhoneNumbers(numbers);
        }
    }

    const changeSheet = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.value;
        const selectedSheetObj = sheets.find((sheet: any) => sheet.name === name);
        if (selectedSheetObj) {
            setSelectedSheet(selectedSheetObj.id);
            setSelectedSheetName(name);
            setSheetData([]);
            setPhoneNumbers([]);
        }
    }

    const handleCall = () => {
        // Implement call functionality here
        console.log("Initiating calls to:", phoneNumbers);
        alert(`Ready to call ${phoneNumbers.length} numbers`);
    }

    useEffect(() => {
        ListSheets();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="text-2xl font-bold">Google Sheet Integration</div>
            
            {/* Select Sheet Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Select Sheet</h3>
                    <p className="text-sm text-gray-600 mt-1">Choose a Google Sheet to read data from</p>
                </div>
                <div className="p-6">
                    <div className="flex items-center space-x-4">
                        <select 
                            onChange={changeSheet}
                            value={selectedSheetName}
                            className="w-[300px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="">Select a sheet</option>
                            {sheets.map((sheet: any) => (
                                <option key={sheet.id} value={sheet.name}>
                                    {sheet.name}
                                </option>
                            ))}
                        </select>
                        <Button 
                            onClick={readSheet} 
                            disabled={!selectedSheet || loading}
                            className="min-w-[120px]"
                        >
                            {loading ? 'Reading...' : 'Read Sheet'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Sheet Data Table */}
            {sheetData.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Sheet Data</h3>
                        <p className="text-sm text-gray-600 mt-1">Data from {selectedSheetName}</p>
                    </div>
                    <div className="p-6">
                        <div className="rounded-md border border-gray-200 overflow-auto max-h-[400px]">
                            <table className="w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        {sheetData[0]?.map((header: string, index: number) => (
                                            <th 
                                                key={index} 
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sheetData.slice(1).map((row: any[], rowIndex: number) => (
                                        <tr key={rowIndex} className="hover:bg-gray-50">
                                            {row.map((cell: any, cellIndex: number) => (
                                                <td 
                                                    key={cellIndex}
                                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200"
                                                >
                                                    {cell || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Phone Numbers Section */}
            {phoneNumbers.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            <Phone className="h-5 w-5 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Phone Numbers</h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            Extracted {phoneNumbers.length} phone numbers from the sheet
                        </p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {phoneNumbers.map((number, index) => (
                                <div 
                                    key={index} 
                                    className="p-3 bg-gray-50 rounded-md border border-gray-200 text-sm font-mono"
                                >
                                    {number}
                                </div>
                            ))}
                        </div>
                        <Button 
                            onClick={handleCall}
                            className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 text-base"
                        >
                            <Phone className="h-4 w-4" />
                            <span>Call All Numbers ({phoneNumbers.length})</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default page