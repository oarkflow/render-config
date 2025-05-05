import { Skeleton } from "@/components/ui/skeleton";
import React, { ReactNode, useEffect, useState } from "react";
import { LinkProps } from "../../types";
import UpdateContent from "../../utils/ResolveContents";

const Link: React.FC<LinkProps> = ({
  content: initialContent,
  href,
  target = "_self",
  rel,
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
}) => {
  const classes = [
    align,
    letterSpacing,
    lineHeight,
    textTransform,
    tailwindClass,
  ]
    .filter(Boolean)
    .join(" ");

  const style: React.CSSProperties = {
    color: color || "#0000EE", // Default link color
    backgroundColor: backgroundColor || undefined,
    fontSize: fontSize || undefined,
    fontWeight: fontWeight || undefined,
    margin: margin || undefined,
    padding: padding || undefined,
    textDecoration: "underline",
    cursor: "pointer",
  };
  
  const containerClasses = tailwindClass || "";
  const [resolvedContent, setResolvedContent] = useState<
    string | object | null | ReactNode
  >(null);
  
  // Generate appropriate rel attribute
  const safeRel = target === "_blank" 
    ? (rel ? `${rel} noopener noreferrer` : "noopener noreferrer") 
    : rel;
  
  useEffect(() => {
    const resolveContent = async () => {
      return window.location.pathname.includes("web-builder")
        ? setResolvedContent(initialContent)
        : setResolvedContent(await UpdateContent(initialContent));
    };
    resolveContent();
  }, [initialContent]);
  
  return (
    <>
      {resolvedContent === null ? (
        <Skeleton className={"w-full h-8"} style={style} />
      ) : (
        <a 
          href={href} 
          target={target} 
          rel={safeRel}
          className={`${classes} ${containerClasses}`} 
          style={style}
        >
          {resolvedContent as ReactNode}
        </a>
      )}
    </>
  );
};

export default Link;
