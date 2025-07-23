import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Globe } from "lucide-react";

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  city: string;
  country: string;
}

interface TimezoneDropdownProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

// Major timezones with GMT offsets and primary cities
const TIMEZONES: TimezoneOption[] = [
  {
    value: "Pacific/Midway",
    label: "GMT-11:00 Midway",
    offset: "-11:00",
    city: "Midway",
    country: "US",
  },
  {
    value: "Pacific/Honolulu",
    label: "GMT-10:00 Hawaii Time",
    offset: "-10:00",
    city: "Honolulu",
    country: "US",
  },
  {
    value: "America/Anchorage",
    label: "GMT-09:00 Alaska Time",
    offset: "-09:00",
    city: "Anchorage",
    country: "US",
  },
  {
    value: "America/Los_Angeles",
    label: "GMT-08:00 Pacific Time",
    offset: "-08:00",
    city: "Los Angeles",
    country: "US",
  },
  {
    value: "America/Denver",
    label: "GMT-07:00 Mountain Time",
    offset: "-07:00",
    city: "Denver",
    country: "US",
  },
  {
    value: "America/Chicago",
    label: "GMT-06:00 Central Time",
    offset: "-06:00",
    city: "Chicago",
    country: "US",
  },
  {
    value: "America/New_York",
    label: "GMT-05:00 Eastern Time",
    offset: "-05:00",
    city: "New York",
    country: "US",
  },
  {
    value: "America/Caracas",
    label: "GMT-04:00 Venezuela Time",
    offset: "-04:00",
    city: "Caracas",
    country: "VE",
  },
  {
    value: "America/Sao_Paulo",
    label: "GMT-03:00 Brazil Time",
    offset: "-03:00",
    city: "São Paulo",
    country: "BR",
  },
  {
    value: "Atlantic/South_Georgia",
    label: "GMT-02:00 South Georgia",
    offset: "-02:00",
    city: "South Georgia",
    country: "GS",
  },
  {
    value: "Atlantic/Azores",
    label: "GMT-01:00 Azores",
    offset: "-01:00",
    city: "Azores",
    country: "PT",
  },
  {
    value: "Europe/London",
    label: "GMT+00:00 Greenwich Mean Time",
    offset: "+00:00",
    city: "London",
    country: "UK",
  },
  {
    value: "Europe/Paris",
    label: "GMT+01:00 Central European Time",
    offset: "+01:00",
    city: "Paris",
    country: "FR",
  },
  {
    value: "Europe/Athens",
    label: "GMT+02:00 Eastern European Time",
    offset: "+02:00",
    city: "Athens",
    country: "GR",
  },
  {
    value: "Europe/Moscow",
    label: "GMT+03:00 Moscow Time",
    offset: "+03:00",
    city: "Moscow",
    country: "RU",
  },
  {
    value: "Asia/Dubai",
    label: "GMT+04:00 Gulf Standard Time",
    offset: "+04:00",
    city: "Dubai",
    country: "AE",
  },
  {
    value: "Asia/Kolkata",
    label: "GMT+05:30 India Standard Time",
    offset: "+05:30",
    city: "Mumbai",
    country: "IN",
  },
  {
    value: "Asia/Dhaka",
    label: "GMT+06:00 Bangladesh Time",
    offset: "+06:00",
    city: "Dhaka",
    country: "BD",
  },
  {
    value: "Asia/Bangkok",
    label: "GMT+07:00 Indochina Time",
    offset: "+07:00",
    city: "Bangkok",
    country: "TH",
  },
  {
    value: "Asia/Shanghai",
    label: "GMT+08:00 China Standard Time",
    offset: "+08:00",
    city: "Shanghai",
    country: "CN",
  },
  {
    value: "Asia/Tokyo",
    label: "GMT+09:00 Japan Standard Time",
    offset: "+09:00",
    city: "Tokyo",
    country: "JP",
  },
  {
    value: "Australia/Sydney",
    label: "GMT+10:00 Australian Eastern Time",
    offset: "+10:00",
    city: "Sydney",
    country: "AU",
  },
  {
    value: "Pacific/Noumea",
    label: "GMT+11:00 New Caledonia Time",
    offset: "+11:00",
    city: "Noumea",
    country: "NC",
  },
  {
    value: "Pacific/Auckland",
    label: "GMT+12:00 New Zealand Time",
    offset: "+12:00",
    city: "Auckland",
    country: "NZ",
  },
  {
    value: "Pacific/Tongatapu",
    label: "GMT+13:00 Tonga Time",
    offset: "+13:00",
    city: "Tongatapu",
    country: "TO",
  },
];

const TimezoneDropdown: React.FC<TimezoneDropdownProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select timezone...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTimezones, setFilteredTimezones] = useState(TIMEZONES);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter timezones based on search term
  useEffect(() => {
    const filtered = TIMEZONES.filter(
      (tz) =>
        tz.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tz.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tz.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tz.offset.includes(searchTerm)
    );
    setFilteredTimezones(filtered);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (timezone: TimezoneOption) => {
    onChange(timezone.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  const getSelectedTimezone = () => {
    return TIMEZONES.find((tz) => tz.value === value);
  };

  const selectedTimezone = getSelectedTimezone();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full p-3 border border-gray-300 rounded-[6px] bg-white dark:bg-gray-900 text-left flex items-center justify-between text-sm ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "hover:border-gray-400"
        }`}
      >
        <div className="flex items-center">
          <Globe className="w-4 h-4 mr-2 text-gray-400" />
          <span
            className={selectedTimezone ? "text-gray-900" : "text-gray-500"}
          >
            {selectedTimezone ? selectedTimezone.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-[6px] shadow-lg max-h-60 overflow-hidden custom-scrollbar">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 " />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by city, country, or offset..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-[6px] text-sm dark:bg-gray-900 dark:text-gray-500"
              />
            </div>
          </div>

          {/* Timezone list */}
          <div className="max-h-48 overflow-y-auto">
            {filteredTimezones.length > 0 ? (
              filteredTimezones.map((timezone) => (
                <button
                  key={timezone.value}
                  type="button"
                  onClick={() => handleSelect(timezone)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                    value === timezone.value
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm dark:text-gray-500">
                        {timezone.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {timezone.city}, {timezone.country}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {timezone.offset}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                No timezones found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimezoneDropdown;
