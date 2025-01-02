import { PuckComponent } from "@measured/puck";
import { useEffect, useState } from "react";
import { TableData } from "../../types";
import { GetValue } from "../../utils/ResolveContents";

interface TableProps {
  tableData: TableData;
}

const Table: PuckComponent<TableProps> = ({ tableData }) => {
  const [data, setData] = useState<string[][] | (string[] | undefined)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getNestedValue = (
    obj: Record<string, unknown> | unknown[] | string,
    path: string
  ) => {
    return path.split(".").reduce<unknown>((current, key) => {
      if (current === null || current === undefined) return "";
      if (Array.isArray(current)) {
        return current[Number(key)] ?? ""; // Access array by index
      }
      return (current as Record<string, unknown>)[key];
    }, obj);
  };

  const processDataForDisplay = (
    rawData: string[],
    selectedFields: string[],
    arrayPath: string
  ) => {
    if (!Array.isArray(rawData)) {
      // For single objects, create a single row with selected fields
      return [
        selectedFields.map((field) => {
          const value = getNestedValue(rawData, field);
          return formatValue(value as string[]);
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
        return formatValue(value as string);
      });
    });
  };

  const formatValue = (value: object | string[] | string): string => {
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
  };

  const findArrayData = (
    response: Record<string, string> | string[] | string,
    selectedFields: string[] | undefined
  ): [string[], string] => {
    // First, check if any of the selected fields directly point to an array
    if (!selectedFields) return [[""], ""];
    for (const field of selectedFields) {
      const basePath = field.split(".")[0];
      const baseData = getNestedValue(response, basePath);
      if (Array.isArray(baseData)) {
        return [baseData, basePath];
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
    return [[response as string, ""], ""];
  };
  const [showContent, setShowContent] = useState<boolean>(false);
  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (tableData?.dataSource === "manual" && tableData.data) {
          // Handle manual data directly
          const processedData = tableData.data.map(
            (row) =>
              tableData.headers &&
              tableData.headers.map((header) =>
                formatValue(row[header] as string)
              )
          );
          setData(processedData);
        } else if (tableData?.dataSource === "api" && tableData.apiEndpoint) {
          const apiConfig = JSON.parse(tableData.apiEndpoint);
          const response = await GetValue(apiConfig);
          console.log("API Response:", response);

          // Find the appropriate data array
          const [arrayData, arrayPath] = findArrayData(
            response,
            tableData.headers
          );
          console.log("Array Data:", arrayData, "Array Path:", arrayPath);

          // Apply filters
          const filteredData = arrayData.filter((item) => {
            return Object.entries(tableData.rules || {}).every(
              ([field, rule]) => {
                if (rule.operator === "all" || !rule.value) return true;

                const fieldPath = arrayPath
                  ? field.replace(`${arrayPath}.`, "")
                  : field;
                const value = getNestedValue(item, fieldPath);
                const filterValue = rule.value;

                switch (rule.operator) {
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

          console.log("Filtered Data:", filteredData);

          // Process the filtered data for display
          const processedData = processDataForDisplay(
            filteredData,
            tableData.headers as string[],
            arrayPath
          );
          console.log("Processed Data:", processedData);
          setData(processedData);
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
      tableData &&
      tableData.dataSource == "api"
    )
      setShowContent(true);
    else fetchAndProcessData();
  }, [tableData]);

  if (showContent && tableData) {
    return (
      <div className="p-4 text-center">
        <div>{JSON.stringify(tableData.headers) || ""}</div>
        <div>{JSON.stringify(tableData.rules) || ""}</div>
      </div>
    );
  }
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {tableData?.headers &&
              tableData.headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.split(".").pop()}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row &&
                row.map((cell: string, colIndex: number) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {cell}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
      {(!data || data.length === 0) && (
        <div className="text-center py-4 text-gray-500">No data available</div>
      )}
    </div>
  );
};

export default Table;
