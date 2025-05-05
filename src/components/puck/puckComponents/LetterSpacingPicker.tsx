import React, { useState, useEffect } from 'react';

interface LetterSpacingPickerProps {
  value: string | null;
  onChange: (value: string) => void;
  label: string;
}

const spacings = [
  { label: 'Tighter', value: '-0.05em' },
  { label: 'Tight', value: '-0.025em' },
  { label: 'Normal', value: '0' },
  { label: 'Wide', value: '0.025em' },
  { label: 'Wider', value: '0.05em' },
  { label: 'Widest', value: '0.1em' },
];

const LetterSpacingPicker: React.FC<LetterSpacingPickerProps> = ({ value, onChange, label }) => {
  const [customValue, setCustomValue] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (value) {
      const preset = spacings.find(s => s.value === value);
      if (preset) {
        setIsCustom(false);
        setCustomValue('');
      } else {
        setIsCustom(true);
        setCustomValue(value);
      }
    }
  }, [value]);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (newValue === 'custom') {
      setIsCustom(true);
      setCustomValue(value || '0');
    } else {
      setIsCustom(false);
      setCustomValue('');
      onChange(newValue);
    }
  };

  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold ">{label}</label>
      <div className="flex gap-2">
        <select
          value={isCustom ? 'custom' : value || '0'}
          onChange={handlePresetChange}
          className="h-9 flex-1 rounded-md border  bg-white px-3 text-sm 
            focus:outline-none focus:ring-1 focus:ring-[#005f73] hover:bg-[#d6f9ff]/10 transition-colors duration-200"
        >
          {spacings.map(spacing => (
            <option key={spacing.value} value={spacing.value} className="bg-white ">
              {spacing.label} ({spacing.value})
            </option>
          ))}
          <option value="custom" className="bg-white ">
            Custom
          </option>
        </select>
        {isCustom && (
          <input
            type="text"
            value={customValue}
            onChange={handleCustomValueChange}
            placeholder="e.g., 0.05em"
            className="h-9 w-24 rounded-md border  bg-white px-3 text-sm 
              focus:outline-none focus:ring-1 focus:ring-[#005f73] placeholder-[#005f73]/50
              hover:bg-[#d6f9ff]/10 transition-colors duration-200"
          />
        )}
      </div>
    </div>
  );
};

export default LetterSpacingPicker;
