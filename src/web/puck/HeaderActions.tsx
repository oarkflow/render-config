import { Button, usePuck } from "@measured/puck";
import React from "react";

import { ReactNode } from "react";
import handlePublish from "../config/handlePublish";

interface HeaderActionsProps {
  children: ReactNode;
  nodeId: string | null;
}

const HeaderActions = ({ children, nodeId }: HeaderActionsProps) => {
  const { appState } = usePuck();
  const previewFunction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const currentData = appState.data;
    console.log(currentData, "currentData");
    handlePublish(currentData);
    window.open(`/app-preview?nodeId=${nodeId}`, "_blank");
  };
  return (
    <>
      {children}
      <Button onClick={(e) => previewFunction(e)}>Preview</Button>
    </>
  );
};

export default HeaderActions;
