import { ActionBar, Plugin } from "@measured/puck";
import "@measured/puck/puck.css";
import {
  Computer,
  Laptop2Icon,
  RefreshCw,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./../components/ErrorBoundary";
import "./../main.css";
import { componentConfig } from "./config/components";
// import handlePublish from "./config/handlePublish";
import { DefaultData } from "./default";
import CMSComponents from "./puck/CMSComponents";
import FieldsComponent from "./puck/FieldsComponent";
import HeaderActions from "./puck/HeaderActions";
import { PuckProps } from "./types";
export interface WebBuilderProps extends PuckProps {}

// Lazy load the Puck editor
const PuckEditor = lazy(() =>
  import("@measured/puck").then((module) => ({
    default: module.Puck,
  }))
);

export default function WebBuilder(props: PuckProps) {
  const MyPlugin: Plugin[] = props.plugin || [
    {
      overrides: {
        components: CMSComponents,
        actionBar: ({ children }) => (
          <ActionBar label="Actions">
            <ActionBar.Group>
              {children}{" "}
              <RefreshCw
                height={16}
                width={16}
                className="self-center text-[#c3c3c3] mr-2 ml-1 cursor-pointer hover:text-[#646cff]"
              />
            </ActionBar.Group>
          </ActionBar>
        ),
        fields: FieldsComponent,
        headerActions: ({ children }) => {
          return (
            <HeaderActions onPreview={props.onPreview} children={children} />
            //   {children}
            //   <Button
            //     onClick={(e) => {
            //       e.preventDefault();
            //       const { appState } = usePuck();
            //       const currentData = appState.data;
            //       console.log(currentData,"currentData");
            //       // handlePublish(currentData);
            //       window.open(`/app-preview?nodeId=${nodeId}`, "_blank");
            //      }}
            //   >
            //     Preview
            //   </Button>
            // </div>
          );
        },
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
          config={componentConfig}
          data={props.initialData || DefaultData}
          plugins={MyPlugin}
          onPublish={props.onPublish}
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
