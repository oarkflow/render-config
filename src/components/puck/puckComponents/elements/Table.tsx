import { useEffect, useState, useCallback } from "react";
import { TableData } from "../../types";
import { GetValue } from "../../utils/ResolveContents";
import { PuckComponent } from "../../../../packages/measured/puck";

interface TableProps {
  content: TableData;
  headerBackground?: string | null;
  cellPadding?: string;
  borderSize?: string | null;
  borderColor?: string | null;
  headerTextColor?: string | null;
  cellBackground?: string | null;
  cellTextColor?: string | null;
  cellMinWidth?: string;
  headerAlignment?: "left" | "center" | "right";
  bodyAlignment?: "left" | "center" | "right";
}

type ApiResponse = Record<string, unknown> | unknown[] | null;
type TableDataArray = string[][] | (string[] | undefined)[];
type FilterRule = {
  operator: string;
  value: string;
};

const Table: PuckComponent<TableProps> = ({
  content,
  headerBackground = "#f3f4f6",
  cellPadding = "0.5rem",
  borderSize = "1px",
  borderColor = "#e5e7eb",
  headerTextColor,
  cellBackground,
  cellTextColor,
  cellMinWidth = "120px",
  headerAlignment = "left",
  bodyAlignment = "left",
}) => {
  const [tableData, setTableData] = useState<TableDataArray>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContent, setShowContent] = useState<boolean>(false);

  const getNestedValue = useCallback(
    (
      obj: Record<string, unknown> | unknown[] | unknown,
      path: string
    ): unknown => {
      if (obj === null || obj === undefined) return "";

      return path.split(".").reduce<unknown>((current, key) => {
        if (current === null || current === undefined) return "";
        if (Array.isArray(current)) {
          return current[Number(key)] ?? ""; // Access array by index
        }
        if (typeof current === "object") {
          return (current as Record<string, unknown>)[key];
        }
        return "";
      }, obj);
    },
    []
  );

  const processDataForDisplay = useCallback(
    (
      rawData: unknown[] | Record<string, unknown> | unknown,
      selectedFields: string[],
      arrayPath: string
    ): TableDataArray => {
      if (!Array.isArray(rawData)) {
        // For single objects, create a single row with selected fields
        return [
          selectedFields.map((field) => {
            const value = getNestedValue(rawData, field);
            return formatValue(value);
          }),
        ];
      }

      // For array data, map each item to selected fields
      return rawData.map((item) => {
        return selectedFields.map((field) => {
          // Remove array path prefix if it exists
          const fieldPath = arrayPath
            ? field.replace(`${arrayPath}.`, "")
            : field;
          const value = getNestedValue(item, fieldPath);
          return formatValue(value);
        });
      });
    },
    [getNestedValue]
  );

  const formatValue = useCallback((value: unknown): string => {
    if (value === null || value === undefined) {
      return "";
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  }, []);

  const findArrayData = useCallback(
    (
      response: ApiResponse,
      selectedFields: string[] | undefined
    ): [unknown[], string] => {
      if (!response) return [[], ""];

      // First, check if any of the selected fields directly point to an array
      if (selectedFields?.length) {
        for (const field of selectedFields) {
          const basePath = field.split(".")[0];
          const baseData = getNestedValue(response, basePath);
          if (Array.isArray(baseData)) {
            return [baseData, basePath];
          }
        }
      }

      // Then check common array locations
      const commonPaths = ["data", "table", "items", "results"];
      for (const path of commonPaths) {
        const pathData = getNestedValue(response, path);
        if (Array.isArray(pathData)) {
          return [pathData, path];
        }
      }

      // If no array is found, check if response itself is an array
      if (Array.isArray(response)) {
        return [response, ""];
      }

      // If still no array is found, wrap the response in an array
      return [[response], ""];
    },
    [getNestedValue]
  );

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!content) {
          setTableData([]);
          return;
        }

        if (
          (content?.mode === "manual" || content?.dataSource === "manual") &&
          content.rows &&
          content.headers
        ) {
          // Handle manual data directly
          setTableData(content.rows as string[][]);
        } else if (
          (content?.mode === "api" || content?.dataSource === "api") &&
          content.apiPath
        ) {
          // Create API config from apiPath
          const apiConfig = {
            type: "rest",
            url: content.apiPath,
            method: "GET", // Add method property to fix type error
          };

          const response = await GetValue(apiConfig);
          console.log("API Response:", response);

          // Find the appropriate data array and field path
          const [arrayData, arrayPath] = findArrayData(
            response as ApiResponse,
            content.headers
          );
          console.log("Array Data:", arrayData, "Array Path:", arrayPath);

          // Apply any filters
          let filteredData = arrayData;
          if (content.rules && Object.keys(content.rules).length > 0) {
            filteredData = arrayData.filter((item) => {
              return Object.entries(content.rules || {}).every(
                ([field, rule]) => {
                  const typedRule = rule as FilterRule;
                  if (typedRule.operator === "all" || !typedRule.value)
                    return true;

                  const fieldPath = arrayPath
                    ? field.replace(`${arrayPath}.`, "")
                    : field;
                  const value = getNestedValue(item, fieldPath);
                  const filterValue = typedRule.value;

                  switch (typedRule.operator) {
                    case "equals":
                      return String(value) === filterValue;
                    case "notEquals":
                      return String(value) !== filterValue;
                    case "greaterThan":
                      return Number(value) > Number(filterValue);
                    case "lessThan":
                      return Number(value) < Number(filterValue);
                    case "includes":
                      return String(value)
                        .toLowerCase()
                        .includes(filterValue.toLowerCase());
                    case "notIncludes":
                      return !String(value)
                        .toLowerCase()
                        .includes(filterValue.toLowerCase());
                    default:
                      return true;
                  }
                }
              );
            });
          }

          // Process the filtered data for display
          const processedData = processDataForDisplay(
            filteredData,
            content.headers as string[],
            arrayPath
          );
          console.log("Processed Data:", processedData);
          setTableData(processedData);
        } else {
          setTableData([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (
      window.location.pathname.includes("web-builder") &&
      content &&
      (content.mode === "api" || content.dataSource === "api")
    )
      setShowContent(true);
    else fetchAndProcessData();
  }, [content, findArrayData, processDataForDisplay, getNestedValue]);

  // Apply styles
  const borderStyle =
    borderSize && borderColor ? `${borderSize} solid ${borderColor}` : "none";
  const tableStyles = {
    border: borderStyle,
    borderCollapse: "collapse" as const,
  };

  type CSSTextAlign =
    | "left"
    | "center"
    | "right"
    | "justify"
    | "initial"
    | "inherit";

  const headerCellStyles = {
    backgroundColor: headerBackground || undefined,
    color: headerTextColor || undefined,
    padding: cellPadding,
    border: borderStyle,
    textAlign: headerAlignment as CSSTextAlign,
    minWidth: cellMinWidth,
  };

  const bodyCellStyles = {
    backgroundColor: cellBackground || undefined,
    color: cellTextColor || undefined,
    padding: cellPadding,
    border: borderStyle,
    textAlign: bodyAlignment as CSSTextAlign,
    minWidth: cellMinWidth,
  };

  if (showContent && content) {
    return (
      <div className="p-4 border border-dashed border-gray-300 rounded">
        <div className="text-sm font-medium">Table (API Source)</div>
        <div className="text-xs text-gray-500">
          {content.integrationName || "Integration"}
          {content.fieldName ? ` • ${content.fieldName}` : ""}
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  const headers = content?.headers || [];

  return (
    <div className="overflow-x-auto">
      <table style={tableStyles} className="min-w-full">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                style={headerCellStyles}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                {header.split(".").pop()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row &&
                row.map((cell: string, colIndex: number) => (
                  <td
                    key={colIndex}
                    style={bodyCellStyles}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {cell}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
      {(!tableData || tableData.length === 0) && (
        <div className="text-center py-4 text-gray-500">No data available</div>
      )}

      {/* Only show this info box if it's API mode and we're NOT in web-builder */}
      {content?.mode === "api" &&
        content?.apiPath &&
        !window.location.pathname.includes("web-builder") && (
          <div className="p-2 border border-dashed border-gray-300 rounded mt-2">
            <p className="text-sm font-medium">Table (API Source)</p>
            <p className="text-xs text-gray-500">
              {content.integrationName || "Integration"}
              {content.fieldName ? ` • ${content.fieldName}` : ""}
            </p>
          </div>
        )}
    </div>
  );
};

export default Table;
