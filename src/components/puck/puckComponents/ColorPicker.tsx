import React, { useState, useEffect, useCallback, memo } from 'react';
import { HexAlphaColorPicker } from 'react-colorful';

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
  const [state, setState] = useState<ColorPickerState>(() => ({
    isOpen: false,
    inputColor: value && isValidColor(value) ? value : '#000000',
    enabled: value !== null,
  }));

  useEffect(() => {
    if (value === null) {
      setState(prev => ({
        ...prev,
        enabled: false,
      }));
    } else if (isValidColor(value)) {
      setState(prev => ({
        ...prev,
        inputColor: value,
        enabled: true,
      }));
    }
  }, [value]);

  const handleColorChange = useCallback(
    (newColor: string) => {
      if (!isValidColor(newColor)) return;

      setState(prev => ({ ...prev, inputColor: newColor }));
      if (state.enabled) {
        onChange(newColor);
      }
    },
    [state.enabled, onChange],
  );

  const handleEnabledChange = useCallback(
    (newEnabled: boolean) => {
      setState(prev => ({ ...prev, enabled: newEnabled, isOpen: newEnabled }));
      onChange(newEnabled ? state.inputColor : null);
    },
    [state.inputColor, onChange],
  );

  const togglePicker = useCallback(() => {
    if (state.enabled) {
      setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
    }
  }, [state.enabled]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold ">{label}</span>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`${label}-toggle`}
            checked={state.enabled}
            onChange={e => handleEnabledChange(e.target.checked)}
            className="h-4 w-4 rounded   focus:ring-[#005f73]"
          />
          <label htmlFor={`${label}-toggle`} className="text-sm font-medium ">
            Enable
          </label>
          <button
          type="button"
          onClick={togglePicker}
          className={`w-5 h-5 rounded-sm transition-all duration-200
            ${state.enabled ? ' shadow-sm hover:shadow-md' : 'border  cursor-not-allowed'}`}
          style={{
            backgroundColor: state.enabled ? state.inputColor : '#ffffff',
          }}
          disabled={!state.enabled}
        />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={state.enabled ? state.inputColor : ''}
          onChange={e => handleColorChange(e.target.value)}
          disabled={!state.enabled}
          placeholder={state.enabled ? '#000000' : 'Disabled'}
          className={`flex-1 px-1 py-2 rounded-md border focus:outline-none transition-colors duration-200
            ${
              state.enabled
                ? ' focus:ring-1 focus:ring-[#005f73] bg-white '
                : 'border-gray-200 bg-gray-50 text-gray-400'
            }`}
        />
       
      </div>

      {state.isOpen && (
        <div className="absolute right-0 mt-2 top-3 p-3 bg-white rounded-lg shadow-xl border  z-10">
          <div className="mb-2 p-2 bg-[#d6f9ff] rounded-md">
            <span className="text-sm  font-medium">Pick a color</span>
          </div>
          <HexAlphaColorPicker color={state.inputColor} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
});

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
