"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Calendar, X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
}

export function DatePickerComponent({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
  minDate,
  maxDate,
  dateFormat = "MMM dd, yyyy"
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

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
          <Calendar className="w-4 h-4 text-gray-400" />
        </div>
        <span className="truncate">
          {value || placeholder}
        </span>
      </div>
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            onChange(null);
          }}
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </Button>
  );

  return (
    <div className="relative">
      <DatePicker
        selected={value}
        onChange={onChange}
        customInput={<CustomInput />}
        dateFormat={dateFormat}
        minDate={minDate}
        maxDate={maxDate}
        open={isOpen}
        onCalendarOpen={() => setIsOpen(true)}
        onCalendarClose={() => setIsOpen(false)}
        popperClassName="z-50"
        popperPlacement="bottom-start"
        calendarClassName="shadow-2xl border-0 rounded-xl overflow-hidden"
        dayClassName={(date) =>
          cn(
            "hover:bg-blue-50 transition-colors duration-150",
            date.getTime() === value?.getTime() && "bg-blue-500 text-white hover:bg-blue-600"
          )
        }
        wrapperClassName="w-full"
        calendarStartDay={1}
        showPopperArrow={false}
      />
      
      {/* Custom CSS for Google-style appearance */}
      <style jsx global>{`
        .react-datepicker {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          border: none !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          background: white !important;
          padding: 16px !important;
        }

        .react-datepicker__header {
          background: white !important;
          border: none !important;
          padding: 0 0 16px 0 !important;
        }

        .react-datepicker__current-month {
          font-size: 18px !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
          margin-bottom: 16px !important;
        }

        .react-datepicker__day-names {
          margin: 0 !important;
          padding: 0 !important;
        }

        .react-datepicker__day-name {
          color: #6b7280 !important;
          font-weight: 500 !important;
          font-size: 12px !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          margin: 0 !important;
        }

        .react-datepicker__month {
          margin: 0 !important;
        }

        .react-datepicker__week {
          margin: 0 !important;
        }

        .react-datepicker__day {
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          margin: 0 !important;
          border-radius: 50% !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #1f2937 !important;
          transition: all 0.15s ease-in-out !important;
        }

        .react-datepicker__day:hover {
          background-color: #eff6ff !important;
          color: #1d4ed8 !important;
        }

        .react-datepicker__day--selected {
          background-color: #3b82f6 !important;
          color: white !important;
        }

        .react-datepicker__day--selected:hover {
          background-color: #2563eb !important;
        }

        .react-datepicker__day--keyboard-selected {
          background-color: #eff6ff !important;
          color: #1d4ed8 !important;
        }

        .react-datepicker__day--outside-month {
          color: #d1d5db !important;
        }

        .react-datepicker__day--disabled {
          color: #d1d5db !important;
          cursor: not-allowed !important;
        }

        .react-datepicker__day--disabled:hover {
          background-color: transparent !important;
          color: #d1d5db !important;
        }

        .react-datepicker__navigation {
          top: 16px !important;
        }

        .react-datepicker__navigation-icon::before {
          border-color: #6b7280 !important;
          border-width: 2px 2px 0 0 !important;
          height: 8px !important;
          width: 8px !important;
        }

        .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
          border-color: #374151 !important;
        }
      `}</style>
    </div>
  );
} 