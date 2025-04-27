import React from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  id,
}) => {
  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={() => onChange(!checked)}
      disabled={disabled}
      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-primary dark:checked:border-primary cursor-pointer"
    />
  );
};

export default Checkbox;
