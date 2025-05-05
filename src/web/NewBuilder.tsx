/* eslint-disable @typescript-eslint/no-explicit-any */
// Editor.jsx
import PuckConfig from "../components/puck/PuckConfig";
import PuckPlugin from "../components/puck/PuckPlugin";
import { Puck } from "../packages/measured/puck";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PublishPopup from "../components/puck/PublishPopup";
import { PuckProps } from "./types";
import { Plugin } from "../packages/measured/puck";
import { DefaultData } from "./default";
import { Computer, Laptop2Icon, Smartphone, Tablet } from "lucide-react";
// Render Puck editor
export default function WebBuilder(props: PuckProps) {
  const MyPlugin: Plugin[] = [...(props.plugin || []), ...PuckPlugin];
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiData = props.initialData
          ? JSON.parse(props.initialData as any)
          : {};
        if (apiData.builder) {
          setData(apiData.builder);
        }
        if (apiData.datasource) {
          localStorage.setItem(
            "localJsonData",
            JSON.stringify(apiData.datasource.localData)
          );
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [props.initialData]);
  const [showPopup, setShowPopup] = useState(false);
  if (loading) {
    return <div>Loading...</div>;
  }
  const removeCustomElements = (data: any) => {
    if (data.content && Array.isArray(data.content)) {
      data.content = data.content.filter(
        (item: { type: string }) => item.type !== "Custom"
      );
    }
    return data;
  };
  const handleSaveImageClick = async (puckData: any) => {
    console.log(puckData);
    // if (!pageId) return;
    // try {
    //   //   await generateImageAndUpdate();
    //   await pageTemplateApi.updateTemplate({
    //     id: pageId as number,
    //     updates: {
    //       metadata: JSON.stringify(removeCustomElements(puckData)),
    //     },
    //   });
    //   toast.success("Image saved and template updated successfully");
    // } catch (error) {
    //   console.error("Error processing image:", error);
    //   toast.error("Failed to save and upload image");
    // } finally {
    //   // setIsLoading(false);
    // }
  };

  // Function to generate image, upload it, and update template
  //   const generateImageAndUpdate = async () => {
  //     // Find the preview element
  //     const element = document.querySelector('#puck-preview');
  //     if (!element) {
  //       throw new Error('Could not find preview element');
  //     }

  //     // Generate PNG from the element
  //     const dataUrl = await toPng(element as HTMLElement, {
  //       width: 1024,
  //       height: 768,
  //     });

  //     // Convert dataUrl to a blob
  //     const response = await fetch(dataUrl);
  //     const blob = await response.blob();

  //     // Create a File object from the blob
  //     const file = new File([blob], `puck-template-${pageId}.png`, { type: 'image/png' });

  //     // Upload the file and get the response
  //     const uploadResponse = await uploadFile(file);

  //     // Log the response
  //     console.log('Upload file response:', uploadResponse);

  //     // Update the template with the image_url
  //     if (uploadResponse && uploadResponse.url) {
  //       if (!pageId) return;
  //       await pageTemplateApi.updateTemplate({
  //         id: pageId,
  //         updates: {
  //           image_url: uploadResponse.url,
  //         },
  //       });
  //       console.log('Template updated with image URL:', uploadResponse.url);
  //       return uploadResponse;
  //     } else {
  //       throw new Error('Failed to get valid upload response');
  //     }
  //   };
  return (
    <>
      <Puck
        config={PuckConfig}
        plugins={MyPlugin}
        data={props.initialData || DefaultData}
        onPublish={async (puckData: any) => {
          try {
            setData(removeCustomElements(data));
            await handleSaveImageClick(puckData);
            setShowPopup(true);
            toast.success("Template published successfully.");
          } catch (error) {
            console.error("Error saving template:", error);
            toast.error("Failed to publish template. Please try again.");
          }
        }}
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
      {showPopup && <PublishPopup setOpen={setShowPopup} open={showPopup} />}
    </>
  );
}
