import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Radio from "../input/Radio";
import Label from "../Label";

interface RadioButtonOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioButtonsProps {
  label: string; // Add the label for the Radio group
  name: string;
  options: RadioButtonOption[];
  defaultValue?: string;
  onChange: (value: string) => void;
}

export default function RadioButtons({
  label,
  name,
  options,
  defaultValue = "",
  onChange,
}: RadioButtonsProps) {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    onChange(value); // Passing the selected value to the parent component
  };

  return (
      <div className="mb-4">
        <Label>{label}</Label>
        <div className="flex flex-wrap items-center gap-8">
          {options.map((option) => (
            <Radio
              key={option.value}
              id={option.value}
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={handleRadioChange}
              label={option.label}
              disabled={option.disabled}
            />
          ))}
        </div>
      </div>
  );
}
