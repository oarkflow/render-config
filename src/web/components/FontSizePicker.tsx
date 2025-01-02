import React, { useEffect, useState } from "react";

const units = ["px", "rem", "em", "vh", "vw", "%"];

interface FontSizePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
}

const FontSizePicker: React.FC<FontSizePickerProps> = ({
  value,
  onChange,
  label,
}) => {
  const [size, setSize] = useState("");
  const [unit, setUnit] = useState("px");

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
    if (newSize) {
      onChange(`${newSize}${unit}`);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    if (size) {
      onChange(`${size}${newUnit}`);
    }
  };
  const [enabled, setEnabled] = useState(false);

  const handleEnabledChange = (newEnabled: boolean) => {
    setEnabled(newEnabled);
    onChange(newEnabled ? `${size}px` : null);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`${label}-toggle`}
            onChange={() => handleEnabledChange(!enabled)}
            checked={enabled}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={`${label}-toggle`} className="text-sm text-gray-600">
            Enable
          </label>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="number"
            value={size}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
            placeholder="Size"
            min="0"
            step="0.1"
            disabled={!enabled}
          />
        </div>
        <select
          value={unit}
          onChange={(e) => handleUnitChange(e.target.value)}
          className="h-9 rounded-md border border-gray-200 bg-transparent px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          disabled={!enabled}
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FontSizePicker;
