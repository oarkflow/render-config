/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/packages/measured/puck";
// import { ReactNode } from 'react';
import { useEffect, useState } from "react";
import { usePuck } from "@/packages/measured/puck";
import { pageTemplateApi } from "../utils/Api";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Eye, Globe } from "lucide-react";
import { toPng } from "html-to-image";
import { uploadFile } from "@/lib/api";
import PublishPopup from "../PublishPopup";

// interface HeaderActionsProps {
//   children: ReactNode;
// }

// const HeaderActions = ({ children }: HeaderActionsProps) => {
const HeaderActions = () => {
  const { pageTemplateId } = useParams();
  const { appState } = usePuck();
  const [isLoading, setIsLoading] = useState(false);
  const [pageId, setPageId] = useState<number>();
  const [showPopup, setShowPopup] = useState(false);
  const [localJsonData, setLocalJsonData] = useState<Record<string, any>>({});

  function removeCustomElements(data: any) {
    if (data.content && Array.isArray(data.content)) {
      data.content = data.content.filter((item: any) => item.type !== "Custom");
    }
    return data;
  }

  // Load local JSON data from localStorage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("localJsonData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setLocalJsonData(parsedData);
      }
    } catch (error) {
      console.error("Error loading local JSON data:", error);
    }
  }, []);

  useEffect(() => {
    if (!pageTemplateId) return;
    const fetchTemplate = async () => {
      try {
        const template = await pageTemplateApi.getTemplateById(pageTemplateId);
        setPageId(template.page_template_id as number);
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    };
    fetchTemplate();
  }, [pageTemplateId]);

  // Prepare metadata with builder data and datasource
  const prepareMetadata = () => {
    console.log("Builder data:", appState.data);
    console.log("Local JSON data:", localJsonData);

    // Extract unique keys from all sources
    const localKeys = new Set<string>();
    const integrationKeys = new Set<string>();
    const globalKeys = new Set<string>();

    // Helper function to recursively scan objects for string patterns
    const scanForPatterns = (obj: any) => {
      if (!obj) return;

      // If it's a string, check for patterns
      if (typeof obj === "string") {
        // Find all patterns matching ${pattern}
        const matches = obj.match(/\$\{([^}]+)\}/g);
        if (matches) {
          matches.forEach((match) => {
            // Extract the inner content of ${...}
            const innerContent = match.substring(2, match.length - 1);

            // Process based on the pattern type
            if (innerContent.startsWith("local.")) {
              // Format: local.keyName.fieldName
              const parts = innerContent.split(".");
              if (parts.length >= 2) {
                localKeys.add(parts[1]);
              }
            } else if (innerContent.startsWith("integration.")) {
              // Format: integration.keyName.fieldName
              const parts = innerContent.split(".");
              if (parts.length >= 2) {
                integrationKeys.add(parts[1]);
              }
            } else if (innerContent.startsWith("integrations.")) {
              // Handle old format: integrations.responseformat.field
              // This is a special case where we extract the second part if it exists
              const parts = innerContent.split(".");
              if (parts.length >= 2) {
                // For pattern like integrations.responseformat we'll just add 'responseformat'
                integrationKeys.add(parts[1]);
              }
            } else if (innerContent.startsWith("global.")) {
              // Format: global.keyName
              const parts = innerContent.split(".");
              if (parts.length >= 2) {
                globalKeys.add(parts[1]);
              }
            }
          });
        }
      }
      // If it's an array, scan each item
      else if (Array.isArray(obj)) {
        obj.forEach((item) => scanForPatterns(item));
      }
      // If it's an object, scan each property
      else if (typeof obj === "object" && obj !== null) {
        // Also scan for integrationName properties in API configs
        if (
          obj.integrationName &&
          typeof obj.integrationName === "string" &&
          obj.integrationName.trim() !== ""
        ) {
          integrationKeys.add(obj.integrationName);
        }

        Object.values(obj).forEach((value) => scanForPatterns(value));
      }
    };

    // Start the scan from the root of appState.data
    scanForPatterns(appState.data);

    // Convert Sets to Arrays for output
    const localKeysList = Array.from(localKeys);
    const integrationKeysList = Array.from(integrationKeys);
    const globalKeysList = Array.from(globalKeys);

    console.log("Found local keys:", localKeysList);
    console.log("Found integration keys:", integrationKeysList);
    console.log("Found global keys:", globalKeysList);

    // Construct the complete metadata object before stringifying
    const metadata = {
      builder: removeCustomElements(appState.data), //puck editor json
      datasources: {
        localData: localJsonData, //local data that user creates to use only in this page (key-value pair)
        locals: localKeysList, //local keys that user use in any part of this page
        globals: globalKeysList, //global keys that user use in any part of this page
        integrations: integrationKeysList, //integration keys that user use in any part of this page
      },
    };

    console.log("Final metadata structure:", metadata);

    // Save the localData properly in localStorage for future use
    try {
      localStorage.setItem("builderLocalData", JSON.stringify(localJsonData));
    } catch (error) {
      console.error("Error saving localData to localStorage:", error);
    }

    return JSON.stringify(metadata);
  };

  const handlePreviewClick = async () => {
    console.log("handlePreviewClick");
    if (!pageId) return;
    try {
      setIsLoading(true);
      // await generateImageAndUpdate();

      // Use prepareMetadata to get the combined data
      const metadata = prepareMetadata();

      await pageTemplateApi.updateTemplate({
        id: pageId,
        updates: { metadata },
      });

      console.log("Template saved successfully");
      window.open(`#/web/viewer/${pageTemplateId}`, "_blank");
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template for preview");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to generate image, upload it, and update template
  const generateImageAndUpdate = async () => {
    // Find the preview element
    const element = document.querySelector("#puck-preview");
    if (!element) {
      throw new Error("Could not find preview element");
    }

    // Generate PNG from the element
    const dataUrl = await toPng(element as HTMLElement, {
      width: 1024,
      height: 768,
    });

    // Convert dataUrl to a blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Create a File object from the blob
    const file = new File([blob], `puck-template-${pageId}.png`, {
      type: "image/png",
    });

    // Upload the file and get the response
    const uploadResponse = await uploadFile(file);

    // Log the response
    console.log("Upload file response:", uploadResponse);

    // Update the template with the image_url
    if (uploadResponse && uploadResponse.url) {
      if (!pageId) return;
      await pageTemplateApi.updateTemplate({
        id: pageId,
        updates: {
          image_url: uploadResponse.url,
        },
      });
      console.log("Template updated with image URL:", uploadResponse.url);
      return uploadResponse;
    } else {
      throw new Error("Failed to get valid upload response");
    }
  };

  const handlePublishClick = async () => {
    if (!pageId) return;

    try {
      setIsLoading(true);
      await generateImageAndUpdate();

      // Use prepareMetadata to get the combined data
      const metadata = prepareMetadata();

      await pageTemplateApi.updateTemplate({
        id: pageId as number,
        updates: {
          metadata,
        },
      });

      setShowPopup(true);
      toast.success("Template published successfully.");
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to publish template. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* {children} */}
      <Button onClick={handlePreviewClick} disabled={isLoading}>
        <Eye className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Preview"}
      </Button>
      <Button onClick={handlePublishClick} disabled={isLoading}>
        <Globe className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Publish"}
      </Button>
      {showPopup && <PublishPopup setOpen={setShowPopup} open={showPopup} />}
    </>
  );
};

export default HeaderActions;
