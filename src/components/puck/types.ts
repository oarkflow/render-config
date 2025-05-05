import { Plugin } from "../../packages/measured/puck";
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
  content?: string;
  url?: string;
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  image?: {
    src: string;
    alt: string;
  };
}

export interface HeadingProps extends BaseProps {
  content: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  BorderSizePicker?: string;
}

export interface TextProps extends BaseProps {
  content: string;
}

export interface LinkProps extends BaseProps {
  content: string;
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

export interface HtmlProps {
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
  integrationName?: string;
  fieldName?: string;
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

export interface GridItemProps {
  area?: string;
  column?: string;
  row?: string;
  content: React.ReactNode[];
}

export interface FlexItemProps {
  grow?: string;
  shrink?: string;
  basis?: string;
  order?: string;
  content: React.ReactNode[];
}

export interface FlexProps extends BaseProps {
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
  alignItems?: "stretch" | "flex-start" | "flex-end" | "center" | "baseline";
  alignContent?: "stretch" | "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
  gap?: string;
  rowGap?: string;
  columnGap?: string;
  borderSize?: string | null;
  borderColor?: string | null;
  columns?: number;
  items?: FlexItemProps[];
  puck?: {
    renderDropZone: (props: {
      zone: string;
      allowedComponents: string[];
    }) => React.ReactNode;
  };
}

export interface GridProps extends BaseProps {
  columns?: string;
  rows?: string;
  gap?: string;
  rowGap?: string;
  columnGap?: string;
  justifyItems?: "start" | "end" | "center" | "stretch";
  alignItems?: "start" | "end" | "center" | "stretch";
  justifyContent?: "start" | "end" | "center" | "stretch" | "space-around" | "space-between" | "space-evenly";
  alignContent?: "start" | "end" | "center" | "stretch" | "space-around" | "space-between" | "space-evenly";
  autoColumns?: string;
  autoRows?: string;
  templateAreas?: string;
  borderSize?: string | null;
  borderColor?: string | null;
  items?: GridItemProps[];
  numCells?: number;
  puck?: {
    renderDropZone: (props: {
      zone: string;
      allowedComponents: string[];
    }) => React.ReactNode;
  };
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

export interface TableField {
  name: string;
}

export interface TableRow {
  [key: string]: string | number | boolean | null;
}

export interface TableData {
  dataSource: "manual" | "api";
  headers?: string[];
  rows?: (string | number | boolean | null)[][];
  apiEndpoint?: string;
  rules?: object;
  data?: TableRow[];
  mode?: "manual" | "api";
  apiPath?: string;
  integrationName?: string;
  fieldName?: string;
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
}
export enum PageStatus {
  draft = "draft",
  published = "published",
  archived = "archived",
  active = "active",
}

export interface PageTemplate {
  page_template_id?: number;
  name: string;
  key: string;
  image_url?: string;
  metadata: string;
  status: PageStatus;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  visits?: number;
  success?: boolean;
}
