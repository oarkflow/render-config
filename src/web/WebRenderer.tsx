import { Render } from "@measured/puck";
import "@measured/puck/puck.css";
import "./../main.css";
import { componentConfig } from "./config/components";
import { DefaultData } from "./default";
import { PuckProps } from "./types";
export interface WebRendererProps extends PuckProps {
  
}

export function WebRenderer({ nodeId, initialData }: WebRendererProps) {
  let data = initialData;

  if (!initialData && nodeId) {
    // Try to get data from localStorage if nodeId is provided and no initialData
    const storedData = localStorage.getItem(nodeId);
    if (storedData) {
      data = JSON.parse(storedData);
    }
  }

  return <Render config={componentConfig} data={data || DefaultData} />;
}
