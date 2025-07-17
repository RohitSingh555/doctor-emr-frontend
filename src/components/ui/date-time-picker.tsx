"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Calendar, Clock, X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import "react-datepicker/dist/react-datepicker.css";

interface DateTimePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showTimeSelect?: boolean;
  minDate?: Date;
  maxDate?: Date;
  timeIntervals?: number;
  dateFormat?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
  className,
  disabled = false,
  showTimeSelect = true,
  minDate,
  maxDate,
  timeIntervals = 15,
  dateFormat = "MMM dd, yyyy h:mm aa"
}: DateTimePickerProps) {
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
          {showTimeSelect && <Clock className="w-4 h-4 text-gray-400" />}
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
        selected={value}
        onChange={onChange}
        customInput={<CustomInput />}
        showTimeSelect={showTimeSelect}
        timeIntervals={timeIntervals}
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
        timeClassName={(date) =>
          cn(
            "hover:bg-blue-50 transition-colors duration-150",
            date.getTime() === value?.getTime() && "bg-blue-500 text-white hover:bg-blue-600"
          )
        }
        wrapperClassName="w-full"
        calendarStartDay={1}
        showPopperArrow={false}
      />
      
      {/* Custom CSS for proper horizontal layout */}
      <style jsx global>{`
        .react-datepicker {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          border: none !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          background: white !important;
          padding: 0 !important;
          display: flex !important;
          flex-direction: row !important;
          min-width: 600px !important;
        }

        .react-datepicker__month-container {
          border-radius: 16px 0 0 16px !important;
          padding: 16px !important;
          background: white !important;
          border: none !important;
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

        .react-datepicker__time-container {
          border-left: 1px solid #e5e7eb !important;
          padding: 16px !important;
          background: white !important;
          border-radius: 0 16px 16px 0 !important;
          min-width: 200px !important;
          display: flex !important;
          flex-direction: column !important;
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

        /* Ensure proper spacing and alignment */
        .react-datepicker__time-container .react-datepicker__time {
          border-radius: 0 !important;
        }

        .react-datepicker__time-container .react-datepicker__header {
          border-radius: 0 !important;
          padding-bottom: 12px !important;
        }

        /* Remove any default margins/padding that might cause layout issues */
        .react-datepicker__month-container .react-datepicker__header {
          border-radius: 0 !important;
        }

        .react-datepicker__month-container .react-datepicker__month {
          border-radius: 0 !important;
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
      `}</style>
    </div>
  );
} 