import React, { useState, useEffect } from 'react';

interface SpacingPickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  type: 'margin' | 'padding';
}

interface SpacingValues {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

const units = [
  { label: 'Pixels', value: 'px' },
  { label: 'REM', value: 'rem' },
  { label: 'EM', value: 'em' },
  { label: 'Percent', value: '%' },
  { label: 'VW', value: 'vw' },
  { label: 'VH', value: 'vh' },
];

const SpacingPicker: React.FC<SpacingPickerProps> = ({ value = '', onChange, label, type }) => {
  const parseInitialValue = (val: string) => {
    // Extract value from CSS property (e.g., "margin: 30rem" -> "30rem")
    const match = val.match(new RegExp(`^${type}:\\s*(.+)$`));
    const spacing = match ? match[1].trim() : val.trim();

    const parts = spacing.split(/\s+/).filter(Boolean);
    const defaultUnit = 'px';
    const defaultValue = `0${defaultUnit}`;

    if (!spacing || parts.length === 0) {
      return {
        values: {
          top: defaultValue,
          right: defaultValue,
          bottom: defaultValue,
          left: defaultValue,
        },
        unit: defaultUnit,
        isEqual: true,
      };
    }

    const unit = parts[0].match(/[a-z%]+$/)?.[0] || defaultUnit;

    if (parts.length === 1) {
      return {
        values: {
          top: parts[0],
          right: parts[0],
          bottom: parts[0],
          left: parts[0],
        },
        unit,
        isEqual: true,
      };
    }

    if (parts.length === 2) {
      return {
        values: {
          top: parts[0],
          right: parts[1],
          bottom: parts[0],
          left: parts[1],
        },
        unit,
        isEqual: parts[0] === parts[1],
      };
    }

    if (parts.length === 4) {
      return {
        values: {
          top: parts[0],
          right: parts[1],
          bottom: parts[2],
          left: parts[3],
        },
        unit,
        isEqual: parts[0] === parts[1] && parts[1] === parts[2] && parts[2] === parts[3],
      };
    }

    return {
      values: {
        top: defaultValue,
        right: defaultValue,
        bottom: defaultValue,
        left: defaultValue,
      },
      unit: defaultUnit,
      isEqual: true,
    };
  };

  const initialState = parseInitialValue(value);
  const [values, setValues] = useState<SpacingValues>(initialState.values);
  const [selectedUnit, setSelectedUnit] = useState(initialState.unit);
  const [equalSides, setEqualSides] = useState(initialState.isEqual);

  useEffect(() => {
    const newState = parseInitialValue(value);
    setValues(newState.values);
    setSelectedUnit(newState.unit);
    setEqualSides(newState.isEqual);
  }, [value]);

  const extractNumericValue = (val: string): string => {
    const match = val.match(/^-?\d*\.?\d+/);
    return match ? match[0] : '0';
  };

  const formatValue = (num: string, unit: string): string => {
    const numericValue = num.replace(/[^\d.-]/g, '');
    return numericValue ? `${numericValue}${unit}` : `0${unit}`;
  };

  const createStyleValue = (newValues: SpacingValues): string => {
    const { top, right, bottom, left } = newValues;

    // All sides equal
    if (top === right && right === bottom && bottom === left) {
      return top;
    }

    // Vertical and horizontal sides equal
    if (top === bottom && left === right) {
      return `${top} ${right}`;
    }

    // All sides different
    return `${top} ${right} ${bottom} ${left}`;
  };

  const handleChange = (side: keyof SpacingValues, inputValue: string) => {
    const formattedValue = formatValue(inputValue, selectedUnit);

    const newValues = equalSides
      ? {
          top: formattedValue,
          right: formattedValue,
          bottom: formattedValue,
          left: formattedValue,
        }
      : {
          ...values,
          [side]: formattedValue,
        };

    setValues(newValues);
    onChange(createStyleValue(newValues));
  };

  const handleUnitChange = (newUnit: string) => {
    const newValues = Object.entries(values).reduce(
      (acc, [key, val]) => ({
        ...acc,
        [key]: formatValue(extractNumericValue(val), newUnit),
      }),
      {} as SpacingValues,
    );

    setSelectedUnit(newUnit);
    setValues(newValues);
    onChange(createStyleValue(newValues));
  };

  const handleEqualSidesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isEqual = e.target.checked;
    setEqualSides(isEqual);

    if (isEqual) {
      const newValues = {
        top: values.top,
        right: values.top,
        bottom: values.top,
        left: values.top,
      };
      setValues(newValues);
      onChange(createStyleValue(newValues));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold ">{label}</label>
        <div className="flex items-center gap-2">
          <select
            value={selectedUnit}
            onChange={e => handleUnitChange(e.target.value)}
            className="h-8 rounded-md border /20 bg-white px-2 text-sm  
            focus:outline-none focus:ring-1 focus:ring-[#005f73] hover:bg-[#d6f9ff]/10 
            transition-colors duration-200"
          >
            {units.map(unit => (
              <option key={unit.value} value={unit.value} className=" bg-white">
                {unit.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              id={`${type}-equal-sides`}
              checked={equalSides}
              onChange={handleEqualSidesChange}
              className="h-4 w-4 rounded   focus:ring-[#005f73]"
            />
            <label htmlFor={`${type}-equal-sides`} className="text-sm ">
              Equal
            </label>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { key: 'top' as const, label: 'Top' },
          { key: 'right' as const, label: 'Right' },
          { key: 'bottom' as const, label: 'Bottom' },
          { key: 'left' as const, label: 'Left' },
        ].map(({ key, label: sideLabel }) => (
          <div key={key} className="flex items-center gap-2">
            <label className="text-xs  w-12">{sideLabel}</label>
            <div className="flex-1">
              <input
                type="text"
                value={extractNumericValue(values[key])}
                onChange={e => handleChange(key, e.target.value)}
                disabled={equalSides && key !== 'top'}
                className={`w-full h-9 rounded-md border px-3 text-sm transition-colors duration-200
                ${
                  equalSides && key !== 'top'
                    ? '/20 bg-[#d6f9ff]/10 /50 cursor-not-allowed'
                    : '/20 bg-white  hover:bg-[#d6f9ff]/10'
                }
                focus:outline-none focus:ring-1 focus:ring-[#005f73]`}
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpacingPicker;
