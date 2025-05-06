/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Editor.jsx
import PuckConfig from "../components/puck/PuckConfig";
// import PuckPlugin from "../components/puck/PuckPlugin"
import { PuckProps } from "./types";
import { Plugin } from "../packages/measured/puck";
import { DefaultData } from "./default";
import {
  Computer,
  Laptop2Icon,
  Smartphone,
  Tablet,
} from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { lazy, Suspense, useState } from "react";
import CMSComponents from "@/components/puck/plugin/CMSComponents";
import FieldsComponent from "@/components/puck/plugin/FieldsComponent";
import { Button } from "@/components/ui";
import { CustomPuck } from "@/components/puck/CustomPuck";
import HeaderActions from "@/components/puck/plugin/HeaderActions";
import "../main.css";
import "../packages/measured/puck/puck.css";
// Render Puck editor
export interface WebBuilderProps extends PuckProps {}
const PuckEditor = lazy(() =>
  import("../packages/measured/puck").then((module) => ({
    default: module.Puck,
  }))
);

export default function WebBuilder(props: WebBuilderProps) {
  const handlePreviewClick = () => {
    props.onPreview?.(props.initialData);
  };

  const handlePublishClick = () => {
    props.onPublish?.(props.initialData);
  };

  const MyPlugin: Plugin[] = [
    {
      overrides: {
        components: CMSComponents,
        fields: FieldsComponent,
        headerActions: () => (
          <HeaderActions
            handlePreviewClick={handlePreviewClick}
            handlePublishClick={handlePublishClick}
            isLoading={props.isLoading ?? false}
          />
        ),
        puck: () => (
          <CustomPuck
            dataKey={"key-1"}
            handlePreviewClick={handlePreviewClick}
            handlePublishClick={handlePublishClick}
            isLoading={props.isLoading ?? false}
          />
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
