export interface TableStructure {
  headers: string[];
  rows: (string | number | boolean | null | object)[][];
}

export const formatValue = (value: any): string => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.map((item) => formatValue(item)).join(", ");
    }
    return JSON.stringify(value);
  }
  return String(value);
};

export const getFieldType = (value: any): "array" | "object" | "value" => {
  if (Array.isArray(value)) return "array";
  if (value !== null && typeof value === "object") return "object";
  return "value";
};

export const processField = (data: any, fieldPath: string): TableStructure => {
  let currentValue = data;

  // If fieldPath is provided, navigate to that field
  if (fieldPath) {
    const pathParts = fieldPath.split(".");
    for (const part of pathParts) {
      if (currentValue && typeof currentValue === "object") {
        currentValue = currentValue[part];
      } else {
        return { headers: [], rows: [] };
      }
    }
  }

  const fieldType = getFieldType(currentValue);

  switch (fieldType) {
    case "array":
      if (!currentValue || currentValue.length === 0) {
        return {
          headers: [fieldPath || "Data"],
          rows: [["Empty array"]],
        };
      }

      if (typeof currentValue[0] === "object") {
        // Array of objects - create table with object keys as headers
        const headers = Object.keys(currentValue[0]);
        const rows = currentValue.map((item: any) =>
          headers.map((header) => item[header])
        );
        return { headers, rows };
      } else {
        // Array of primitives - create single column table
        return {
          headers: [fieldPath || "Value"],
          rows: currentValue.map((item: any) => [formatValue(item)]),
        };
      }

    case "object":
      // Convert object to two-column table with key-value pairs
      const entries = Object.entries(currentValue);
      return {
        headers: ["Key", "Value"],
        rows: entries.map(([key, value]) => [key, formatValue(value)]),
      };

    case "value":
      // Single value - create two-row, single-column table
      return {
        headers: [fieldPath || "Value"],
        rows: [[formatValue(currentValue)]],
      };

    default:
      return { headers: [], rows: [] };
  }
};

export const renderNestedTable = (
  data: TableStructure,
  styles: {
    cellPadding?: string;
    borderColor?: string;
    cellBackground?: string;
    cellTextColor?: string;
    borderSize?: string;
    bodyAlignment?: "left" | "center" | "right";
    headerBackground?: string;
    headerTextColor?: string;
    headerAlignment?: "left" | "center" | "right";
  }
): JSX.Element => {
  const {
    cellPadding = "0.5rem",
    borderColor = "#e5e7eb",
    cellBackground,
    cellTextColor,
    borderSize = "1px",
    bodyAlignment = "left",
    headerBackground = "#f3f4f6",
    headerTextColor = "#111827",
    headerAlignment = "left",
  } = styles;

  const borderStyle = `${borderSize} solid ${borderColor}`;
  console.log(data, "table data");

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        border: borderStyle,
        fontSize: "0.9em",
      }}
    >
      <thead>
        <tr>
          {data.headers.map((header, i) => (
            <th
              key={`header-${i}`}
              style={{
                padding: cellPadding,
                backgroundColor: headerBackground,
                color: headerTextColor,
                borderBottom: borderStyle,
                textAlign: headerAlignment,
                fontWeight: "bold",
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <td
                key={`cell-${rowIndex}-${cellIndex}`}
                style={{
                  padding: cellPadding,
                  backgroundColor: cellBackground,
                  color: cellTextColor,
                  borderBottom: borderStyle,
                  textAlign: bodyAlignment as any,
                }}
              >
                {formatValue(cell)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
