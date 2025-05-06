/* eslint-disable @typescript-eslint/no-explicit-any */
// Editor.jsx
import PuckConfig from "../components/puck/PuckConfig";
import PuckPlugin from "../components/puck/PuckPlugin";
import { Puck } from "../packages/measured/puck";
import { PuckProps } from "./types";
import { Plugin } from "../packages/measured/puck";
import { DefaultData } from "./default";
import { Computer, Laptop2Icon, Smartphone, Tablet } from "lucide-react";
// Render Puck editor
export interface WebBuilderProps extends PuckProps {}
export default function WebBuilder(props: WebBuilderProps) {
  const MyPlugin: Plugin[] = [...(props.plugin || []), ...PuckPlugin];
  // const [loading, setLoading] = useState(true);
  // const [data, setData] = useState<any>({});

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const apiData = props.initialData
  //         ? JSON.parse(props.initialData as any)
  //         : {};
  //       if (apiData.builder) {
  //         setData(apiData.builder);
  //       }
  //       if (apiData.datasource) {
  //         localStorage.setItem(
  //           "localJsonData",
  //           JSON.stringify(apiData.datasource.localData)
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error fetching template:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [props.initialData]);
  // const [showPopup, setShowPopup] = useState(false);
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <Puck
        config={props.config ? props.config : PuckConfig}
        plugins={MyPlugin}
        data={props.initialData || DefaultData}
        onPublish={
          props.onPublish
            ? props.onPublish
            : async (puckData: any) => {
                console.log(puckData, "puckData");
                console.log("Please use onPublish prop to handle publish");
              }
        }
        viewports={
          props.viewports || [
            {
              width: 1440,
              height: "auto",
              label: "Desktop",
              icon: <Computer />,
            },
            {
              width: 1280,
              height: "auto",
              label: "Laptop",
              icon: <Laptop2Icon />,
            },
            {
              width: 768,
              height: "auto",
              label: "Tablet",
              icon: <Tablet />,
            },
            {
              width: 375,
              height: "auto",
              label: "Mobile",
              icon: <Smartphone />,
            },
          ]
        }
      />
    </>
  );
}
