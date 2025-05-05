/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/web/viewer.tsx
import { Render } from "@measured/puck";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { pageTemplateApi } from "@/components/puck/utils/Api";
import PuckConfig from "@/components/puck/PuckConfig";

export default function WebViewer() {
  const { pageTemplateId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!pageTemplateId) {
          return;
        }

        const templateData = await pageTemplateApi.getTemplateById(pageTemplateId);
        console.log(templateData.metadata, "metadata");
        setData(templateData.metadata ? JSON.parse(templateData.metadata).builder : {});
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageTemplateId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Template not found</div>;
  }

  return <Render config={PuckConfig} data={data} />;
}
