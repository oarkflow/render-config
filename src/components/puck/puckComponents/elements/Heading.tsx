/* eslint-disable @typescript-eslint/no-unused-vars */
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";
import { HeadingProps } from "../../types";
import UpdateContent from "../../utils/ResolveContents";

const Heading: React.FC<HeadingProps> = (props) => {
  const {
    content: initialContent,
    tag = "h2",
    align,
    color,
    backgroundColor,
    fontSize,
    fontWeight,
    letterSpacing,
    lineHeight,
    textTransform,
    margin,
    padding,
    tailwindClass = "",
    BorderSizePicker
  } = props;
  const style: React.CSSProperties = {
    color: color || undefined,
    backgroundColor: backgroundColor || undefined,
    fontSize: fontSize || undefined,
    fontWeight: fontWeight || undefined,
    margin: margin || undefined,
    padding: padding || undefined,
    border: BorderSizePicker || undefined
  };
  //remove all null and undefined value form style 
  const filteredStyle = Object.fromEntries(
    Object.entries(style).filter(([_, value]) => value !== null|| undefined)
  );

  const Component = tag;
  const combinedClasses = `${align} ${letterSpacing} ${lineHeight} ${textTransform} ${tailwindClass}`.trim();
  const [resolvedContent, setResolvedContent] = useState<string | null>(null);
  useEffect(() => {
    const resolveContent = async () => {
      const content = window.location.pathname.includes("web-builder")
        ? initialContent
        : await UpdateContent(initialContent);
      setResolvedContent(content as string);
    };
    resolveContent();
  }, [initialContent]);

  return (
    <>
      {resolvedContent === null ? (
        <Skeleton className={"w-full h-12"} style={filteredStyle} />
      ) : (
        <Component className={combinedClasses} style={filteredStyle}>
          {resolvedContent}
        </Component>
      )}
    </>
  );
};

export default Heading;
