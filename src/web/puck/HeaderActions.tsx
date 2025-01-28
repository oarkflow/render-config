import { Button } from "@measured/puck";

import { ReactNode } from "react";
// import handlePublish from "../config/handlePublish";

interface HeaderActionsProps {
  children: ReactNode;
  onPreview: (data: unknown) => void;
}

const HeaderActions = ({ children, onPreview }: HeaderActionsProps) => {
  return (
    <>
      {children}
      <Button onClick={onPreview}>Preview</Button>
    </>
  );
};

export default HeaderActions;
