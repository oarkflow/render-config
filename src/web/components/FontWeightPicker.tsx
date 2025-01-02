import React from "react";

interface FontWeightPickerProps {
  value: string | null;
  onChange: (value: string) => void;
  label: string;
}

const weights = [
  { label: "Thin", value: "100" },
  { label: "Extra Light", value: "200" },
  { label: "Light", value: "300" },
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semi Bold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" },
  { label: "Black", value: "900" },
];

const FontWeightPicker: React.FC<FontWeightPickerProps> = ({
  value,
  onChange,
  label,
}) => {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`${label}-toggle`}
            checked={enabled}
            onChange={() => {
              setEnabled(!enabled);
            }}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={`${label}-toggle`} className="text-sm text-gray-600">
            Enable
          </label>
        </div>
      </div>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
        disabled={!enabled}
      >
        {weights.map((weight) => (
          <option key={weight.value} value={weight.value}>
            {weight.label} ({weight.value})
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontWeightPicker;
