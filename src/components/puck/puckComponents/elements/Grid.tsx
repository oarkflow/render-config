import React from "react";
import { GridProps, GridItemProps } from "../../types";

const Grid: React.FC<GridProps> = ({
  columns = "repeat(3, 1fr)",
  rows = "",
  gap = "",
  rowGap = "",
  columnGap = "",
  justifyItems = "stretch",
  alignItems = "stretch",
  justifyContent = "start",
  alignContent = "start",
  autoColumns = "",
  autoRows = "",
  templateAreas = "",
  color = null,
  backgroundColor = null,
  padding = null,
  margin = null,
  borderSize = null,
  borderColor = null,
  tailwindClass = "",
  items = [],
  numCells = 6,
  puck,
}) => {
  const containerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: columns,
    gridTemplateRows: rows || undefined,
    gap: gap || undefined,
    rowGap: rowGap || undefined,
    columnGap: columnGap || undefined,
    justifyItems,
    alignItems,
    justifyContent,
    alignContent,
    gridAutoColumns: autoColumns || undefined,
    gridAutoRows: autoRows || undefined,
    gridTemplateAreas: templateAreas || undefined,
    color: color || undefined,
    backgroundColor: backgroundColor || undefined,
    padding: padding || undefined,
    margin: margin || undefined,
    border: borderSize ? `${borderSize} solid ${borderColor || "#000"}` : undefined,
    minHeight: "50px", // Ensure empty grid has some height
  };

  // Parse numCells to a number
  const cellCount = typeof numCells === 'string' ? parseInt(numCells, 10) : numCells;
  
  // Ensure we have the specified number of cells even if no items are provided
  const effectiveItems: GridItemProps[] = items && items.length > 0 
    ? items 
    : Array(cellCount || 6).fill(0).map(() => ({ content: [] }));

  // Calculate CSS classes
  const containerClasses = [
    "grid-container",
    tailwindClass || ""
  ].filter(Boolean).join(" ");

  // For detailed debugging
  console.log("Grid component render:", {
    columns,
    cellCount,
    items,
    effectiveItems,
    puck: !!puck
  });

  return (
    <div 
      className={containerClasses} 
      style={containerStyle}
      data-columns={columns}
      data-cells={cellCount}
    >
      {/* Responsive styling */}
      <style>
        {`
          .grid-container {
            display: grid;
            width: 100%;
          }
          
          .grid-item {
            min-height: 50px;
            border: 1px dashed transparent;
          }
          
          .grid-item:hover {
            border-color: #e2e8f0;
          }
          
          /* Mobile styles - Stack items below 768px */
          @media (max-width: 768px) {
            .grid-container {
              grid-template-columns: 1fr !important;
            }
            
            .grid-container > div {
              margin-bottom: ${gap || '1rem'};
            }
          }
          
          /* Small tablet styles */
          @media (min-width: 769px) and (max-width: 991px) {
            .grid-container {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
        `}
      </style>
      
      {/* Render all grid items with their own dropzone */}
      {effectiveItems.map((item, index) => {
        return (
          <div 
            key={index} 
            className="grid-item"
            style={{
              gridArea: item.area || undefined,
              gridColumn: item.column || undefined,
              gridRow: item.row || undefined,
            }}
          >
            {puck?.renderDropZone && 
              puck.renderDropZone({
                zone: `content-${index}`,
                allowedComponents: ["Heading", "Text", "Button", "Image", "Column", "Flex", "Grid"]
              })
            }
          </div>
        );
      })}
    </div>
  );
};

export default Grid;
