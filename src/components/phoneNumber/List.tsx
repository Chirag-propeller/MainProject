import { Trash2 } from "lucide-react"; // Cleaner trash icon

import React, { useEffect, useState } from "react";

// interface Phone {
//   phoneNumber : string;
// }

interface Phone {
  phoneNumber: string;
  name?: string;
  createdAt?: string;
  // Add other fields here
}

const List = ({
  refreshTrigger,
  selectedPhoneNumber,
  setSelectedPhoneRecord,
}: {
  refreshTrigger: boolean;
  setSelectedPhoneRecord: (record: Phone | null) => void;
  selectedPhoneNumber: string;
}) => {
  const [phoneNumber, setPhoneNumber] = useState<Phone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleDelete = async (number: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents selecting the number when clicking delete

    const confirmed = confirm(
      `Are you sure you want to delete number ${number}?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch("/api/phoneNumber/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: number }),
      });

      if (res.ok) {
        setPhoneNumber((prev) => prev.filter((p) => p.phoneNumber !== number));
        if (selectedPhoneNumber === number) {
          setSelectedPhoneRecord(null);
        }
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete phone number.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong.");
    }
  };

  const fetchPhone = async () => {
    try {
      const res = await fetch("/api/phoneNumber/get");
      const data = await res.json();
      console.log(data);
      setPhoneNumber(data || []);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
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
    );
  }

  if (phoneNumber.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        No phone numbers found. Click Create to add your first phone number.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {phoneNumber.map((phone) => {
        const isActive = phone.phoneNumber === selectedPhoneNumber;
        return (
          <div
            key={phone.phoneNumber}
            className={`group p-2 px-2 border rounded-[6px] mb-2 hover:border-indigo-500 transition-colors cursor-pointer ${
              isActive
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-400"
                : "border-gray-200 dark:border-gray-700 dark:bg-gray-900"
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
                className="ml-2 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
              >
                <div className="w-6 h-6 relative">
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
          </div>
        );
      })}
    </div>
  );
};

export default List;
