import { Config } from "@measured/puck";
import { PuckRichText } from "@tohuhono/puck-rich-text";
import ErrorBoundary from "../../components/ErrorBoundary";
import Button from "../components/elements/Button";
import Column from "../components/elements/Column";
import Form from "../components/elements/Form";
import Heading from "../components/elements/Heading";
import Image from "../components/elements/Image";
import Input from "../components/elements/Input";
import OrderedList from "../components/elements/OrderedList";
import Table from "../components/elements/Table";
import Text from "../components/elements/Text";
import UnorderedList from "../components/elements/UnorderedList";
import {
  ButtonProps,
  FormProps,
  HeadingProps,
  ImageProps,
  InputProps,
  OrderedListProps,
  TextProps,
  UnorderedListProps,
} from "../types";
import {
  renderBGColorPicker,
  renderColorPicker,
  renderContentField,
  renderPaddingPicker,
  renderTableDataButton,
} from "./fieldRenderers";
import { orderedListConfig, unorderedListConfig } from "./listConfig";
import {
  backgroundColorConfig,
  borderSizeConfig,
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
export const componentConfig: Config = {
  components: {
    "rich text": PuckRichText,
    Heading: {
      fields: {
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
        textAlign: textAlignConfig,
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
        textAlign: null,
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
      defaultProps: orderedListConfig.defaultProps,
      render: (props: OrderedListProps) => (
        <ErrorBoundary>
          <OrderedList {...props} />
        </ErrorBoundary>
      ),
    },
    UnorderedList: {
      fields: unorderedListConfig.fields,
      defaultProps: unorderedListConfig.defaultProps,
      render: (props: UnorderedListProps) => (
        <ErrorBoundary>
          <UnorderedList {...props} />
        </ErrorBoundary>
      ),
    },
    Table: {
      fields: {
        rows: {
          type: "number",
          label: "Rows",
        },
        columns: {
          type: "number",
          label: "Columns",
        },
        tableData: {
          type: "custom",
          label: "Table Data",
          render: renderTableDataButton,
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
        borderSize: borderSizeConfig,
        borderColor: {
          type: "custom",
          label: "Border Color",
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
      },
      defaultProps: {
        rows: 3,
        columns: 3,
        tableData: null,
        headerBackground: null,
        cellPadding: "1rem",
        borderSize: null,
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
        src: {
          type: "text",
          label: "Image URL",
        },
        alt: {
          type: "text",
          label: "Alt Text",
        },
        width: {
          type: "text",
          label: "Width",
        },
        height: {
          type: "text",
          label: "Height",
        },
      },
      defaultProps: {
        src: "",
        alt: "",
        width: "",
        height: "",
      },
      render: (props: ImageProps) => {
        return (
          <ErrorBoundary>
            <Image {...props} />
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
      ],
    },
    Puck: {
      components: ["rich text"],
    },
    Form: {
      components: ["Form", "Input", "Button"],
    },

    Layout: {
      components: ["Column", "Table"],
    },
  },
};
