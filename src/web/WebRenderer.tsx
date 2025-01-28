import { Render } from "@measured/puck";
import "@measured/puck/puck.css";
import "./../main.css";
import { componentConfig } from "./config/components";
import { DefaultData } from "./default";
export interface WebRendererProps{
  data: unknown
}

export function WebRenderer({  data }: WebRendererProps) {


  return <Render config={componentConfig} data={data || DefaultData} />;
}
