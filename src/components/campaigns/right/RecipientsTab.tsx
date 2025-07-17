"use client";
import React, { useState, useRef, useEffect } from "react";
import { Upload, FileText, Table, Phone, Trash2 } from "lucide-react";
import * as Papa from "papaparse";
import { Campaign } from "../types";
import { toast } from "react-hot-toast";

interface RecipientsTabProps {
  campaign: Campaign;
  setCampaign: (campaign: Campaign) => void;
  isEditable: boolean;
}

type Contact = {
  phonenumber: string;
  metadata: {
    follow_up_date_time: string;
    [key: string]: any;
  };
};

const RecipientsTab: React.FC<RecipientsTabProps> = ({
  campaign,
  setCampaign,
  isEditable,
}) => {
  // Initialize activeTab based on campaign's recipientFileProvider or default to 'csv'
  const [activeTab, setActiveTab] = useState<"csv" | "googleSheet">(
    campaign.recipientFileProvider || "csv"
  );
  const [googleSheetIntegrated, setGoogleSheetIntegrated] = useState(false);

  // CSV Upload states
  const [fileName, setFileName] = useState<string | null>(
    campaign.recipientFileName || null
  );
  const [extractedPhones, setExtractedPhones] = useState<string[]>([]);
  const [contact, setContact] = useState<Contact[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Google Sheet states
  const [sheets, setSheets] = useState<any[]>([]);
  const [selectedSheet, setSelectedSheet] = useState(
    campaign.recipientFileId || ""
  );
  const [selectedSheetName, setSelectedSheetName] = useState(
    campaign.recipientFileName || ""
  );
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [sheetPhoneNumbers, setSheetPhoneNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // CSV Upload functionality (existing from CampaignGeneralTab)
  function transformDynamicData(data: any): { contacts: Contact[] } {
    return {
      contacts: data.map((row: any) => ({
        phonenumber: row.phone || row.phonenumber || Object.values(row)[0],
        metadata: {
          follow_up_date_time: new Date().toISOString(),
          ...row,
        },
      })),
    };
  }

  const extractPhoneNumbers = (data: any[]) => {
    const phoneRegex =
      /(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d\-.\s]{7,13}/g;
    const phoneNumbers: string[] = [];

    data.forEach((row) => {
      Object.values(row).forEach((value) => {
        const matches = String(value).match(phoneRegex);
        if (matches) {
          matches.forEach((phone) => {
            const cleaned = phone.replace(/[^+\d]/g, "");
            if (cleaned.length >= 10) {
              phoneNumbers.push(cleaned);
            }
          });
        }
      });
    });
    return [...new Set(phoneNumbers)];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("📁 File selected:", file.name);
      setFileName(file.name);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("📊 CSV parse results:", results.data);

          const temp = transformDynamicData(results.data);
          console.log("🔄 Transformed contacts:", temp.contacts);

          const phoneNumbers = extractPhoneNumbers(results.data);
          console.log("📞 Extracted phone numbers:", phoneNumbers);

          setContact(temp.contacts);
          setExtractedPhones(phoneNumbers);

          // Update campaign with CSV data and provider info
          const updatedCampaign = {
            ...campaign,
            recipients: phoneNumbers,
            contacts: temp.contacts,
            recipientFileProvider: "csv" as const,
            recipientFileName: file.name,
            recipientFile: file.name,
            recipientFileLink: undefined,
            recipientFileId: undefined,
          };
          console.log(
            "💾 Updating campaign with CSV recipients:",
            updatedCampaign
          );
          setCampaign(updatedCampaign);
        },
        error: (err) => {
          console.error("❌ Error parsing file:", err);
        },
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "text/csv") {
      setFileName(file.name);
      const fakeEvent = { target: { files: [file] } } as any;
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  // Google Sheet functionality
  const ListSheets = async () => {
    try {
      const res = await fetch("/api/integration/googleSheet/listSheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 404) {
        setGoogleSheetIntegrated(false);
        // toast.error('No integration with Google Sheet. Please integrate Google Sheet first');
        return;
      }
      const data = await res.json();
      setSheets(data.files);
      setGoogleSheetIntegrated(true);
      console.log("Google Sheets:", data);
    } catch (error: any) {
      console.error("Error fetching sheets:", error);
      setGoogleSheetIntegrated(false);
    }
  };

  const readSheet = async () => {
    if (!selectedSheet) return;

    setLoading(true);
    try {
      const res = await fetch("/api/integration/googleSheet/readSheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadsheetId: selectedSheet,
          range: "Sheet1!A:Z",
        }),
      });
      const data = await res.json();
      console.log("Sheet data", data);

      if (data.values && data.values.length > 0) {
        setSheetData(data.values);
        const phoneNumbers = extractPhoneNumbersFromSheet(data.values);
        setSheetPhoneNumbers(phoneNumbers);

        // Transform sheet data to contacts format
        const headers = data.values[0];
        const rows = data.values.slice(1);
        const contacts = rows
          .map((row: any[]) => {
            const rowData: any = {};
            headers.forEach((header: string, index: number) => {
              rowData[header] = row[index] || "";
            });

            return {
              phonenumber: phoneNumbers[rows.indexOf(row)] || "",
              metadata: {
                follow_up_date_time: new Date().toISOString(),
                ...rowData,
              },
            };
          })
          .filter((contact: Contact) => contact.phonenumber);

        // Find the selected sheet info
        const selectedSheetObj = sheets.find(
          (sheet: any) => sheet.id === selectedSheet
        );

        console.log("🔍 Debug Google Sheet variables:", {
          selectedSheet,
          selectedSheetName,
          selectedSheetObj,
          webViewLink: selectedSheetObj?.webViewLink,
          sheets: sheets.length,
        });

        // Update campaign with sheet data and provider info
        const updatedCampaign = {
          ...campaign,
          recipients: phoneNumbers,
          contacts: contacts,
          recipientFileProvider: "googleSheet" as const,
          recipientFileName: selectedSheetName,
          recipientFile: selectedSheetName,
          recipientFileLink: selectedSheetObj?.webViewLink || undefined,
          recipientFileId: selectedSheet,
        };

        console.log("🔍 Debug updatedCampaign:", {
          recipientFileProvider: updatedCampaign.recipientFileProvider,
          recipientFileName: updatedCampaign.recipientFileName,
          recipientFile: updatedCampaign.recipientFile,
          recipientFileLink: updatedCampaign.recipientFileLink,
          recipientFileId: updatedCampaign.recipientFileId,
        });

        setCampaign(updatedCampaign);
        setGoogleSheetIntegrated(true);

        toast.success(
          `Successfully imported ${phoneNumbers.length} phone numbers from Google Sheet`
        );
      }
    } catch (error: any) {
      if (error.status === 404) {
        setGoogleSheetIntegrated(false);
        toast.error("No sheet selected. Please select a sheet first");
        return;
      }
      console.error("Error reading sheet:", error);
      toast.error("Failed to read sheet data");
    }
    setLoading(false);
  };

  const extractPhoneNumbersFromSheet = (data: any[][]) => {
    if (data.length === 0) return [];

    const headers = data[0];
    const phoneColumnIndex = headers.findIndex(
      (header: string) =>
        header.toLowerCase().includes("phone") ||
        header.toLowerCase().includes("number") ||
        header.toLowerCase().includes("contact")
    );

    if (phoneColumnIndex !== -1) {
      return data
        .slice(1)
        .map((row) => row[phoneColumnIndex])
        .filter((cell) => cell && cell.toString().trim() !== "")
        .map((cell) => cell.toString());
    }

    // If no phone column found, try to extract from all data
    return extractPhoneNumbers(
      data.slice(1).map((row) => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      })
    );
  };

  const changeSheet = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    const selectedSheetObj = sheets.find((sheet: any) => sheet.name === name);
    if (selectedSheetObj) {
      setSelectedSheet(selectedSheetObj.id);
      setSelectedSheetName(name);
      setSheetData([]);
      setSheetPhoneNumbers([]);
    }
  };

  const handleDeleteFile = () => {
    // Clear all file-related data
    setFileName(null);
    setExtractedPhones([]);
    setContact([]);
    setSheetData([]);
    setSheetPhoneNumbers([]);
    setSelectedSheet("");
    setSelectedSheetName("");

    // Update campaign to remove file data
    const updatedCampaign = {
      ...campaign,
      recipients: [],
      contacts: [],
      recipientFileProvider: undefined,
      recipientFileName: "",
      recipientFile: "",
      recipientFileLink: undefined,
      recipientFileId: undefined,
    };

    console.log("🗑️ Deleting file, campaign before:", campaign);
    console.log("🗑️ Deleting file, campaign after:", updatedCampaign);

    setCampaign(updatedCampaign);
    toast.success("File removed successfully");
  };

  // Handle tab switching with provider consistency
  const handleTabSwitch = (tab: "csv" | "googleSheet") => {
    setActiveTab(tab);

    // Update campaign provider when switching tabs
    const updatedCampaign = {
      ...campaign,
      recipientFileProvider: tab,
      // Reset provider-specific fields when switching
      recipientFileId:
        tab === "googleSheet" ? selectedSheet || undefined : undefined,
      recipientFileName:
        tab === "csv" ? fileName || undefined : selectedSheetName || undefined,
    };
    // setCampaign(updatedCampaign);
  };

  // Initialize data on component mount
  useEffect(() => {
    ListSheets();

    console.log("📋 RecipientsTab initialized with campaign:", {
      recipients: campaign.recipients?.length,
      recipientFileProvider: campaign.recipientFileProvider,
      recipientFileName: campaign.recipientFileName,
      recipientFile: campaign.recipientFile,
    });

    // Initialize extracted phones from existing recipients if available
    if (campaign.recipients && campaign.recipients.length > 0) {
      if (
        campaign.recipientFileProvider === "csv" ||
        !campaign.recipientFileProvider
      ) {
        setExtractedPhones(campaign.recipients);
      } else if (campaign.recipientFileProvider === "googleSheet") {
        setSheetPhoneNumbers(campaign.recipients);
      }
    }
  }, []);

  // Update tab when campaign provider changes
  useEffect(() => {
    if (
      campaign.recipientFileProvider &&
      campaign.recipientFileProvider !== activeTab
    ) {
      setActiveTab(campaign.recipientFileProvider);
    }
  }, [campaign.recipientFileProvider]);

  // Get current phone numbers based on provider
  const getCurrentPhoneNumbers = () => {
    const provider = campaign.recipientFileProvider || "csv";

    if (provider === "csv") {
      return extractedPhones.length > 0
        ? extractedPhones
        : campaign.recipients || [];
    } else {
      return sheetPhoneNumbers.length > 0
        ? sheetPhoneNumbers
        : campaign.recipients || [];
    }
  };

  const currentPhoneNumbers = getCurrentPhoneNumbers();

  return (
    <div className="space-y-4">
      {/* Show file name if not editable and file exists */}
      {!isEditable && campaign.recipientFileName && (
        <div className="p-2 bg-gray-50 border border-gray-200 rounded-[6px] text-sm text-gray-700 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span className="truncate">{campaign.recipientFileName}</span>
        </div>
      )}
      {campaign.status === "draft" && (
        <div>
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => handleTabSwitch("csv")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "csv"
                    ? "border-indigo-500 text-indigo-600 cursor-pointer"
                    : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Upload CSV</span>
                  {campaign.recipientFileProvider === "csv" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => handleTabSwitch("googleSheet")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "googleSheet"
                    ? "border-indigo-500 text-indigo-600 cursor-pointer"
                    : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Table className="w-4 h-4" />
                  <span>Google Sheet</span>
                  {campaign.recipientFileProvider === "googleSheet" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>

          {/* CSV Upload Tab */}
          {activeTab === "csv" && (
            <div className="space-y-4 ">
              {isEditable && (
                <div className="pt-4">
                  {fileName ? (
                    // Show file name with delete button when file is uploaded
                    <div className="flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-[6px] bg-gray-50 w-1/3 mx-auto">
                      <span className="text-green-600 font-medium">
                        {fileName}
                      </span>
                      <button
                        onClick={handleDeleteFile}
                        className="group p-1 text-red-500 rounded transition-colors"
                        title="Remove file"
                      >
                        <div className="w-6 h-6 relative pt-1">
                          <svg
                            viewBox="0 0 30 30"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-full h-full text-current"
                          >
                            {/* Lid */}
                            <g className="transition-transform duration-300 ease-in-out group-hover:-translate-y-0.5 group-hover:-rotate-20 origin-center">
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <path d="M3 6h18" />
                            </g>

                            {/* Body */}
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />

                            {/* Trash lines */}
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  ) : (
                    // Show upload interface when no file is present
                    <label
                      htmlFor="recipientsFile"
                      className="block p-2 border-1 border-dashed border-gray-500 rounded-[6px] text-center cursor-pointer hover:border-indigo-400 transition-colors w-1/3 mx-auto"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <div className="flex flex-col items-center">
                        <Upload className="w-5 h-5 text-gray-400 mb-2" />
                        <span className="text-gray-500 text-sm font-light">
                          Drop CSV file here or click to upload
                        </span>
                      </div>
                      <input
                        type="file"
                        id="recipientsFile"
                        ref={fileInputRef}
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                  {extractedPhones.length > 0 && (
                    <div className="mt-2 px-2 pt-2 flex justify-center">
                      <span className="text-sm text-green-700 font-medium">
                        ✓ {extractedPhones.length} phone numbers extracted
                        successfully
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Google Sheet Tab */}
          {activeTab === "googleSheet" && googleSheetIntegrated ? (
            <div className="space-y-4 ">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">
                    Select Google Sheet
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Choose a Google Sheet to import recipients from
                  </p>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    <select
                      onChange={changeSheet}
                      value={selectedSheetName}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
                      disabled={!isEditable}
                    >
                      <option value="">Select a sheet</option>
                      {sheets.map((sheet: any) => (
                        <option key={sheet.id} value={sheet.name}>
                          {sheet.name}
                        </option>
                      ))}
                    </select>
                    {isEditable && (
                      <button
                        onClick={readSheet}
                        disabled={!selectedSheet || loading}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Reading..." : "Import"}
                      </button>
                    )}
                  </div>
                  {sheetPhoneNumbers.length > 0 && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <span className="text-sm text-green-700 font-medium">
                        ✓ {sheetPhoneNumbers.length} phone numbers imported
                        successfully
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed Size Scrollable Table for Google Sheet Data */}
              {sheetData.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">
                      Sheet Preview
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Data from {selectedSheetName}
                    </p>
                  </div>
                  <div className="p-1">
                    {/* Fixed size container with both horizontal and vertical scrolling */}
                    <div className="w-full h-[160px] border border-gray-200 rounded-md overflow-auto">
                      <table className="min-w-full table-auto">
                        <thead className="bg-gray-50 sticky top-0 border-b border-gray-200">
                          <tr>
                            {sheetData[0]?.map(
                              (header: string, index: number) => (
                                <th
                                  key={index}
                                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap max-w-[80px] min-w-[60px]"
                                >
                                  <div className="truncate">{header}</div>
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sheetData
                            .slice(1)
                            .map((row: any[], rowIndex: number) => (
                              <tr key={rowIndex} className="hover:bg-gray-50">
                                {row.map((cell: any, cellIndex: number) => (
                                  <td
                                    key={cellIndex}
                                    className="px-2 py-2 text-xs text-gray-900 border-b border-gray-200 max-w-[80px] min-w-[60px]"
                                  >
                                    <div
                                      className="truncate"
                                      title={cell?.toString() || "-"}
                                    >
                                      {cell || "-"}
                                    </div>
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
            </div>
          ) : activeTab === "googleSheet" && !googleSheetIntegrated ? (
            <div className="p-4 text-center text-gray-500 border border-gray-200 rounded-md bg-gray-50">
              <Table className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm">
                No Google Sheet integrated. Please integrate Google Sheet first.
              </p>
            </div>
          ) : null}

          {/* Phone Numbers Display */}
          {/* {currentPhoneNumbers.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-600" />
              <h4 className="text-sm font-medium text-gray-900">
                Extracted Phone Numbers ({currentPhoneNumbers.length})
              </h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              From {campaign.recipientFileProvider === 'googleSheet' ? 'Google Sheet' : 'CSV file'}
            </p>
          </div>
          <div className="p-4">
            <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2 bg-gray-50">
              {currentPhoneNumbers.slice(0, 5).map((phone, index) => (
                <div key={index} className="text-xs text-gray-700 py-1 font-mono">
                  {phone}
                </div>
              ))}
              {currentPhoneNumbers.length > 5 && (
                <div className="text-xs text-gray-500 italic">
                  ... and {currentPhoneNumbers.length - 5} more
                </div>
              )}
            </div>
          </div>
        </div>
      )} */}

          {/* No recipients message */}
          {currentPhoneNumbers.length === 0 && (
            <div className="px-2 pt-2 text-center text-gray-500">
              {/* <Phone className="w-8 h-8 text-gray-400 mx-auto mb-2" /> */}
              <p className="text-sm">
                No recipients added yet.{" "}
                {activeTab === "csv"
                  ? "Upload a CSV file"
                  : "Import from Google Sheet"}{" "}
                to add recipients.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipientsTab;
