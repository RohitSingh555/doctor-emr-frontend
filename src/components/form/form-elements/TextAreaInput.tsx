
import TextArea from "../input/TextArea"; // Adjust the import path as needed
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";

interface TextAreaInputProps {
  label: string;
  id: string;
  value: string;
  placeholder: string;
  rows: number;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

export default function TextAreaInput({
  label,
  id,
  value,
  placeholder,
  rows,
  onChange,
  disabled = false,
  error = false,
  hint,
}: TextAreaInputProps) {
  return (
      <div className="space-y-6">
        {/* Label for the TextArea */}
        <div>
          <Label htmlFor={id}>{label}</Label>
          <TextArea
            id={id} // Pass id to TextArea
            placeholder={placeholder} // Pass placeholder text
            value={value} // Bind value to state
            onChange={onChange} // Handle change events
            rows={rows} // Set rows
            disabled={disabled} // Handle disabled state
            error={error} // Handle error state
            hint={hint} // Pass the hint to TextArea
          />
          {/* Conditionally render the hint below the TextArea */}
          {hint && !error && (
            <p className="text-gray-500 text-sm mt-2">{hint}</p>
          )}
          {/* Show error hint text if there's an error */}
          {error && (
            <p className="text-red-500 text-sm mt-2">{hint || "Invalid input"}</p>
          )}
        </div>
      </div>
  );
}
