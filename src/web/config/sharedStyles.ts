import { Field } from "../../packages/measured/puck";

export const baseStyleFields = {
  textAlign: {
    type: "select",
    label: "Text Align",
    options: [
      { label: "Left", value: "text-left" },
      { label: "Center", value: "text-center" },
      { label: "Right", value: "text-right" },
    ],
  },
  margin: {
    type: "select",
    label: "Margin",
    options: [
      { label: "None", value: "m-0" },
      { label: "Small", value: "m-2" },
      { label: "Medium", value: "m-4" },
      { label: "Large", value: "m-8" },
    ],
  },
  padding: {
    type: "select",
    label: "Padding",
    options: [
      { label: "None", value: "p-0" },
      { label: "Small", value: "p-2" },
      { label: "Medium", value: "p-4" },
      { label: "Large", value: "p-8" },
    ],
  },
} as const satisfies Record<string, Field>;
