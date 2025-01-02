import BorderSizePicker from "../components/BorderSizePicker";
import ColorPicker from "../components/ColorPicker";
import ContentFieldPicker from "../components/ContentFieldPicker";
import FontSizePicker from "../components/FontSizePicker";
import FontWeightPicker from "../components/FontWeightPicker";
import FormFieldsButton from "../components/FormFieldsButton";
import LetterSpacingPicker from "../components/LetterSpacingPicker";
import SpacingPicker from "../components/SpacingPicker";
import TableDataButton from "../components/TableDataButton";
import { FormField, TableData } from "../types";


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
      label={label || "Text Color"}
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
    <FontSizePicker
      value={value}
      onChange={onChange}
      label={label || "Font Size"}
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
    <BorderSizePicker
      value={value}
      onChange={onChange}
      label={label || "Border Size"}
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
