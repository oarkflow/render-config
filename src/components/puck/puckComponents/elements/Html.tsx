import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";
import { HtmlProps } from "../../types";

const Html: React.FC<HtmlProps> = ({ content }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add a small delay to simulate content loading
    // This prevents flickering when content changes quickly
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [content]);

  // Create a safe way to render HTML content
  // This uses dangerouslySetInnerHTML which should be used with caution
  const createMarkup = () => {
    return { __html: content || "" };
  };

  if (loading) {
    return <Skeleton className="w-full h-12" />;
  }

  return (
    <div className="html-content" dangerouslySetInnerHTML={createMarkup()} />
  );
};

export default Html;
