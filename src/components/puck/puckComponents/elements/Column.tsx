import React from "react";
import { PuckComponent } from "../../../../packages/measured/puck";

interface ColumnProps {
  distribution?: "auto" | "manual";
  tailwindClass?: string;
  columns?: Array<{
    span: string | number;
    content: Array<{ type: string; props: unknown }>;
  }>;
  puck: {
    renderDropZone: (props: { zone: string }) => React.ReactNode;
  };
}

const Column: PuckComponent<ColumnProps> = ({
  distribution = "auto",
  columns = [],
  tailwindClass = "",
  puck: { renderDropZone },
}) => {
  const effectiveColumns =
    columns.length > 0
      ? columns
      : [
          { span: "auto", content: [] },
          { span: "auto", content: [] },
        ];

  const getFlexBasis = (span: string | number, totalColumns: number) => {
    if (distribution === "auto") {
      return `${100 / totalColumns}%`;
    }
    const numSpan = Number(span);
    return span === "auto" || isNaN(numSpan) ? "0" : `${(numSpan / 12) * 100}%`;
  };

  const containerClasses = "flex flex-wrap" + tailwindClass || "-mx-4 gap-y-4";
  return (
    <div className={containerClasses}>
      {effectiveColumns.map((column, index) => (
        <div
          key={index}
          className="flex-shrink-0 px-4"
          style={{
            flexBasis: getFlexBasis(column.span, effectiveColumns.length),
            flexGrow:
              distribution === "auto" ? 1 : column.span === "auto" ? 1 : 0,
            minWidth: 0,
          }}
        >
          {renderDropZone({ zone: `content-${index}` })}
        </div>
      ))}
    </div>
  );
};

export default Column;
