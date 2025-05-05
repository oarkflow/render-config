import React, { memo, useEffect, useState } from "react";
import { OrderedListProps } from "../../types";
import UpdateContent from "../../utils/ResolveContents";

const OrderedList: React.FC<OrderedListProps> = memo(
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
            
            // Extract data using field name if available
            let dataToUse: unknown = content;
            if (items?.fieldName && typeof content === 'object' && content !== null) {
              // Navigate to the specified field path safely
              const path = items.fieldName.split('.');
              let current: unknown = content; // Start with the content object
              
              // Traverse the path
              for (const key of path) {
                if (current !== null && typeof current === 'object') {
                  // Safe type assertion since we've checked it's an object
                  current = (current as Record<string, unknown>)[key];
                } else {
                  current = undefined;
                  break;
                }
              }
              
              dataToUse = current;
            }
            
            // Format the content
            const formattedContent = Array.isArray(dataToUse)
              ? dataToUse.map((value) => {
                  if (typeof value === 'string') {
                    return { content: value };
                  } else if (value && typeof value === 'object') {
                    // Look for a property that might contain the content
                    const valueObj = value as Record<string, unknown>;
                    const content = 
                      valueObj.content || 
                      valueObj.text || 
                      valueObj.name || 
                      valueObj.title || 
                      valueObj.label ||
                      JSON.stringify(value);
                    return { content: String(content) };
                  } else {
                    return { content: String(value) };
                  }
                })
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

    // Always show API source info if in web-builder
    const showWebBuilderInfo = items?.mode === "api" && window.location.pathname.includes("web-builder");
    // Always show the list if not in web-builder or if in manual mode
    const showList = !showWebBuilderInfo || items?.mode !== "api";

    return (
      <>
        {showWebBuilderInfo && (
          <div className="p-2 border border-dashed border-gray-300 rounded">
            <p className="text-sm font-medium">Ordered List (API Source)</p>
            <p className="text-xs text-gray-500">{items?.integrationName || "Integration"}{items?.fieldName ? ` • ${items.fieldName}` : ''}</p>
          </div>
        )}
        
        {showList && (
          <>
            <ol className={classes} style={style}>
              {displayItems.length > 0 ? (
                displayItems.map((item, index) => (
                  <li key={index} className="text-inherit">
                    {item.content}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No items to display</li>
              )}
            </ol>
            
            {/* Only show this info box if it's API mode and we're NOT in web-builder */}
            {items?.mode === "api" && !window.location.pathname.includes("web-builder") && (
              <div className="p-2 border border-dashed border-gray-300 rounded mt-2">
                <p className="text-sm font-medium">Ordered List (API Source)</p>
                <p className="text-xs text-gray-500">{items?.integrationName || "Integration"}{items?.fieldName ? ` • ${items.fieldName}` : ''}</p>
              </div>
            )}
          </>
        )}
      </>
    );
  }
);

OrderedList.displayName = "Ordered List";

export default OrderedList;
