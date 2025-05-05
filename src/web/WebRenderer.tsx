import { Render } from "../packages/measured/puck";
import "../packages/measured/puck/puck.css";
import "./../main.css";
import { DefaultData } from "./default";
import componentConfig from "../components/puck/PuckConfig";
export interface WebRendererProps{
  data: unknown
}

export function WebRenderer({  data }: WebRendererProps) {


  return <Render config={componentConfig} data={data || DefaultData} />;
}
