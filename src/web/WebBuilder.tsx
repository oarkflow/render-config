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
import handlePublish from "./config/handlePublish";
import { DefaultData } from "./default";
import FieldsComponent from "./puck/FieldsComponent";
import HeaderActions from "./puck/HeaderActions";
import { PuckProps } from "./types";
import CMSComponents from "./puck/CMSComponents";

export interface WebBuilderProps extends PuckProps {
  viewports?: Array<{
    width: number;
    height: number | "auto";
    label: string;
    icon: JSX.Element;
  }>;
  plugin?: Plugin[];
  onPublish?: (data: unknown) => void;
}

// Lazy load the Puck editor
const PuckEditor = lazy(() =>
  import("@measured/puck").then((module) => ({
    default: module.Puck,
  }))
);

export default function WebBuilder(props: WebBuilderProps) {
  //if initial data is given directly
  let initialData = props.initialData || DefaultData;
  const urlParams = new URLSearchParams(window.location.search);
  const nodeId = urlParams.get("nodeId");
  //if not check for node id in url and fetch data from localstorage
  if (!initialData) {
    if (nodeId) {
      // Todo : fetch website data of specific node id  and remove localstorage data
      const data = localStorage.getItem(nodeId);
      if (data) {
        initialData = JSON.parse(data);
      }
    }
  }

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
        headerActions: ({ children }) => (
          <HeaderActions nodeId={nodeId} children={children} />
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
        ),
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
        {/* <div>
          <Link
            target="_blank"
            className="text-2xl rounded-md bg-black text-gray-300 p-2 cursor-pointer font-bold text-center mt-4 z-30 absolute bottom-4 right-4"
            to={`/app-preview?nodeId=${nodeId}`}
          >
            Preview
          </Link> */}

        <PuckEditor
          config={componentConfig}
          data={props.initialData || DefaultData}
          plugins={MyPlugin}
          onPublish={handlePublish}
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
