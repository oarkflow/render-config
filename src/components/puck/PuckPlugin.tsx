// import { ActionBar } from "@/packages/measured/puck";
import type { Plugin } from "@/packages/measured/puck";
// import { RefreshCw } from "lucide-react";
import FieldsComponent from "./plugin/FieldsComponent";
import HeaderActions from "./plugin/HeaderActions";
import CMSComponents from "./plugin/CMSComponents";
import {CustomPuck} from "@/pages/CustomPuck";

const PuckPlugin: Plugin[] = [
  {
    overrides: {
      components: CMSComponents,
      // actionBar: ({ children }) => (
      //   <ActionBar label="Actions">
      //     <ActionBar.Group>
      //       {children}{" "}
      //       <RefreshCw
      //         height={16}
      //         width={16}
      //         className="self-center text-[#c3c3c3] mr-2 ml-1 cursor-pointer hover:text-[#646cff]"
      //       />
      //     </ActionBar.Group>
      //   </ActionBar>
      // ),
      fields: FieldsComponent,
      headerActions: HeaderActions,
      puck: () => <CustomPuck dataKey={"key-1"}/>
    },
  },
];

export default PuckPlugin;


