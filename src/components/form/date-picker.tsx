import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  value?: string; // <-- controlled value
  onChange: (value: string) => void; // <-- standard onChange(value)
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  mode = "single",
  value,
  onChange,
  label,
  placeholder,
}: PropsType) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const flatPickr = flatpickr(inputRef.current, {
      mode,
      static: true,
      dateFormat: "Y-m-d",
      defaultDate: value,
      monthSelectorType: "static",
      onChange: (dates) => {
        if (dates.length > 0) {
          const selectedDate = dates[0].toISOString().split("T")[0]; // format Y-m-d
          onChange(selectedDate);
        }
      },
    });

    return () => {
      flatPickr.destroy();
    };
  }, [mode, onChange, value]);

  useEffect(() => {
    if (inputRef.current && value) {
      inputRef.current.value = value;
    }
  }, [value]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
          readOnly
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
