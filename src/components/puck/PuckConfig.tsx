import RichTextConfig from "./RichTextConfig";
// import ErrorBoundary from "./puckComponents/ErrorBoundary";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  renderBGColorPicker,
  renderColorPicker,
  renderContentField,
  renderPaddingPicker,
} from "./fieldRenderers";
import { orderedListConfig, unorderedListConfig } from "./listConfig";
import Button from "./puckComponents/elements/Button";
import Column from "./puckComponents/elements/Column";
import CustomElement from "./puckComponents/elements/Custom";
import Form from "./puckComponents/elements/Form";
import Heading from "./puckComponents/elements/Heading";
import Html from "./puckComponents/elements/Html";
import Image from "./puckComponents/elements/Image";
import Input from "./puckComponents/elements/Input";
import Link from "./puckComponents/elements/Link";
import OrderedList from "./puckComponents/elements/OrderedList";
import Table from "./puckComponents/elements/Table";
import Text from "./puckComponents/elements/Text";
import UnorderedList from "./puckComponents/elements/UnorderedList";
import Flex from "./puckComponents/elements/Flex";
import Grid from "./puckComponents/elements/Grid";
import ImageUploader from "./puckComponents/ImageUploader";
import SizePicker from "./puckComponents/SizePicker"; // Import SizePicker component
import TableItemsField from "./TableItemsField";
import {
  backgroundColorConfig,
  borderSizeConfig,
  borderColorConfig,
  colorConfig,
  fontSizeConfig,
  fontWeightConfig,
  letterSpacingConfig,
  lineHeightConfig,
  marginConfig,
  paddingConfig,
  tailwindClass,
  textAlignConfig,
  textTransformConfig,
} from "./StyleConfig";
import {
  ButtonProps,
  FlexProps,
  FormProps,
  GridProps,
  HeadingProps,
  HtmlProps,
  ImageProps,
  InputProps,
  LinkProps,
  OrderedListProps,
  TextProps,
  UnorderedListProps,
} from "./types";
import { Config } from "../../packages/measured/puck/types";

const componentConfig: Config = {
  components: {
    "rich text": RichTextConfig,
    Heading: {
      fields: {
        BorderSizePicker: borderSizeConfig,
        content: {
          type: "custom",
          label: "Content",
          render: renderContentField,
        },
        tag: {
          type: "select",
          label: "Tag",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" },
          ],
        },
        align: textAlignConfig,
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
        content: "Heading",
        align: null,
        color: null,
        backgroundColor: null,
        fontSize: "3.5rem",
        fontWeight: null,
        letterSpacing: null,
        lineHeight: null,
        textTransform: null,
        margin: null,
        padding: null,
        tailwindClass: "",
      },
      render: (props: HeadingProps) => {
        return (
          <ErrorBoundary>
            <Heading {...props} />
          </ErrorBoundary>
        );
      },
    },
    Text: {
      fields: {
        content: {
          type: "custom",
          label: "Content",
          render: renderContentField,
        },
        align: textAlignConfig,
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
        content: "New text block",
        align: null,
        color: null,
        backgroundColor: null,
        fontSize: null,
        fontWeight: null,
        letterSpacing: null,
        lineHeight: null,
        textTransform: null,
        margin: null,
        padding: null,
        tailwindClass: "",
      },
      render: (props: TextProps) => {
        return (
          <ErrorBoundary>
            <Text {...props} />
          </ErrorBoundary>
        );
      },
    },
    Link: {
      fields: {
        content: {
          type: "custom",
          label: "Text",
          render: renderContentField,
        },
        href: {
          type: "text",
          label: "URL",
        },
        target: {
          type: "select",
          label: "Open in",
          options: [
            { label: "Same Window", value: "_self" },
            { label: "New Window", value: "_blank" },
          ],
        },
        rel: {
          type: "text",
          label: "Rel Attribute",
        },
        align: textAlignConfig,
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
        content: "New Link",
        href: "#",
        target: "_self",
        rel: "",
        align: null,
        color: "#0000EE",
        backgroundColor: null,
        fontSize: null,
        fontWeight: null,
        letterSpacing: null,
        lineHeight: null,
        textTransform: null,
        margin: null,
        padding: null,
        tailwindClass: "",
      },
      render: (props: LinkProps) => {
        return (
          <ErrorBoundary>
            <Link {...props} />
          </ErrorBoundary>
        );
      },
    },
    Html: {
      fields: {
        content: {
          type: "textarea",
          label: "HTML Content",
          placeholder: "<div>Your HTML code here</div>",
        },
      },
      defaultProps: {
        content: "<div>Your HTML content here</div>",
      },
      render: (props: HtmlProps) => {
        return (
          <ErrorBoundary>
            <Html {...props} />
          </ErrorBoundary>
        );
      },
    },
    Button: {
      fields: {
        label: {
          type: "text",
          label: "Button Label",
        },
        name: {
          type: "text",
          label: "Button name",
        },
        variant: {
          type: "select",
          label: "Button Variant",
          options: [
            { label: "Default", value: "default" },
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
          ],
        },
        tailwindClass: tailwindClass,
      },
      defaultProps: {
        label: "New Button",
        variant: "default",
        tailwindClass: "",
      },
      render: (props: ButtonProps) => {
        return (
          <ErrorBoundary>
            <Button {...props} />
          </ErrorBoundary>
        );
      },
    },
    OrderedList: {
      fields: orderedListConfig.fields,
      render: (props: OrderedListProps) => (
        <ErrorBoundary>
          <OrderedList {...props} />
        </ErrorBoundary>
      ),
    },
    UnorderedList: {
      fields: unorderedListConfig.fields,
      render: (props: UnorderedListProps) => (
        <ErrorBoundary>
          <UnorderedList {...props} />
        </ErrorBoundary>
      ),
    },
    Table: {
      fields: {
        content: {
          type: "custom",
          label: "Table Data",
          render: ({ value, onChange }) => (
            <TableItemsField
              value={
                value || {
                  mode: "manual",
                  dataSource: "manual",
                  headers: ["Column 1", "Column 2"],
                  rows: [
                    ["", ""],
                    ["", ""],
                  ],
                }
              }
              onChange={onChange}
            />
          ),
        },
        headerBackground: {
          type: "custom",
          label: "Header Background",
          render: renderBGColorPicker,
        },
        cellPadding: {
          type: "custom",
          label: "Cell Padding",
          render: renderPaddingPicker,
        },
        cellMinWidth: {
          type: "text",
          label: "Cell Minimum Width",
        },
        borderSize: borderSizeConfig,
        borderColor: {
          type: "custom",
          label: "Border Color",
          render: renderColorPicker,
        },
        headerTextColor: {
          type: "custom",
          label: "Header Text Color",
          render: renderColorPicker,
        },
        cellBackground: {
          type: "custom",
          label: "Cell Background",
          render: renderBGColorPicker,
        },
        cellTextColor: {
          type: "custom",
          label: "Cell Text Color",
          render: renderColorPicker,
        },
        headerAlignment: {
          type: "select",
          label: "Header Text Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        bodyAlignment: {
          type: "select",
          label: "Body Text Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        content: {
          mode: "manual",
          dataSource: "manual",
          headers: ["Column 1", "Column 2"],
          rows: [
            ["", ""],
            ["", ""],
          ],
        },
        headerBackground: null,
        cellPadding: "0.5rem",
        cellMinWidth: "120px",
        borderSize: "1px",
        borderColor: null,
        headerTextColor: null,
        cellBackground: null,
        cellTextColor: null,
        headerAlignment: "left",
        bodyAlignment: "left",
      },
      render: Table,
    },
    Column: {
      fields: {
        distribution: {
          type: "select",
          label: "Distribution",
          options: [
            { label: "Auto", value: "auto" },
            { label: "Manual", value: "manual" },
          ],
        },
        columns: {
          type: "array",
          label: "Columns",
          getItemSummary: (item: { span: string }) =>
            `Column (${item.span === "auto" ? "Auto" : item.span + "/12"})`,
          arrayFields: {
            span: {
              type: "text",
              label: "Width (1-12)",
            },
          },
          defaultItemProps: {
            span: "auto",
            content: [],
          },
          max: 12,
        },
        tailwindClass: tailwindClass,
      },
      defaultProps: {
        distribution: "auto",
        columns: [
          { span: "auto", content: [] },
          { span: "auto", content: [] },
        ],
        tailwindClass: "",
      },
      render: Column,
    },
    Form: {
      fields: {
        name: {
          type: "text",
          label: "Form Name",
        },
        method: {
          type: "select",
          label: "Form Method",
          options: [
            { label: "POST", value: "post" },
            { label: "GET", value: "get" },
          ],
        },
        action: {
          type: "text",
          label: "Form Action URL",
        },
        color: colorConfig,
        backgroundColor: backgroundColorConfig,
        padding: paddingConfig,
        margin: marginConfig,
        tailwindClass: tailwindClass,
      },
      defaultProps: {
        name: "",
        method: "post",
        action: "",
        color: null,
        backgroundColor: null,
        padding: null,
        margin: null,
        tailwindClass: "",
      },
      render: (props: FormProps) => (
        <ErrorBoundary>
          <Form {...props} />
        </ErrorBoundary>
      ),
    },
    Flex: {
      fields: {
        direction: {
          type: "select",
          label: "Direction",
          options: [
            { label: "Row", value: "row" },
            { label: "Column", value: "column" },
          ],
        },
        wrap: {
          type: "select",
          label: "Wrap",
          options: [
            { label: "No Wrap", value: "nowrap" },
            { label: "Wrap", value: "wrap" },
          ],
        },
        justifyContent: {
          type: "select",
          label: "Justify Content",
          options: [
            { label: "Start", value: "flex-start" },
            { label: "End", value: "flex-end" },
            { label: "Center", value: "center" },
            { label: "Space Between", value: "space-between" },
          ],
        },
        alignItems: {
          type: "select",
          label: "Align Items",
          options: [
            { label: "Stretch", value: "stretch" },
            { label: "Start", value: "flex-start" },
            { label: "End", value: "flex-end" },
            { label: "Center", value: "center" },
          ],
        },
        alignContent: {
          type: "select",
          label: "Align Content",
          options: [
            { label: "Stretch", value: "stretch" },
            { label: "Start", value: "flex-start" },
            { label: "End", value: "flex-end" },
            { label: "Center", value: "center" },
          ],
        },
        items: {
          type: "array",
          label: "Flex Items",
          getItemSummary: (item: { grow?: string; shrink?: string }) =>
            `Flex Item (grow: ${item.grow || "1"}, shrink: ${
              item.shrink || "0"
            })`,
          arrayFields: {
            grow: {
              type: "text",
              label: "Flex Grow",
            },
            shrink: {
              type: "text",
              label: "Flex Shrink",
            },
            basis: {
              type: "text",
              label: "Flex Basis",
            },
            order: {
              type: "text",
              label: "Order",
            },
          },
          defaultItemProps: {
            grow: "1",
            shrink: "0",
            basis: "0",
            order: "",
            content: [],
          },
          max: 12,
        },
        columns: {
          type: "select",
          label: "Number of Columns",
          options: [
            { label: "Auto (No Wrapping)", value: "0" },
            { label: "1 Column", value: "1" },
            { label: "2 Columns", value: "2" },
            { label: "3 Columns", value: "3" },
            { label: "4 Columns", value: "4" },
            { label: "5 Columns", value: "5" },
            { label: "6 Columns", value: "6" },
          ],
        },
        gap: {
          type: "text",
          label: "Gap (px, rem, em)",
        },
        rowGap: {
          type: "text",
          label: "Row Gap (px, rem, em)",
        },
        columnGap: {
          type: "text",
          label: "Column Gap (px, rem, em)",
        },
        color: colorConfig,
        backgroundColor: backgroundColorConfig,
        borderSize: borderSizeConfig,
        borderColor: borderColorConfig,
        padding: paddingConfig,
        margin: marginConfig,
        tailwindClass: tailwindClass,
      },
      defaultProps: {
        direction: "row",
        wrap: "nowrap",
        justifyContent: "flex-start",
        alignItems: "stretch",
        alignContent: "stretch",
        items: [
          { grow: "1", shrink: "0", basis: "0", content: [] },
          { grow: "1", shrink: "0", basis: "0", content: [] },
        ],
        columns: "0",
        gap: "",
        rowGap: "",
        columnGap: "",
        color: null,
        backgroundColor: null,
        borderSize: null,
        borderColor: null,
        padding: null,
        margin: null,
        tailwindClass: "",
      },
      render: (props: FlexProps) => (
        <ErrorBoundary>
          <Flex {...props} />
        </ErrorBoundary>
      ),
    },
    Grid: {
      fields: {
        columns: {
          type: "select",
          label: "Grid Layout",
          options: [
            { label: "2 Columns", value: "repeat(2, 1fr)" },
            { label: "3 Columns", value: "repeat(3, 1fr)" },
            { label: "4 Columns", value: "repeat(4, 1fr)" },
            { label: "5 Columns", value: "repeat(5, 1fr)" },
            { label: "6 Columns", value: "repeat(6, 1fr)" },
          ],
        },
        numCells: {
          type: "select",
          label: "Number of Grid Cells",
          options: [
            { label: "2 Cells", value: "2" },
            { label: "3 Cells", value: "3" },
            { label: "4 Cells", value: "4" },
            { label: "6 Cells", value: "6" },
            { label: "8 Cells", value: "8" },
            { label: "9 Cells", value: "9" },
            { label: "12 Cells", value: "12" },
          ],
        },
        items: {
          type: "array",
          label: "Grid Items",
          getItemSummary: (item: {
            area?: string;
            column?: string;
            row?: string;
          }) =>
            `Grid Item ${
              item.area
                ? `(area: ${item.area})`
                : item.column
                ? `(column: ${item.column})`
                : ""
            }`,
          arrayFields: {
            area: {
              type: "text",
              label: "Grid Area",
            },
            column: {
              type: "text",
              label: "Grid Column",
            },
            row: {
              type: "text",
              label: "Grid Row",
            },
          },
          defaultItemProps: {
            area: "",
            column: "",
            row: "",
            content: [],
          },
          max: 12,
        },
        rows: {
          type: "text",
          label: "Grid Rows (e.g., 'auto auto')",
        },
        gap: {
          type: "text",
          label: "Gap (px, rem, em)",
        },
        rowGap: {
          type: "text",
          label: "Row Gap (px, rem, em)",
        },
        columnGap: {
          type: "text",
          label: "Column Gap (px, rem, em)",
        },
        justifyItems: {
          type: "select",
          label: "Justify Items",
          options: [
            { label: "Stretch", value: "stretch" },
            { label: "Start", value: "start" },
            { label: "End", value: "end" },
            { label: "Center", value: "center" },
          ],
        },
        alignItems: {
          type: "select",
          label: "Align Items",
          options: [
            { label: "Stretch", value: "stretch" },
            { label: "Start", value: "start" },
            { label: "End", value: "end" },
            { label: "Center", value: "center" },
          ],
        },
        justifyContent: {
          type: "select",
          label: "Justify Content",
          options: [
            { label: "Start", value: "start" },
            { label: "End", value: "end" },
            { label: "Center", value: "center" },
            { label: "Stretch", value: "stretch" },
            { label: "Space Between", value: "space-between" },
            { label: "Space Around", value: "space-around" },
            { label: "Space Evenly", value: "space-evenly" },
          ],
        },
        alignContent: {
          type: "select",
          label: "Align Content",
          options: [
            { label: "Start", value: "start" },
            { label: "End", value: "end" },
            { label: "Center", value: "center" },
            { label: "Stretch", value: "stretch" },
            { label: "Space Between", value: "space-between" },
            { label: "Space Around", value: "space-around" },
            { label: "Space Evenly", value: "space-evenly" },
          ],
        },
        color: colorConfig,
        backgroundColor: backgroundColorConfig,
        borderSize: borderSizeConfig,
        borderColor: borderColorConfig,
        padding: paddingConfig,
        margin: marginConfig,
        tailwindClass: tailwindClass,
      },
      defaultProps: {
        columns: "repeat(3, 1fr)",
        numCells: "6",
        items: [],
        rows: "",
        gap: "",
        rowGap: "",
        columnGap: "",
        justifyItems: "stretch",
        alignItems: "stretch",
        justifyContent: "start",
        alignContent: "start",
        color: null,
        backgroundColor: null,
        borderSize: null,
        borderColor: null,
        padding: null,
        margin: null,
        tailwindClass: "",
      },
      render: (props: GridProps) => (
        <ErrorBoundary>
          <Grid {...props} />
        </ErrorBoundary>
      ),
    },
    Input: {
      fields: {
        name: { type: "text", label: "Field Name" },
        label: { type: "text", label: "Label" },
        inputType: {
          type: "select",
          label: "Input Type",
          options: [
            { label: "Text", value: "text" },
            { label: "Number", value: "number" },
            { label: "Password", value: "password" },
            { label: "Email", value: "email" },
            { label: "Tel", value: "tel" },
            { label: "URL", value: "url" },
            { label: "Date", value: "date" },
            { label: "Time", value: "time" },
            { label: "DateTime", value: "datetime-local" },
            { label: "Textarea", value: "textarea" },
            { label: "Select", value: "select" },
          ],
        },
        placeholder: { type: "text", label: "Placeholder" },
        required: {
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        labelColor: {
          type: "custom",
          label: "Label Color",
          render: renderColorPicker,
        },
        labelSize: {
          type: "select",
          label: "Label Font Size",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "base" },
            { label: "Large", value: "lg" },
          ],
        },
        borderRadius: {
          type: "select",
          label: "Border Radius",
          options: [
            { label: "None", value: "none" },
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Full", value: "full" },
          ],
        },
        color: colorConfig,
        backgroundColor: backgroundColorConfig,
        padding: paddingConfig,
        margin: marginConfig,
        tailwindClass: tailwindClass,
      },
      defaultProps: {
        name: "",
        label: "Input Field",
        inputType: "text",
        placeholder: "Enter value...",
        required: false,
        labelColor: "#374151",
        labelSize: "sm",
        borderRadius: "md",
        color: null,
        backgroundColor: null,
        margin: null,
        padding: null,
        tailwindClass: "",
      },
      render: (props: InputProps) => (
        <ErrorBoundary>
          <Input {...props} inputType={props.inputType} />
        </ErrorBoundary>
      ),
    },
    Image: {
      fields: {
        image: {
          type: "custom",
          label: "Image",
          render: ({
            value,
            onChange,
          }: {
            value: ImageProps["image"] | string | undefined;
            onChange: (value: ImageProps["image"]) => void;
          }) => {
            const imageValue = value
              ? typeof value === "object"
                ? value
                : { src: value, alt: "" }
              : { src: "", alt: "" };

            return (
              <ImageUploader
                value={imageValue.src}
                altText={imageValue.alt}
                onChange={(src: string) => {
                  onChange({ ...imageValue, src });
                }}
                onAltTextChange={(alt: string) => {
                  onChange({ ...imageValue, alt });
                }}
                label="Image"
              />
            );
          },
        },
        width: {
          type: "custom",
          label: "Width",
          render: ({ value, onChange }) => (
            <SizePicker
              value={value}
              onChange={onChange}
              label="Width"
              units={["px", "%", "rem", "em", "vw", "auto"]}
              step="1"
              formatValue={(size, unit) =>
                unit === "auto" ? "auto" : `${size}${unit}`
              }
            />
          ),
        },
        height: {
          type: "custom",
          label: "Height",
          render: ({ value, onChange }) => (
            <SizePicker
              value={value}
              onChange={onChange}
              label="Height"
              units={["px", "%", "rem", "em", "vh", "auto"]}
              step="1"
              formatValue={(size, unit) =>
                unit === "auto" ? "auto" : `${size}${unit}`
              }
            />
          ),
        },
        objectFit: {
          type: "select",
          label: "Object Fit",
          options: [
            { label: "Fill", value: "fill" },
            { label: "Contain", value: "contain" },
            { label: "Cover", value: "cover" },
            { label: "None", value: "none" },
            { label: "Scale Down", value: "scale-down" },
          ],
        },
      },
      defaultProps: {
        image: { src: "", alt: "" },
        width: "",
        height: "",
        objectFit: "cover",
      },
      render: (props: ImageProps) => {
        // Extract src and alt from the image object
        const { image, ...restProps } = props;
        const imageProps = {
          src: image?.src || "",
          alt: image?.alt || "",
          ...restProps,
        };

        return (
          <ErrorBoundary>
            <Image {...imageProps} />
          </ErrorBoundary>
        );
      },
    },
    Custom: {
      render: () => {
        return (
          <ErrorBoundary>
            <CustomElement />
          </ErrorBoundary>
        );
      },
    },
  },
  categories: {
    Basic: {
      components: [
        "Heading",
        "Text",
        "Image",
        "Link",
        "OrderedList",
        "UnorderedList",
        "Html",
        "rich text",
      ],
    },
    Form: {
      components: ["Form", "Input", "Button"],
    },
    Layout: {
      components: ["Column", "Table", "Flex", "Grid"],
    },
    "User Defined": {
      components: ["Custom"],
    },
  },
};

export default componentConfig;
