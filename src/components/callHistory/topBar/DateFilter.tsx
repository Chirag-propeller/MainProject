import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
} from "lucide-react";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  isEqual,
  isBefore,
  isAfter,
  isSameMonth,
  parse,
  startOfDay,
  endOfDay,
  sub,
} from "date-fns";

export type DateRangeFilter = {
  startDate: Date | null;
  endDate: Date | null;
};

interface DateFilterProps {
  dateRange: DateRangeFilter;
  setDateRange: React.Dispatch<React.SetStateAction<DateRangeFilter>>;
}

const DateFilter: React.FC<DateFilterProps> = ({ dateRange, setDateRange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempDateRange, setTempDateRange] =
    useState<DateRangeFilter>(dateRange);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close the filter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset temp date range when opening the dropdown
  useEffect(() => {
    if (isOpen) {
      setTempDateRange(dateRange);
    }
  }, [isOpen, dateRange]);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const handleDateClick = (date: Date) => {
    const selectedDate = startOfDay(date);

    if (
      !tempDateRange.startDate ||
      (tempDateRange.startDate && tempDateRange.endDate)
    ) {
      // Start a new range
      setTempDateRange({
        startDate: selectedDate,
        endDate: null,
      });
    } else {
      // Complete the range
      if (isBefore(selectedDate, tempDateRange.startDate)) {
        setTempDateRange({
          startDate: selectedDate,
          endDate: endOfDay(tempDateRange.startDate),
        });
      } else {
        setTempDateRange({
          startDate: tempDateRange.startDate,
          endDate: endOfDay(selectedDate),
        });
      }
    }
  };

  // Time period presets
  const applyTimePreset = (preset: string) => {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = new Date();

    switch (preset) {
      case "today":
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate = endOfDay(startDate);
        break;
      // case 'thisYear':
      //   startDate = new Date(now);
      //   startDate.setHours(0, 0, 0, 0);
      //   startDate = sub(startDate, { days: 1 });
      //   endDate = new Date(startDate);
      //   break;
      case "7days":
        startDate = sub(new Date(now), { days: 7 });
        endDate = endOfDay(now);
        break;
      case "30days":
        startDate = sub(new Date(now), { days: 30 });
        endDate = endOfDay(now);
        break;
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = endOfDay(now);
        break;
      case "lastMonth":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0));
        break;
      case "thisYear":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = endOfDay(now);
        // endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        break;
      default:
        break;
    }

    if (startDate) {
      setTempDateRange({
        startDate,
        endDate,
      });
    }
  };

  const handleMouseEnter = (date: Date) => {
    setHoverDate(date);
  };

  const handleMouseLeave = () => {
    setHoverDate(null);
  };

  const isDateInRange = (date: Date) => {
    if (!tempDateRange.startDate) return false;
    if (tempDateRange.endDate) {
      return (
        isAfter(date, tempDateRange.startDate) &&
        isBefore(date, tempDateRange.endDate)
      );
    }
    if (hoverDate && isAfter(hoverDate, tempDateRange.startDate)) {
      return (
        isAfter(date, tempDateRange.startDate) && isBefore(date, hoverDate)
      );
    }
    return false;
  };

  const isStartDate = (date: Date) => {
    return (
      tempDateRange.startDate &&
      isEqual(startOfDay(date), startOfDay(tempDateRange.startDate))
    );
  };

  const isEndDate = (date: Date) => {
    return (
      tempDateRange.endDate &&
      isEqual(startOfDay(date), startOfDay(tempDateRange.endDate))
    );
  };

  const applyDateRange = () => {
    setDateRange(tempDateRange);
    setIsOpen(false);
  };

  const cancelSelection = () => {
    setTempDateRange(dateRange);
    setIsOpen(false);
  };

  const clearDateRange = () => {
    setTempDateRange({ startDate: null, endDate: null });
    setDateRange({ startDate: null, endDate: null });
    setIsOpen(false);
  };

  const getDateRangeText = () => {
    if (!dateRange.startDate) {
      return "Select date range";
    }

    if (dateRange.startDate && !dateRange.endDate) {
      return format(dateRange.startDate, "MMM dd, yyyy");
    }

    return `${format(dateRange.startDate, "MMM dd, yyyy")} - ${format(dateRange.endDate!, "MMM dd, yyyy")}`;
  };

  const buildCalendar = (baseDate: Date) => {
    const firstDay = startOfMonth(baseDate);
    const lastDay = endOfMonth(baseDate);
    const days = [];

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    let dayOfWeek = firstDay.getDay();

    // Add empty cells for days before the first of the month
    for (let i = 0; i < dayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(baseDate.getFullYear(), baseDate.getMonth(), day));
    }

    return days;
  };

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={toggleFilter}
        className={`flex items-center gap-2 px-3 py-2 rounded-[4px] text-sm font-medium transition-colors ${
          isOpen || dateRange.startDate !== null
            ? "bg-indigo-100 text-indigo-700"
            : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 shadow-sm"
        }`}
      >
        <CalendarIcon size={16} />
        <span>{getDateRangeText()}</span>
        {dateRange.startDate !== null && (
          <X
            size={14}
            className="text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              clearDateRange();
            }}
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-lg z-50 border border-gray-200 p-4 w-[800px]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Select Date Range</h4>
            {tempDateRange.startDate && (
              <div className="text-sm text-gray-600">
                {tempDateRange.startDate &&
                  format(tempDateRange.startDate, "MMM dd, yyyy")}
                {tempDateRange.endDate &&
                  ` - ${format(tempDateRange.endDate, "MMM dd, yyyy")}`}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {/* Time period presets */}
            <div className="w-[160px] border-r pr-4">
              <div className="flex items-center gap-1 mb-3">
                <Clock size={14} className="text-gray-500" />
                <h4 className="text-sm font-medium text-gray-700">
                  Time Periods
                </h4>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => applyTimePreset("today")}
                  className="w-full text-left px-3 py-2 rounded text-sm font-medium bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  Today
                </button>

                <button
                  onClick={() => applyTimePreset("7days")}
                  className="w-full text-left px-3 py-2 rounded text-sm font-medium bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => applyTimePreset("30days")}
                  className="w-full text-left px-3 py-2 rounded text-sm font-medium bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => applyTimePreset("thisMonth")}
                  className="w-full text-left px-3 py-2 rounded text-sm font-medium bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  This Month
                </button>
                <button
                  onClick={() => applyTimePreset("lastMonth")}
                  className="w-full text-left px-3 py-2 rounded text-sm font-medium bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  Last Month
                </button>
                <button
                  onClick={() => applyTimePreset("thisYear")}
                  className="w-full text-left px-3 py-2 rounded text-sm font-medium bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  This Year
                </button>
              </div>
            </div>

            {/* Calendar display */}
            <div className="flex flex-1 gap-4">
              {/* First month */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={prevMonth}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft size={16} className="text-gray-600" />
                  </button>
                  <h4 className="text-sm font-medium text-gray-700">
                    {format(currentMonth, "MMMM yyyy")}
                  </h4>
                  <div className="w-6"></div> {/* Spacer for alignment */}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-xs text-center text-gray-500 py-1 font-medium"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Calendar days */}
                  {buildCalendar(currentMonth).map((date, i) => (
                    <div
                      key={i}
                      className={`
                        relative text-center p-1 text-sm ${!date ? "" : "cursor-pointer hover:bg-gray-50"}
                        ${date && isStartDate(date) ? "bg-indigo-600 text-white rounded-l-md" : ""}
                        ${date && isEndDate(date) ? "bg-indigo-600 text-white rounded-r-md" : ""}
                        ${date && isDateInRange(date) ? "bg-indigo-100" : ""}
                      `}
                      onClick={() => date && handleDateClick(date)}
                      onMouseEnter={() => date && handleMouseEnter(date)}
                      onMouseLeave={() => date && handleMouseLeave()}
                    >
                      {date ? date.getDate() : ""}
                    </div>
                  ))}
                </div>
              </div>

              {/* Second month */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <div className="w-6"></div> {/* Spacer for alignment */}
                  <h4 className="text-sm font-medium text-gray-700">
                    {format(addMonths(currentMonth, 1), "MMMM yyyy")}
                  </h4>
                  <button
                    onClick={nextMonth}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronRight size={16} className="text-gray-600" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-xs text-center text-gray-500 py-1 font-medium"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Calendar days */}
                  {buildCalendar(addMonths(currentMonth, 1)).map((date, i) => (
                    <div
                      key={i}
                      className={`
                        relative text-center p-1 text-sm ${!date ? "" : "cursor-pointer hover:bg-gray-50"}
                        ${date && isStartDate(date) ? "bg-indigo-600 text-white rounded-l-md" : ""}
                        ${date && isEndDate(date) ? "bg-indigo-600 text-white rounded-r-md" : ""}
                        ${date && isDateInRange(date) ? "bg-indigo-100" : ""}
                      `}
                      onClick={() => date && handleDateClick(date)}
                      onMouseEnter={() => date && handleMouseEnter(date)}
                      onMouseLeave={() => date && handleMouseLeave()}
                    >
                      {date ? date.getDate() : ""}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={cancelSelection}
              className="px-3 py-1.5 rounded text-sm text-gray-600 hover:bg-gray-100 border border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={applyDateRange}
              className="px-3 py-1.5 rounded text-sm bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={!tempDateRange.startDate}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
