import React from 'react';

interface FontWeightPickerProps {
  value: string | null;
  onChange: (value: string) => void;
  label: string;
}

const weights = [
  { label: 'Thin', value: '100' },
  { label: 'Extra Light', value: '200' },
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semi Bold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra Bold', value: '800' },
  { label: 'Black', value: '900' },
];

const FontWeightPicker: React.FC<FontWeightPickerProps> = ({ value, onChange, label }) => {
  const [enabled, setEnabled] = React.useState(value !== null);

  const handleEnabledChange = (newEnabled: boolean) => {
    setEnabled(newEnabled);
    if (!newEnabled) {
      onChange('');
    } else if (!value) {
      onChange('400'); // Default to Regular weight when enabled
    }
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
            className="h-4 w-4 rounded   focus:ring-[#005f73]"
          />
          <label htmlFor={`${label}-toggle`} className="text-sm ">
            Enable
          </label>
        </div>
      </div>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className={`h-9 w-full rounded-md border px-3 text-sm transition-colors duration-200
          ${
            enabled
              ? ' bg-white  focus:ring-1 focus:ring-[#005f73] hover:bg-[#d6f9ff]/10'
              : 'border-gray-200 bg-[#d6f9ff]/10 text-gray-400 cursor-not-allowed'
          }`}
        disabled={!enabled}
      >
        {weights.map(weight => (
          <option key={weight.value} value={weight.value} className="bg-white ">
            {weight.label} ({weight.value})
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontWeightPicker;
