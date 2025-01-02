import React from 'react';
import ColorPicker from './ColorPicker';

interface ColorPickerFieldProps {
  value: string;
  onChange: (value: string | null) => void;
  label: string;
}

const ColorPickerField: React.FC<ColorPickerFieldProps> = ({ value, onChange, label }) => {
  return (
    <ColorPicker
      value={value || ""}
      onChange={onChange}
      label={label}
    />
  );
};

export default ColorPickerField;
