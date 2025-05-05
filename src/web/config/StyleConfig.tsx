/* eslint-disable react-refresh/only-export-components */
import { Config } from "../../packages/measured/puck";
import {
  renderBGColorPicker,
  renderColorPicker,
  renderFontSizePicker,
  renderMarginPicker,
  renderPaddingPicker,
  renderBorderSizePicker,
} from "./fieldRenderers";
import { useState } from "react";

type Field = NonNullable<Config["components"][string]["fields"]>[string];

export interface ToggleFieldProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
  options: { label: string; value: string }[];
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
  value,
  onChange,
  label,
  options,
}) => {
  const [enabled, setEnabled] = useState(value !== null);

  const handleChange = (newValue: string) => {
    if (enabled) {
      onChange(newValue);
    }
  };

  const handleEnabledChange = (newEnabled: boolean) => {
    setEnabled(newEnabled);
    onChange(newEnabled ? value || options[0].value : null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`${label}-toggle`}
            checked={enabled}
            onChange={(e) => handleEnabledChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={`${label}-toggle`} className="text-sm text-gray-600">
            Enable
          </label>
        </div>
      </div>
      <select
        value={value || ""}
        onChange={(e) => handleChange(e.target.value)}
        disabled={!enabled}
        className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const textAlignConfig: Field = {
  type: "custom",
  label: "Text Align",
  render: ({ value, onChange }) => (
    <ToggleField
      value={value}
      onChange={onChange}
      label="Text Align"
      options={[
        { label: "Left", value: "text-left" },
        { label: "Center", value: "text-center" },
        { label: "Right", value: "text-right" },
        { label: "Justify", value: "text-justify" },
      ]}
    />
  ),
};

export const letterSpacingConfig: Field = {
  type: "custom",
  label: "Letter Spacing",
  render: ({ value, onChange }) => (
    <ToggleField
      value={value}
      onChange={onChange}
      label="Letter Spacing"
      options={[
        { label: "Tighter", value: "tracking-tighter" },
        { label: "Tight", value: "tracking-tight" },
        { label: "Normal", value: "tracking-normal" },
        { label: "Wide", value: "tracking-wide" },
        { label: "Wider", value: "tracking-wider" },
        { label: "Widest", value: "tracking-widest" },
      ]}
    />
  ),
};

export const colorConfig: Field = {
  type: "custom",
  render: renderColorPicker,
  label: "Text Color",
};

export const backgroundColorConfig: Field = {
  type: "custom",
  render: renderBGColorPicker,
  label: "Background Color",
};

export const fontSizeConfig: Field = {
  type: "custom",
  render: renderFontSizePicker,
};

export const fontWeightConfig: Field = {
  type: "custom",
  render: ({ value, onChange }) => (
    <ToggleField
      value={value}
      onChange={onChange}
      label="Font Weight"
      options={[
        { label: "Thin", value: "100" },
        { label: "Extra Light", value: "200" },
        { label: "Light", value: "300" },
        { label: "Regular", value: "400" },
        { label: "Medium", value: "500" },
        { label: "Semi Bold", value: "600" },
        { label: "Bold", value: "700" },
        { label: "Extra Bold", value: "800" },
        { label: "Black", value: "900" },
      ]}
    />
  ),
};

export const lineHeightConfig: Field = {
  type: "custom",
  label: "Line Height",
  render: ({ value, onChange }) => (
    <ToggleField
      value={value}
      onChange={onChange}
      label="Line Height"
      options={[
        { label: "None", value: "leading-none" },
        { label: "Tight", value: "leading-tight" },
        { label: "Snug", value: "leading-snug" },
        { label: "Normal", value: "leading-normal" },
        { label: "Relaxed", value: "leading-relaxed" },
        { label: "Loose", value: "leading-loose" },
      ]}
    />
  ),
};

export const textTransformConfig: Field = {
  type: "custom",
  label: "Text Transform",
  render: ({ value, onChange }) => (
    <ToggleField
      value={value}
      onChange={onChange}
      label="Text Transform"
      options={[
        { label: "None", value: "normal-case" },
        { label: "Uppercase", value: "uppercase" },
        { label: "Lowercase", value: "lowercase" },
        { label: "Capitalize", value: "capitalize" },
      ]}
    />
  ),
};

export const marginConfig: Field = {
  type: "custom",
  render: renderMarginPicker,
};

export const paddingConfig: Field = {
  type: "custom",
  render: renderPaddingPicker,
};

export const borderSizeConfig: Field = {
  type: "custom",
  render: renderBorderSizePicker,
};

export const tailwindClass: Field = {
  type: "custom",
  label: "Tailwind Classes",
  render: ({ value, onChange }) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Tailwind Classes
          </label>
        </div>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 min-h-[80px] resize-y"
          placeholder="e.g. text-green-400 font-bold"
        />
      </div>
    );
  },
};
