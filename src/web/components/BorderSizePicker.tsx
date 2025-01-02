import React, { useEffect, useState } from "react";

const units = ["px", "rem", "em"];

interface BorderSizePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
}

const BorderSizePicker: React.FC<BorderSizePickerProps> = ({
  value,
  onChange,
  label,
}) => {
  const [size, setSize] = useState("");
  const [unit, setUnit] = useState("px");
  const [enabled, setEnabled] = useState(value !== null);

  useEffect(() => {
    // Parse initial value
    if (value) {
      const match = value.match(/^([\d.]+)(.+)$/);
      if (match) {
        setSize(match[1]);
        setUnit(match[2]);
      }
    }
  }, [value]);

  const handleSizeChange = (newSize: string) => {
    setSize(newSize);
    if (newSize && enabled) {
      onChange(`${newSize}${unit}`);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    if (size && enabled) {
      onChange(`${size}${newUnit}`);
    }
  };

  const handleEnabledChange = (newEnabled: boolean) => {
    setEnabled(newEnabled);
    onChange(newEnabled ? `${size || "1"}${unit}` : null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => handleEnabledChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />Enable
        </div>
      </div>
      {/* {enabled && ( */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={size}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="flex-1 w-11 px-3 py-2 border rounded shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            min="0"
            step="0.5" 
            disabled={!enabled}
          />
          <select
            value={unit}
            onChange={(e) => handleUnitChange(e.target.value)}
            className="w-10 h-8 rounded border shadow-sm bg-white" 
            disabled={!enabled}
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      {/*  )} */}
    </div>
  );
};

export default BorderSizePicker;
