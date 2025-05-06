import { Config, Plugin } from "../packages/measured/puck";
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface BaseProps {
  align?: "left" | "center" | "right" | undefined;
  color?: string | null | undefined;
  backgroundColor?: string | null;
  fontSize?: string | null;
  fontWeight?: string | null;
  letterSpacing?: string | null;
  lineHeight?: string | null;
  textTransform?: string | null;
  margin?: string | null;
  padding?: string | null;
  tailwindClass?: string;
}

export interface ImageProps extends BaseProps {
  content: string;
  url?: string;
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
}
export interface HeadingProps extends BaseProps {
  content: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface TextProps extends BaseProps {
  content: string;
}

export interface ButtonProps {
  label: string;
  variant?: "default" | "primary" | "secondary";
  onClick?: () => void;
}

interface ListItem {
  content: string;
}

interface AllItems {
  mode: "manual" | "api";
  items: ListItem[];
  apiPath: string;
}

export interface BaseListProps {
  items: AllItems;
  listStylePosition?: "inside" | "outside";
  spacing?: "tight" | "normal" | "relaxed" | "loose";
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string | number;
  letterSpacing?: string;
  lineHeight?: string;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  margin?: string;
  padding?: string;
  tailwindClass?: string;
}

export interface OrderedListProps extends BaseListProps {
  listStyle?:
    | "decimal"
    | "decimal-leading-zero"
    | "lower-alpha"
    | "upper-alpha"
    | "lower-roman"
    | "upper-roman";
}

export interface UnorderedListProps extends BaseListProps {
  listStyle?: "disc" | "circle" | "square" | "none";
}

export interface ColumnContent {
  type: string;
  props: Record<string, unknown>;
}

export interface ColumnData {
  span: string | number;
  content: ColumnContent[];
}

export interface ColumnsProps {
  distribution: "auto" | "manual";
  columns: ColumnData[];
  className?: string;
  style?: React.CSSProperties;
}

export interface ColumnProps {
  span: string | number;
  content: ColumnContent[];
  className?: string;
  style?: React.CSSProperties;
}
export enum ButtonType {
  button = "button",
  submit = "submit",
  reset = "reset",
}
export enum Variant {
  default = "default",
  destructive = "destructive",
  outline = "outline",
  secondary = "secondary",
  ghost = "ghost",
  link = "link",
}
export enum Size {
  default = "default",
  sm = "sm",
  lg = "lg",
  icon = "icon",
}

export interface FormField {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  buttonType?: ButtonType;
  variant?: Variant;
  size?: Size;
  // CSS classes
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  wrapperClassName?: string;
}
export interface TableData {
  dataSource: "manual" | "api";
  headers?: string[];
  rows?: (string | number | boolean | null)[][];
  apiEndpoint?: string;
  rules?: object;
  data?: { [k: string]: unknown }[];
}
export interface FormProps extends BaseProps {
  name?: string;
  method?: string;
  action?: string;
  className?: string;
  puck: {
    renderDropZone: (props: {
      zone: string;
      allowedComponents: string[];
    }) => React.ReactNode;
  };
}

export type InputType =
  | "text"
  | "number"
  | "password"
  | "email"
  | "tel"
  | "url"
  | "date"
  | "time"
  | "datetime-local"
  | "textarea"
  | "select";

export interface InputProps extends BaseProps {
  name: string;
  label: string;
  inputType: InputType;
  placeholder?: string;
  required?: boolean;
  labelColor?: string;
  labelSize?: string;
  borderRadius?: string;
}

export interface PuckProps {
  key?: string;
  initialData: {
    content: Array<{
      type: string;
      props: Record<string, unknown>;
    }>;
  };
  viewports?: Array<{
    width: number;
    height: number | "auto";
    label: string;
    icon: JSX.Element;
  }>;
  plugin?: Plugin[];
  onPublish: (data: unknown) => void;
  onPreview: (data: unknown) => void;
  config?: Config;
  isLoading?: boolean;
}
