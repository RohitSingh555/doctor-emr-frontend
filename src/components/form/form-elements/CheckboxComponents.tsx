import { useState } from "react";
import Checkbox from "../input/Checkbox";

interface CheckboxComponentsProps {
  label: string;
  id: string;
}

export default function CheckboxComponents({ label, id }: CheckboxComponentsProps) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex items-start mb-5">
      <div className="flex h-5 items-center">
        <Checkbox
          checked={isChecked}
          onChange={setIsChecked}
          id={id}
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <label htmlFor={id} className="font-medium text-gray-900 dark:text-white cursor-pointer">
          {label}
        </label>
      </div>
    </div>
  );
}
