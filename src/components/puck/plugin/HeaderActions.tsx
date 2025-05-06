/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/packages/measured/puck";
import { Eye, Globe } from "lucide-react";

type HeaderActionsProps = {
  handlePreviewClick: () => void;
  handlePublishClick: () => void;
  isLoading: boolean;
};
const HeaderActions = ({
  handlePreviewClick,
  handlePublishClick,
  isLoading,
}: HeaderActionsProps) => { 
  return (
    <>
      <Button onClick={handlePreviewClick} disabled={isLoading}>
        <Eye className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Preview"}
      </Button>
      <Button onClick={handlePublishClick} disabled={isLoading}>
        <Globe className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Publish"}
      </Button>
    </>
  );
};
export default HeaderActions;
