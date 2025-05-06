/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Editor.jsx
import PuckConfig from "../components/puck/PuckConfig";
import PuckPlugin from "../components/puck/PuckPlugin";
import { PuckProps } from "./types";
import { Plugin } from "../packages/measured/puck";
import { DefaultData } from "./default";
import { Computer, Eye, Globe, Laptop2Icon, Smartphone, Tablet } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { lazy, Suspense } from "react";
import CMSComponents from "@/components/puck/plugin/CMSComponents";
import FieldsComponent from "@/components/puck/plugin/FieldsComponent";
import { Button } from "@/components/ui";
import { CustomPuck } from "@/components/puck/CustomPuck";
// Render Puck editor
export interface WebBuilderProps extends PuckProps {}
const PuckEditor = lazy(() =>
  import("../packages/measured/puck").then((module) => ({
    default: module.Puck,
  }))
);


export default function WebBuilder(props: WebBuilderProps) {
  const MyPlugin: Plugin[] = [...(props.plugin || []), 
    {
      overrides: {
        components: CMSComponents,
        fields: FieldsComponent,
        headerActions: ({ children }) => {
          return (
            <>
            <Button onClick={props.onPreview} disabled={props.isLoading}>
              <Eye className="mr-2 h-4 w-4" /> {props.isLoading ? "Saving..." : "Preview"}
            </Button>
            <Button onClick={props.onPublish} disabled={props.isLoading}>
              <Globe className="mr-2 h-4 w-4" /> {props.isLoading ? "Saving..." : "Publish"}
            </Button> 
          </>        
          );
        },
        puck: () => <CustomPuck dataKey={"key-1"}/>
      },
    },
  ];
 

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            Loading editor...
          </div>
        }
      >
        <PuckEditor
          config={props.config ? props.config : PuckConfig}
          plugins={MyPlugin}
          data={props.initialData || DefaultData}
          // onPublish={props.onPublish}
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
      </Suspense>
    </ErrorBoundary>
  );
}
