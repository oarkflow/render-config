import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";
import { HeadingProps } from "../../types";
import UpdateContent from "../../utils/ResolveContents";

const Heading: React.FC<HeadingProps> = ({
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
}) => {
  const style: React.CSSProperties = {
    color: color || undefined,
    backgroundColor: backgroundColor || undefined,
    fontSize: fontSize || undefined,
    fontWeight: fontWeight || undefined,
    margin: margin || undefined,
    padding: padding || undefined,
    textAlign: align || undefined,
  };

  const Component = tag;
  const combinedClasses =
    "" + align + letterSpacing + lineHeight + textTransform + tailwindClass;
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
        <Skeleton className={"w-full h-12"} style={style} />
      ) : (
        <Component className={combinedClasses} style={style}>
          {resolvedContent}
        </Component>
      )}
    </>
  );
};

export default Heading;
