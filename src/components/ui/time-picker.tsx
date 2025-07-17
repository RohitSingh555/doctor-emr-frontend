"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Clock, X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import "react-datepicker/dist/react-datepicker.css";

interface TimePickerProps {
  value?: Date | null;
  onChange: (time: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minTime?: Date;
  maxTime?: Date;
  timeIntervals?: number;
  timeFormat?: string;
  showSeconds?: boolean;
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  className,
  disabled = false,
  minTime,
  maxTime,
  timeIntervals = 15,
  timeFormat = "h:mm aa",
  showSeconds = false
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Create a base date for time-only selection (today's date)
  const getBaseDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  // Convert time-only value to full date for the picker
  const getTimeValue = () => {
    if (!value) return null;
    const baseDate = getBaseDate();
    return new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      value.getHours(),
      value.getMinutes(),
      value.getSeconds()
    );
  };

  // Handle time selection
  const handleTimeChange = (selectedTime: Date | null) => {
    if (!selectedTime) {
      onChange(null);
      return;
    }

    // Create a new date object with just the time components
    const timeOnly = new Date();
    timeOnly.setHours(selectedTime.getHours());
    timeOnly.setMinutes(selectedTime.getMinutes());
    timeOnly.setSeconds(selectedTime.getSeconds());
    timeOnly.setMilliseconds(0);

    onChange(timeOnly);
  };

  const CustomInput = ({ value, onClick, onChange, ...props }: any) => (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full justify-between font-normal bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 transition-all duration-200",
        "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        "text-left px-4 py-3 h-auto min-h-[44px]",
        value ? "text-gray-900" : "text-gray-500",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
        </div>
        <span className="truncate">
          {value || placeholder}
        </span>
      </div>
      {value && (
        <div
          className="h-6 w-6 p-0 hover:bg-gray-100 rounded flex items-center justify-center cursor-pointer transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onChange(null);
          }}
        >
          <X className="w-3 h-3" />
        </div>
      )}
    </Button>
  );

  return (
    <div className="relative">
      <DatePicker
        selected={getTimeValue()}
        onChange={handleTimeChange}
        customInput={<CustomInput />}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={timeIntervals}
        timeCaption="Time"
        dateFormat={showSeconds ? "h:mm:ss aa" : timeFormat}
        minTime={minTime}
        maxTime={maxTime}
        open={isOpen}
        onCalendarOpen={() => setIsOpen(true)}
        onCalendarClose={() => setIsOpen(false)}
        popperClassName="z-50"
        popperPlacement="bottom-start"
        calendarClassName="shadow-2xl border-0 rounded-xl overflow-hidden"
        timeClassName={(date) =>
          cn(
            "hover:bg-blue-50 transition-colors duration-150",
            date.getTime() === getTimeValue()?.getTime() && "bg-blue-500 text-white hover:bg-blue-600"
          )
        }
        wrapperClassName="w-full"
        showPopperArrow={false}
      />
      
      {/* Custom CSS for time picker */}
      <style jsx global>{`
        .react-datepicker {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          border: none !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          background: white !important;
          padding: 16px !important;
          min-width: 200px !important;
        }

        .react-datepicker__time-container {
          border: none !important;
          padding: 0 !important;
          background: white !important;
          border-radius: 16px !important;
          width: 100% !important;
        }

        .react-datepicker__time {
          background: white !important;
          border: none !important;
          padding: 0 !important;
        }

        .react-datepicker__time-box {
          width: 100% !important;
        }

        .react-datepicker__time-list {
          padding: 0 !important;
          margin: 0 !important;
          max-height: 280px !important;
          overflow-y: auto !important;
        }

        .react-datepicker__time-list-item {
          height: 36px !important;
          line-height: 36px !important;
          padding: 0 12px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #1f2937 !important;
          transition: all 0.15s ease-in-out !important;
          border-radius: 8px !important;
          margin: 2px 0 !important;
          text-align: center !important;
        }

        .react-datepicker__time-list-item:hover {
          background-color: #eff6ff !important;
          color: #1d4ed8 !important;
        }

        .react-datepicker__time-list-item--selected {
          background-color: #3b82f6 !important;
          color: white !important;
        }

        .react-datepicker__time-list-item--selected:hover {
          background-color: #2563eb !important;
        }

        .react-datepicker__time-list-item--disabled {
          color: #d1d5db !important;
          cursor: not-allowed !important;
        }

        .react-datepicker__time-list-item--disabled:hover {
          background-color: transparent !important;
          color: #d1d5db !important;
        }

        .react-datepicker__header__time {
          font-size: 16px !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
          margin-bottom: 12px !important;
          text-align: center !important;
          padding: 0 !important;
        }

        /* Custom scrollbar for time list */
        .react-datepicker__time-list::-webkit-scrollbar {
          width: 6px !important;
        }

        .react-datepicker__time-list::-webkit-scrollbar-track {
          background: #f1f5f9 !important;
          border-radius: 3px !important;
        }

        .react-datepicker__time-list::-webkit-scrollbar-thumb {
          background: #cbd5e1 !important;
          border-radius: 3px !important;
        }

        .react-datepicker__time-list::-webkit-scrollbar-thumb:hover {
          background: #94a3b8 !important;
        }

        /* Hide date picker elements when showing time only */
        .react-datepicker__month-container {
          display: none !important;
        }

        .react-datepicker__navigation {
          display: none !important;
        }
      `}</style>
    </div>
  );
} 