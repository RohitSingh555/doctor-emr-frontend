import React from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../../../../public/css/PhoneInputCustom.css";

type MobileNumberInputProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
};

const MobileNumberInput: React.FC<MobileNumberInputProps> = ({
  label,
  id,
  value,
  onChange,
  placeholder = "Enter mobile number",
  error,
}) => {
  const handleChange = (value: string) => {
    onChange(value);
  };

  const validatePhoneNumber = () => {
    if (value && !isValidPhoneNumber(value)) {
      return "Invalid phone number";
    }
    return "";
  };

  return (
    <div className="form-group">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <PhoneInput
          id={id}
          international
          defaultCountry="GB"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="block w-full rounded-md border-2 border-gray-300 bg-white text-sm focus:border-indigo-500 focus:ring-0 focus:outline-none px-4 py-2"
        />
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
        {value && !isValidPhoneNumber(value) && (
          <span className="text-red-500 text-xs mt-1">
            {validatePhoneNumber()}
          </span>
        )}
      </div>
    </div>
  );
};

export default MobileNumberInput;
