/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionBar, Plugin } from "@measured/puck";
import "@measured/puck/puck.css";
import "./../main.css";
import {
  Computer,
  Laptop2Icon,
  RefreshCw,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./../components/ErrorBoundary";
import { componentConfig } from "./config/components";
import handlePublish from "./config/handlePublish";
import FieldsComponent from "./puck/FieldsComponent";
import HeaderActions from "./puck/HeaderActions";

export interface WebBuilderProps {
  nodeId?: string;
  initialData?: {
    content: Array<{
      type: string;
      props: Record<string, any>;
    }>;
    root: {
      title: string;
    };
  };
}

// Lazy load the Puck editor
const PuckEditor = lazy(() =>
  import("@measured/puck").then((module) => ({
    default: module.Puck,
  }))
);
let initialData = {
  content: [
    {
      type: "Heading",
      props: {
        content: "Welcome to Website Builder",
        textAlign: "center",
        color: "#333",
        backgroundColor: "#f0f0f0",
        fontSize: "5.5rem",
      },
    },
    {
      type: "Text",
      props: {
        content:
          "Start building your website by dragging components from the left sidebar.",
      },
    },
  ],
  root: { title: "My Website" },
};

const urlParams = new URLSearchParams(window.location.search);
const nodeId = urlParams.get("nodeId");
if (nodeId) {
  // Todo : fetch website data of specific node id  and remove localstorage data
  const data = localStorage.getItem(nodeId);
  if (data) {
    initialData = JSON.parse(data);
  }
}

const MyPlugin: Plugin[] = [
  {
    overrides: {
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
      // components: ComponentDesign,
      // outline: ({ children }) => <div>{children}hello</div>,
      // preview: ({ children, editor }) => {
      //   const handleDrop = (event) => {
      //     event.preventDefault();

      //     // Get the dragged item details
      //     const draggedItem = JSON.parse(event.dataTransfer.getData("dragged-item"));

      //     // Add the dropped item to the editor canvas
      //     editor.addComponent({
      //       id: draggedItem.itemKey,
      //       label: draggedItem.label,
      //       props: {},
      //     });
      //   };

      //   const handleDragOver = (event) => {
      //     event.preventDefault(); // Allow dropping
      //   };

      //   return (
      //     <div
      //       className="relative w-full h-full border border-dashed border-gray-400"
      //       onDrop={handleDrop}
      //       onDragOver={handleDragOver}
      //     >
      //       {children}
      //     </div>
      //   );
      // },
      // puck: ({ children }) => <div>{children}hi</div>,
    },
  },
];

export default function WebBuilder(props: WebBuilderProps) {
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
          data={props.initialData || initialData}
          plugins={MyPlugin}
          onPublish={handlePublish}
          viewports={[
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
          ]}
        />
      </Suspense>
    </ErrorBoundary>
  );
}
