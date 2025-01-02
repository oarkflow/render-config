import React, { memo, useEffect, useState } from "react";
import { UnorderedListProps } from "../../types";
import UpdateContent from "../../utils/ResolveContents";

const UnorderedList: React.FC<UnorderedListProps> = memo(
  ({
    items,
    listStyle = "decimal",
    listStylePosition,
    spacing,
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
    const [resolvedItems, setResolvedItems] = useState<Array<{
      content: string;
    }> | null>(null);

    useEffect(() => {
      const resolveItems = async () => {
        // Only resolve if it's API mode and not in web-builder
        if (
          items?.mode === "api" &&
          !window.location.pathname.includes("web-builder")
        ) {
          try {
            const content = await UpdateContent(items.apiPath, true);
            console.log(content, "content to show in order list");
            const formattedContent = Array.isArray(content)
              ? content.map((value) => ({
                  content:
                    typeof value === "string" ? value : JSON.stringify(value),
                }))
              : null;

            setResolvedItems(formattedContent);
          } catch (error) {
            console.error("Error resolving list items:", error);
            setResolvedItems(null);
          }
        } else {
          // For manual mode or web-builder, use items directly
          setResolvedItems(items?.items || []);
        }
      };
      resolveItems();
    }, [items]);

    const classes = [
      "list-decimal",
      listStylePosition === "outside" ? "list-outside" : "list-inside",
      spacing === "tight"
        ? "space-y-1"
        : spacing === "normal"
        ? "space-y-2"
        : spacing === "relaxed"
        ? "space-y-3"
        : spacing === "loose"
        ? "space-y-4"
        : "",
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
      listStyleType: listStyle,
      margin: margin || undefined,
      padding: padding || undefined,
    };

    // Use resolvedItems if available, otherwise fall back to items.items or empty array
    const displayItems = resolvedItems || items?.items || [];
    console.log(displayItems, "display items");

    return (
      <>
        {items?.mode === "api" &&
        window.location.pathname.includes("web-builder") ? (
          <p>Un order List: {items.apiPath}</p>
        ) : (
          <ul className={classes} style={style}>
            {displayItems.length > 0 &&
              displayItems.map((item, index) => (
                <li key={index} className="text-inherit">
                  {item.content}
                </li>
              ))}
          </ul>
        )}
      </>
    );
  }
);

UnorderedList.displayName = "OrderedList";

export default UnorderedList;
