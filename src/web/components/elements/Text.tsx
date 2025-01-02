import { Skeleton } from "../../../components/ui/skeleton";
import React, { ReactNode, useEffect, useState } from "react";
import { TextProps } from "../../types";
import UpdateContent from "../../utils/ResolveContents";

const Text: React.FC<TextProps> = ({
  content: initialContent,
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
    color: color || undefined,
    backgroundColor: backgroundColor || undefined,
    fontSize: fontSize || undefined,
    fontWeight: fontWeight || undefined,
    margin: margin || undefined,
    padding: padding || undefined,
  };
  const containerClasses = tailwindClass || "";
  const [resolvedContent, setResolvedContent] = useState<
    string | object | null | ReactNode
  >(null);
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
        <Skeleton className={"w-full h-12"} style={style} />
      ) : (
        <p className={`${classes} ${containerClasses}`} style={style}>
          {resolvedContent as ReactNode}
        </p>
      )}
    </>
  );
};

export default Text;
