import PuckConfig from "@/components/puck/PuckConfig";
import { Render } from "../packages/measured/puck";
import "../packages/measured/puck/puck.css";
import "./../main.css";
import { DefaultData } from "./default";
export interface WebRendererProps{
  data: unknown
}

export function WebRenderer({  data }: WebRendererProps) {


  return <Render config={PuckConfig} data={data || DefaultData} />;
}
