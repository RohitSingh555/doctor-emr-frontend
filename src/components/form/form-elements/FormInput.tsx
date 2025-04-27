import { useState } from "react";
import Label from "../Label";
import Select from "../Select";
import DatePicker from "../date-picker";
import Input from "../input/InputField";
import { EyeCloseIcon, EyeIcon, TimeIcon } from "../../../icons";

// Define the type for the options array
interface Option {
  label: string;
  value: string;
}

interface FormInputProps {
  label: string;
  id: string;
  value?: string; // <-- NEW
  type?: "text" | "password" | "select" | "date-picker" | "time";
  placeholder?: string;
  options?: Option[]; // options is an array of Option objects for select type
  onChange: (e: React.ChangeEvent<any> | string) => void; // <-- Modified to also allow direct value (for date-picker/select)
}

export default function FormInput({
  label,
  id,
  value,
  type = "text",
  placeholder,
  options = [],
  onChange,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleInputType = () => {
    if (type === "password") {
      return showPassword ? "text" : "password";
    }
    return type;
  };

  if (type === "select") {
    return (
      <div>
        <Label htmlFor={id}>{label}</Label>
        <Select
          id={id}
          options={options}
          placeholder={placeholder}
          value={value} // <-- Added
          onChange={(selectedValue) => onChange(selectedValue)}
        />
      </div>
    );
  }

  if (type === "date-picker") {
    return (
      <div>
        <Label htmlFor={id}>{label}</Label>
        <DatePicker
          id={id}
          placeholder={placeholder}
          value={value} // <-- Added
          onChange={(date) => onChange(date)}
        />
      </div>
    );
  }

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={handleInputType()}
          placeholder={placeholder}
          value={value} // <-- Added
          onChange={onChange}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
            ) : (
              <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
            )}
          </button>
        )}
        {type === "time" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
            <TimeIcon className="size-6" />
          </span>
        )}
      </div>
    </div>
  );
}
