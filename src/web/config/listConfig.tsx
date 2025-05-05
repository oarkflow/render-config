import { ComponentConfig } from "../../packages/measured/puck";
import {
  backgroundColorConfig,
  colorConfig,
  fontSizeConfig,
  fontWeightConfig,
  letterSpacingConfig,
  lineHeightConfig,
  marginConfig,
  paddingConfig,
  tailwindClass,
  textTransformConfig,
  ToggleField,
  ToggleFieldProps,
} from "./StyleConfig";
import ListItemsField from "./componentConfigs/ListItemsField";

const renderToggleField = ({
  value,
  onChange,
  label,
  options,
}: ToggleFieldProps) => (
  <ToggleField
    value={value}
    onChange={onChange}
    label={label}
    options={options}
  />
);

export const orderedListConfig: ComponentConfig = {
  fields: {
    items: {
      type: "custom",
      label: "List Items",
      render: ({ value, onChange }) => (
        <ListItemsField value={value} onChange={onChange} />
      ),
    },
    listStyle: {
      type: "custom",
      label: "List Style",
      render: ({ value, onChange, field }) =>
        renderToggleField({
          value,
          onChange,
          label: field.label || "List Style",
          options: [
            { label: "Decimal", value: "decimal" },
            { label: "Decimal Leading Zero", value: "decimal-leading-zero" },
            { label: "Lower Alpha", value: "lower-alpha" },
            { label: "Upper Alpha", value: "upper-alpha" },
            { label: "Lower Roman", value: "lower-roman" },
            { label: "Upper Roman", value: "upper-roman" },
          ],
        }),
    },
    listStylePosition: {
      type: "custom",
      label: "List Style Position",
      render: ({ value, onChange, field }) =>
        renderToggleField({
          value,
          onChange,
          label: field.label || "List Style Position",
          options: [
            { label: "Inside", value: "inside" },
            { label: "Outside", value: "outside" },
          ],
        }),
    },
    color: colorConfig,
    backgroundColor: backgroundColorConfig,
    fontSize: fontSizeConfig,
    fontWeight: fontWeightConfig,
    letterSpacing: letterSpacingConfig,
    lineHeight: lineHeightConfig,
    textTransform: textTransformConfig,
    margin: marginConfig,
    padding: paddingConfig,
    tailwindClass: tailwindClass,
  },
  defaultProps: {
    items: [{ content: "List item 1" }, { content: "List item 2" }],
    listStyle: "decimal",
    spacing: "normal",
  },
  render: function (props): JSX.Element {
    const {
      items = [],
      listStyle = "decimal",
      listStylePosition = "outside",
      ...rest
    } = props;
    const safeItems = Array.isArray(items?.items)
      ? items.items
      : Array.isArray(items)
      ? items
      : [];

    return (
      <ol style={{ listStyle, listStylePosition }} {...rest}>
        {safeItems.map((item: { content: string }, index: number) => (
          <li key={index}>{item.content}</li>
        ))}
      </ol>
    );
  },
};

export const unorderedListConfig: ComponentConfig = {
  fields: {
    items: {
      type: "custom",
      label: "List Items",
      render: ({ value, onChange }) => (
        <ListItemsField value={value} onChange={onChange} />
      ),
    },
    listStyle: {
      type: "custom",
      label: "List Style",
      render: ({ value, onChange, field }) =>
        renderToggleField({
          value,
          onChange,
          label: field.label || "List Style",
          options: [
            { label: "Disc", value: "disc" },
            { label: "Circle", value: "circle" },
            { label: "Square", value: "square" },
            { label: "None", value: "none" },
          ],
        }),
    },
    listStylePosition: {
      type: "custom",
      label: "List Style Position",
      render: ({ value, onChange, field }) =>
        renderToggleField({
          value,
          onChange,
          label: field.label || "List Style Position",
          options: [
            { label: "Inside", value: "inside" },
            { label: "Outside", value: "outside" },
          ],
        }),
    },
    color: colorConfig,
    backgroundColor: backgroundColorConfig,
    fontSize: fontSizeConfig,
    fontWeight: fontWeightConfig,
    letterSpacing: letterSpacingConfig,
    lineHeight: lineHeightConfig,
    textTransform: textTransformConfig,
    margin: marginConfig,
    padding: paddingConfig,
    tailwindClass: tailwindClass,
  },
  defaultProps: {
    items: [{ content: "List item 1" }, { content: "List item 2" }],
    listStyle: "disc",
    spacing: "normal",
  },
  render: (props) => {
    const {
      items = [],
      listStyle = "disc",
      listStylePosition = "outside",
      ...rest
    } = props;
    const safeItems = Array.isArray(items?.items)
      ? items.items
      : Array.isArray(items)
      ? items
      : [];

    return (
      <ul style={{ listStyle, listStylePosition }} {...rest}>
        {safeItems.map((item: { content: string }, index: number) => (
          <li key={index}>{item.content}</li>
        ))}
      </ul>
    );
  },
};
