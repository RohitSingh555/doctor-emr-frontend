import React, { useState, useEffect, useRef } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css"; // Import styles

type DateOfBirthInputProps = {
  label: string;
  id: string;
  value: string;
  onChange: (date: Date) => void;
  placeholder?: string;
};

const DateOfBirthInput: React.FC<DateOfBirthInputProps> = ({
  label,
  id,
  value,
  onChange,
  placeholder = "Select Date of Birth",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null); // Reference for the date picker div
  const formattedDate = value ? format(new Date(value), "MMMM dd, yyyy") : "";

  const toggleDatePicker = () => setIsOpen((prev) => !prev);

  const startMonth = new Date(2000, 0); // January 1, 2000

  const handleTodayClick = () => {
    const today = new Date();
    onChange(today);
    setIsOpen(false); // Close the picker after selecting Today
  };

  // Close the date picker if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="form-group">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type="text"
          value={formattedDate}
          placeholder={placeholder}
          readOnly
          onClick={toggleDatePicker}
          className="block w-full rounded-lg border border-gray-300 shadow-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-3 bg-white"
        />

        {isOpen && (
          <div
            ref={datePickerRef}
            className="absolute top-full left-0 mt-2 z-10 bg-white rounded-lg shadow-xl border border-gray-300 p-3"
          >
            <DayPicker
              selected={value ? new Date(value) : undefined}
              onDayClick={(date: Date) => {
                onChange(date);
                setIsOpen(false); // Close the picker after selecting a date
              }}
              mode="single"
              disabled={{ before: new Date(2000, 0, 1) }} // Disables dates before 2000
              startMonth={startMonth} // Set the starting month (January 2000)
              showOutsideDays
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DateOfBirthInput;
