import { Render } from "@measured/puck";
import "@measured/puck/puck.css";
import "./../main.css";
import { componentConfig } from "./config/components";
export interface WebRendererProps {
  nodeId?: string;
  initialData?: {
    content: any[];
    root: { title: string };
  };
}

export function WebRenderer({ nodeId, initialData }: WebRendererProps) {
  let data = initialData || {
    content: [
      {
        type: "Text",
        props: {
          content: "404 not found.",
        },
      },
    ],
    root: { title: "My Website" },
  };

  if (!initialData && nodeId) {
    // Try to get data from localStorage if nodeId is provided and no initialData
    const storedData = localStorage.getItem(nodeId);
    if (storedData) {
      data = JSON.parse(storedData);
    }
  }

  return <Render config={componentConfig} data={data} />;
}
