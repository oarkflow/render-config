import React from "react";
import { FlexProps } from "../../types";

const Flex: React.FC<FlexProps> = ({
  direction = "row",
  wrap = "nowrap",
  justifyContent = "flex-start",
  alignItems = "stretch",
  alignContent = "stretch",
  gap = "",
  rowGap = "",
  columnGap = "",
  color = null,
  backgroundColor = null,
  padding = null,
  margin = null,
  borderSize = null,
  borderColor = null,
  tailwindClass = "",
  items = [],
  columns = 0, // New property for number of columns
  puck,
}) => {
  // Add responsive behavior based on direction
  const isColumn = direction.includes("column");
  
  // Generate mobile-friendly classes
  const mobileClass = "flex-mobile"; // Add this class for mobile styles
  const directionClass = `flex-direction-${direction.replace(/\s/g, "-")}`;
  const wrapClass = `flex-wrap-${wrap}`;
  
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: direction as React.CSSProperties["flexDirection"],
    flexWrap: wrap as React.CSSProperties["flexWrap"],
    justifyContent,
    alignItems,
    alignContent,
    gap: gap || undefined,
    rowGap: rowGap || undefined,
    columnGap: columnGap || undefined,
    color: color || undefined,
    backgroundColor: backgroundColor || undefined,
    padding: padding || undefined,
    margin: margin || undefined,
    border: borderSize ? `${borderSize} solid ${borderColor || "#000"}` : undefined,
    width: "100%",
  };

  // Ensure we have at least empty items if none provided
  const effectiveItems = items && items.length > 0 
    ? items 
    : [
        { grow: "1", shrink: "0", basis: "0", content: [] },
        { grow: "1", shrink: "0", basis: "0", content: [] },
      ];

  // Calculate base classes for container with responsive behavior
  const containerClasses = [
    "flex-container", 
    mobileClass,
    directionClass,
    wrapClass,
    columns > 0 ? `flex-columns-${columns}` : "",
    tailwindClass || ""
  ].filter(Boolean).join(" ");

  // Common item styles for desktop view
  const getItemStyle = (item: { grow?: string; shrink?: string; basis?: string; order?: string }) => {
    // Calculate flex-basis based on columns if specified
    const flexBasis = columns > 0 
      ? `calc(${100 / columns}% - ${gap || '0px'})` 
      : item.basis || "0";
    
    // Base styles that work for desktop
    return {
      flexGrow: columns > 0 ? "0" : (item.grow || "1"),
      flexShrink: item.shrink || "0",
      flexBasis: isColumn ? "auto" : flexBasis,
      order: item.order || undefined,
      // Make column items full width
      minWidth: isColumn ? "100%" : undefined,
    };
  };

  console.log("Flex direction:", direction);
  console.log("Items:", effectiveItems);
  console.log("Columns:", columns);

  return (
    <>
      {/* Add a style block for responsive CSS */}
      <style>
        {`
          /* Base flex container */
          .flex-container {
            display: flex;
            width: 100%;
          }
          
          /* Handle column-based layout */
          .flex-direction-row.flex-columns-1 > div { width: 100%; flex-basis: 100% !important; }
          .flex-direction-row.flex-columns-2 > div { width: calc(50% - ${gap || '0px'}); flex-basis: calc(50% - ${gap || '0px'}) !important; }
          .flex-direction-row.flex-columns-3 > div { width: calc(33.33% - ${gap || '0px'}); flex-basis: calc(33.33% - ${gap || '0px'}) !important; }
          .flex-direction-row.flex-columns-4 > div { width: calc(25% - ${gap || '0px'}); flex-basis: calc(25% - ${gap || '0px'}) !important; }
          .flex-direction-row.flex-columns-5 > div { width: calc(20% - ${gap || '0px'}); flex-basis: calc(20% - ${gap || '0px'}) !important; }
          .flex-direction-row.flex-columns-6 > div { width: calc(16.66% - ${gap || '0px'}); flex-basis: calc(16.66% - ${gap || '0px'}) !important; }
          
          /* Always wrap when using columns */
          .flex-direction-row[class*="flex-columns-"] {
            flex-wrap: wrap !important;
          }
          
          /* Mobile styles - Stack items below 768px */
          @media (max-width: 768px) {
            .flex-mobile {
              flex-direction: column !important;
            }
            
            .flex-mobile > div {
              width: 100% !important;
              flex-basis: auto !important;
              margin-bottom: ${gap || '1rem'};
            }
          }
          
          /* Small tablet styles */
          @media (min-width: 769px) and (max-width: 991px) {
            /* Tablet 2-column layout for 3+ column layouts */
            .flex-direction-row.flex-columns-3 > div,
            .flex-direction-row.flex-columns-4 > div,
            .flex-direction-row.flex-columns-5 > div,
            .flex-direction-row.flex-columns-6 > div {
              width: calc(50% - ${gap || '0px'}) !important;
              flex-basis: calc(50% - ${gap || '0px'}) !important;
              margin-bottom: ${gap || '1rem'};
            }
            
            /* Fall back to 2 columns for row layouts */
            .flex-direction-row.flex-mobile:not([class*="flex-columns-"]) {
              flex-wrap: wrap !important;
            }
            
            .flex-direction-row.flex-mobile:not([class*="flex-columns-"]) > div {
              flex-basis: 48% !important;
              margin-bottom: ${gap || '1rem'};
            }
          }
        `}
      </style>
      
      <div 
        data-direction={direction}
        data-columns={columns}
        className={containerClasses}
        style={containerStyle}
      >
        {effectiveItems.map((item, index) => (
          <div 
            key={index} 
            className="flex-item"
            style={getItemStyle(item)}
          >
            {puck?.renderDropZone && puck.renderDropZone({
              zone: `content-${index}`,
              allowedComponents: ["Heading", "Text", "Button", "Image", "Column", "Flex", "Grid"]
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default Flex;
