import ColorPicker from "./puckComponents/ColorPicker";
import ContentFieldPicker from "./puckComponents/ContentFieldPicker";
import SizePicker from "./puckComponents/SizePicker";
import FontWeightPicker from "./puckComponents/FontWeightPicker";
import FormFieldsButton from "./puckComponents/FormFieldsButton";
import LetterSpacingPicker from "./puckComponents/LetterSpacingPicker";
import SpacingPicker from "./puckComponents/SpacingPicker";
import TableDataButton from "./puckComponents/TableDataButton";
import { FormField, TableData } from "./types";
import ImageUploader from "./puckComponents/ImageUploader";

interface FieldProps {
  value: string | null;
  onChange: (value: string | TableData | null) => void;
  label?: string;
}

interface FieldProps1 {
  value: FormField[];
  onChange: (value: FormField[]) => void;
}

interface CustomFieldProps<T> {
  field: {
    type: "custom";
    label?: string;
    defaultValue?: T;
    parent?: {
      props?: {
        rows?: number;
        columns?: number;
      };
    };
  };
  name: string;
  id: string;
  value: T;
  onChange: (value: T) => void;
  readOnly?: boolean;
}

export const renderColorPicker = ({ value, onChange, label }: FieldProps) => {
  return (
    <ColorPicker
      value={value}
      onChange={onChange}
      label={label || "Text Color123"}
    />
  );
};

export const renderBGColorPicker = ({ value, onChange, label }: FieldProps) => {
  return (
    <ColorPicker
      value={value}
      onChange={onChange}
      label={label || "Background Color"}
    />
  );
};

export const renderFontSizePicker = ({
  value,
  onChange,
  label,
}: FieldProps) => {
  return (
    <SizePicker
      value={value}
      onChange={onChange}
      label={label || "Font Size"}
      units={['px', 'rem', 'em', 'vh', 'vw', '%']}
      step="0.1"
      formatValue={(size, unit) => `${size}${unit}`}
    />
  );
};

export const renderFontWeightPicker = ({
  value,
  onChange,
  label,
}: FieldProps) => {
  return (
    <FontWeightPicker
      value={value}
      onChange={onChange}
      label={label || "Font Weight"}
    />
  );
};

export const renderLetterSpacingPicker = ({
  value,
  onChange,
  label,
}: FieldProps) => {
  return (
    <LetterSpacingPicker
      value={value || ""}
      onChange={onChange}
      label={label || "Letter Spacing"}
    />
  );
};

export const renderMarginPicker = ({ value, onChange, label }: FieldProps) => {
  return (
    <SpacingPicker
      value={value || ""}
      onChange={onChange}
      label={label || "Margin"}
      type="margin"
    />
  );
};

export const renderPaddingPicker = ({ value, onChange, label }: FieldProps) => {
  return (
    <SpacingPicker
      value={value || ""}
      onChange={onChange}
      label={label || "Padding"}
      type="padding"
    />
  );
};

export const renderBorderSizePicker = ({
  value,
  onChange,
  label,
}: FieldProps) => {
  return (
    <SizePicker
      value={value}
      onChange={onChange}
      label={label || "Border Size"}
      units={['px', 'rem', 'em']}
      step="0.5"
      formatValue={(size, unit) => `${size}${unit} solid red`}
    />
  );
};

export const renderContentField = ({ value, onChange, label }: FieldProps) => {
  return (
    <ContentFieldPicker value={value || ""} onChange={onChange} label={label} />
  );
};

export const renderTableDataButton = ({
  value,
  onChange,
  field,
}: CustomFieldProps<TableData | null>) => {
  return (
    <TableDataButton
      value={value}
      onChange={onChange}
      rows={field?.parent?.props?.rows ?? 3}
      columns={field?.parent?.props?.columns ?? 3}
    />
  );
};

export const renderFormFieldsButton = ({ value, onChange }: FieldProps1) => {
  return <FormFieldsButton value={value} onChange={onChange} />;
};

export const renderImageUploader = ({ value, onChange, label, id }: FieldProps & { id?: string }) => {
  return (
    <ImageUploader 
      value={value || ''} 
      onChange={(newValue) => {
        // Update the main value
        onChange(newValue);
        
        // Update the src field if this is an alt field
        if (id && id.includes('.alt')) {
          const srcFieldId = id.replace('.alt', '.src');
          const srcField = document.querySelector(`[data-id="${srcFieldId}"] input`) as HTMLInputElement;
          if (srcField) {
            srcField.value = newValue;
            const event = new Event('input', { bubbles: true });
            srcField.dispatchEvent(event);
          }
        }
        
        // Also update the src field directly if it exists and this is not already a src field
        if (id && !id.includes('.src')) {
          const srcField = document.querySelector(`[data-id="${id}.src"] input`) as HTMLInputElement;
          if (srcField) {
            srcField.value = newValue;
            const event = new Event('input', { bubbles: true });
            srcField.dispatchEvent(event);
          }
        }
      }} 
      label={label}
      onAltTextChange={(altText) => {
        // Find the alt input field related to this image field
        // This assumes the alt field comes right after the src field
        if (id) {
          const altFieldId = id.replace('.src', '.alt');
          // Find the alt text field and simulate a change event on it
          const altField = document.querySelector(`[data-id="${altFieldId}"] input`) as HTMLInputElement;
          if (altField) {
            // Update the alt input value directly
            altField.value = altText;
            // Trigger the change event
            const event = new Event('input', { bubbles: true });
            altField.dispatchEvent(event);
          }
        }
      }} 
    />
  );
};
