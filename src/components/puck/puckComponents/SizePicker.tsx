import React, { useEffect, useState } from 'react';

const defaultUnits = ['px', 'rem', 'em', 'vh', 'vw', '%'];

interface SizePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
  units?: string[];  // Allow customization of available units
  step?: string;     // Allow customization of step value
  formatValue?: (size: string, unit: string) => string;  // Custom formatting function
  defaultUnit?: string; // Default unit to use if not provided
  defaultSize?: string; // Default size to use when enabled
}

const SizePicker: React.FC<SizePickerProps> = ({ 
  value, 
  onChange, 
  label, 
  units = defaultUnits,
  step = "0.1",
  formatValue = (size, unit) => `${size}${unit}`,
  defaultUnit = "px",
  defaultSize = "1"
}) => {
  const [size, setSize] = useState(defaultSize);
  const [unit, setUnit] = useState(defaultUnit);
  const [enabled, setEnabled] = useState(value !== null);

  useEffect(() => {
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
      onChange(formatValue(newSize, unit));
    }
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    if (size && enabled) {
      onChange(formatValue(size, newUnit));
    }
  };

  const handleEnabledChange = (newEnabled: boolean) => {
    setEnabled(newEnabled);
    onChange(newEnabled ? formatValue(size || defaultSize, unit) : null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold ">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`${label}-toggle`}
            checked={enabled}
            onChange={e => handleEnabledChange(e.target.checked)}
            className="h-4 w-4 rounded focus:ring-[#005f73]"
          />
          <label htmlFor={`${label}-toggle`} className="text-sm ">
            Enable
          </label>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="number"
            value={size}
            onChange={e => handleSizeChange(e.target.value)}
            className={`w-full px-3 py-2 rounded-md border transition-colors duration-200
              ${
                enabled
                  ? ' focus:ring-1 focus:ring-[#005f73] bg-white '
                  : 'border-gray-200 bg-[#d6f9ff]/10 text-gray-400 cursor-not-allowed'
              }`}
            placeholder="Size"
            min="0"
            step={step}
            disabled={!enabled}
          />
        </div>
        <select
          value={unit}
          onChange={e => handleUnitChange(e.target.value)}
          className={`w-20 px-2 py-2 rounded-md border transition-colors duration-200
            ${
              enabled
                ? ' focus:ring-1 focus:ring-[#005f73] bg-white '
                : 'border-gray-200 bg-[#d6f9ff]/10 text-gray-400 cursor-not-allowed'
            }`}
          disabled={!enabled}
        >
          {units.map(u => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SizePicker;
