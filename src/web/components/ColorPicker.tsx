import React, { useState, useEffect, useCallback, memo } from "react";
import { HexAlphaColorPicker } from "react-colorful";

// Helper function moved outside component to avoid recreation
const isValidColor = (color: string): boolean => {
  const s = new Option().style;
  s.color = color;
  return s.color !== '';
};

interface ColorPickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
}

interface ColorPickerState {
  isOpen: boolean;
  inputColor: string;
  enabled: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = memo(({ value, onChange, label }) => {
  const [state, setState] = useState<ColorPickerState>(() => {
    const initialColor = value && isValidColor(value) ? value : "#000000";
    return {
      isOpen: false,
      inputColor: initialColor,
      enabled: value !== null
    };
  });

  useEffect(() => {
    if (value === null) {
      setState(prev => ({
        ...prev,
        enabled: false
      }));
    } else if (isValidColor(value)) {
      setState(prev => ({
        ...prev,
        inputColor: value,
        enabled: true
      }));
    }
  }, [value]);

  const handleColorChange = useCallback((newColor: string) => {
    if (!isValidColor(newColor)) return;
    
    setState(prev => ({ ...prev, inputColor: newColor }));
    if (state.enabled) {
      onChange(newColor);
    }
  }, [state.enabled, onChange]);

  const handleEnabledChange = useCallback((newEnabled: boolean) => {
    setState(prev => ({ ...prev, enabled: newEnabled, isOpen: newEnabled }));
    onChange(newEnabled ? state.inputColor : null);
  }, [state.inputColor, onChange]);

  const togglePicker = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`${label}-toggle`}
            checked={state.enabled}
            onChange={(e) => handleEnabledChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={`${label}-toggle`} className="text-sm font-medium text-gray-700">
            Enable
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={state.enabled ? state.inputColor : ""}
          onChange={(e) => handleColorChange(e.target.value)}
          disabled={!state.enabled}
          placeholder={state.enabled ? "#000000" : "Disabled"}
          className="flex-1 w-11 px-3 py-2 border rounded shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={togglePicker}
          className="w-10 h-10 rounded border shadow-sm"
          style={{
            backgroundColor: state.enabled ? state.inputColor : "#ffffff",
            borderColor: state.enabled ? state.inputColor : "#e5e7eb",
          }}
          disabled={!state.enabled}
        />
      </div>

      {state.isOpen && (
        <div className="absolute right-0 mt-2 p-3 bg-white rounded-lg shadow-lg border z-10">
          <HexAlphaColorPicker color={state.inputColor} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
});

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
