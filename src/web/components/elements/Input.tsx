import React from "react";
import { InputProps } from "../../types";

const Input: React.FC<InputProps> = ({
  name,
  label,
  inputType,
  placeholder,
  required,
  labelColor,
  labelSize,
  borderRadius,
  color,
  backgroundColor,
  margin,
  padding,
  tailwindClass,
}) => {
  const getBorderRadiusClass = () => {
    switch (borderRadius) {
      case "none":
        return "rounded-none";
      case "sm":
        return "rounded-sm";
      case "md":
        return "rounded-md";
      case "lg":
        return "rounded-lg";
      case "full":
        return "rounded-full";
      default:
        return "rounded-md";
    }
  };

  const getLabelSizeClass = () => {
    switch (labelSize) {
      case "sm":
        return "text-sm";
      case "base":
        return "text-base";
      case "lg":
        return "text-lg";
      default:
        return "text-sm";
    }
  };

  const style: React.CSSProperties = {
    margin: margin || undefined,
    padding: padding || undefined,
  };

  const baseInputClass = `
    w-full border border-gray-300
    ${getBorderRadiusClass()}
    px-3 py-2
    ring-offset-background
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:cursor-not-allowed disabled:opacity-50
  `;

  const inputStyles = {
    color: color || undefined,
    backgroundColor: backgroundColor || undefined,
  };

  const renderInput = () => {
    switch (inputType) {
      case "textarea":
        return (
          <textarea
            name={name}
            placeholder={placeholder}
            required={required}
            rows={4}
            className={`${baseInputClass} min-h-[80px] resize-y`}
            style={inputStyles}
          />
        );
      case "select":
        return (
          <select
            name={name}
            required={required}
            className={baseInputClass}
            style={inputStyles}
          >
            <option value="">Select an option</option>
          </select>
        );
      default:
        return (
          <input
            type={inputType}
            name={name}
            placeholder={placeholder}
            required={required}
            className={baseInputClass}
            style={inputStyles}
          />
        );
    }
  };

  return (
    <div
      className={`form-field ${tailwindClass || ""}`}
      style={style}
    >
      <label
        className={`block font-medium mb-1 ${getLabelSizeClass()}`}
        style={{ color: labelColor }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
    </div>
  );
};

export default Input;
