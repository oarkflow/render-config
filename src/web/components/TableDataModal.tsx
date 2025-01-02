import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TableData } from "../types";
import { GetValue } from "../utils/ResolveContents";
import { getAllFields, getFieldType } from "./ApiDataLoader";

type FilterOperator =
  | "all"
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "lessThan"
  | "includes"
  | "notIncludes";

interface FieldFilter {
  field: string;
  operator: FilterOperator;
  value: string;
}

interface FieldRule {
  field: string;
  operator: FilterOperator;
  value: string;
}

interface ProcessedData {
  headers: string[];
  rules: { [key: string]: FieldRule };
}

interface TableDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: TableData | null) => void;
  initialData?: TableData;
  columns: number;
  rows: number;
}

const FilterOperatorLabels: Record<FilterOperator, string> = {
  all: "All",
  equals: "Equals",
  notEquals: "Not Equals",
  greaterThan: "Greater Than",
  lessThan: "Less Than",
  includes: "Includes",
  notIncludes: "Not Includes",
};

const TableDataModal: React.FC<TableDataModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [dataSource, setDataSource] = useState<"manual" | "api">(
    initialData?.dataSource || "manual"
  );
  const [manualHeaders, setManualHeaders] = useState<string[]>([]);
  const [manualData, setManualData] = useState<string[][]>([]);

  const apiEndpoint = initialData?.apiEndpoint || "";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [apiList, setApiList] = useState<Record<string, string>>({});
  const [selectedApi, setSelectedApi] = useState<string>("");

  const [apiData, setApiData] = useState<string>("");

  const [apiFields, setApiFields] = useState<
    { path: string; type: "object" | "array" | "value" }[]
  >([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [apiResponse, setApiResponse] = useState<
    string | Record<string, string> | null
  >(null);
  const [filters, setFilters] = useState<FieldFilter[]>([]);

  useEffect(() => {
    const storedApis = localStorage.getItem("apisDatas");
    if (storedApis) {
      try {
        const parsedApis = JSON.parse(storedApis);
        delete parsedApis.globalConstants;
        setApiList(parsedApis);
      } catch (error) {
        console.error("Error parsing API data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (dataSource === "api" && apiEndpoint) {
      setError(null);
    }
  }, [dataSource, apiEndpoint]);

  const handleApiSelect = (value: string) => {
    setSelectedApi(value);
    setApiResponse(null);
    setApiFields([]);
    setSelectedFields([]);
    setFilters([]);
    setApiData("");
  };

  const handleFieldSelect = (fieldPath: string) => {
    const updatedFields = selectedFields.includes(fieldPath)
      ? selectedFields.filter((f) => f !== fieldPath)
      : [...selectedFields, fieldPath];
    setSelectedFields(updatedFields);

    if (apiResponse) {
      updateProcessedData(updatedFields);
    }
  };

  const updateProcessedData = (fields: string[]) => {
    // Create a table structure with selected fields and rules
    const processedData: ProcessedData = {
      headers: fields,
      rules: {},
    };

    // Initialize rules for each field with default 'all' operator
    fields.forEach((field) => {
      processedData.rules[field] = {
        field,
        operator: "all",
        value: "",
      };
    });

    // Update rules from existing filters
    filters.forEach((filter) => {
      if (fields.includes(filter.field)) {
        processedData.rules[filter.field] = {
          field: filter.field,
          operator: filter.operator,
          value: filter.value,
        };
      }
    });

    setApiData(JSON.stringify(processedData));
  };

  const handleFilterChange = (
    index: number,
    field: string | null = null,
    operator: FilterOperator | null = null,
    value: string | null = null
  ) => {
    const newFilters = [...filters];
    if (field !== null) newFilters[index].field = field;
    if (operator !== null) newFilters[index].operator = operator;
    if (value !== null) newFilters[index].value = value;
    setFilters(newFilters);

    // Update processed data with new filters
    updateProcessedData(selectedFields);
  };

  const addColumn = () => {
    setManualHeaders([...manualHeaders, `Column ${manualHeaders.length + 1}`]);
    setManualData(manualData.map((row) => [...row, ""]));
  };

  const removeColumn = (index: number) => {
    setManualHeaders(manualHeaders.filter((_, i) => i !== index));
    setManualData(manualData.map((row) => row.filter((_, i) => i !== index)));
  };

  const addRow = () => {
    setManualData([...manualData, new Array(manualHeaders.length).fill("")]);
  };

  const removeRow = (index: number) => {
    setManualData(manualData.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...manualHeaders];
    newHeaders[index] = value;
    setManualHeaders(newHeaders);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...manualData];
    newData[rowIndex] = [...newData[rowIndex]];
    newData[rowIndex][colIndex] = value;
    setManualData(newData);
  };

  const renderManualDataSection = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Manual Data Entry</h3>
          <div className="space-x-2">
            <button
              onClick={addColumn}
              className="px-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Column
            </button>
            <button
              onClick={addRow}
              className="px-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Row
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {manualHeaders.map((header, index) => (
                  <th key={index} className="px-1 py-1 relative">
                    <div className="flex flex-col items-center space-x-2">
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={header}
                          onChange={(e) => updateHeader(index, e.target.value)}
                          className="w-full p-1 pl-2 pr-8 border rounded bg-white text-gray-500" // Added padding on the right
                          placeholder="Enter header"
                        />
                        <span
                          onClick={() => removeColumn(index)}
                          className="text-red-500 hover:text-red-700 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                          title="Remove column"
                        >
                          <X />
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {manualData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="px-4 py-2">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) =>
                          updateCell(rowIndex, colIndex, e.target.value)
                        }
                        className="w-full p-1 border rounded bg-white text-gray-600"
                        placeholder="Enter value"
                      />
                    </td>
                  ))}
                  <td className="px-2">
                    <span
                      onClick={() => removeRow(rowIndex)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      title="Remove row"
                    >
                      ×
                    </span>
                    <span
                      onClick={() => removeColumn(rowIndex)}
                      className="text-red-500 hover:text-red-700 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      title="Remove column"
                    >
                      <X />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const handleSave = () => {
    try {
      let finalData: TableData;
      if (dataSource === "api") {
        // Parse the processed data with headers and rules
        const processedData = JSON.parse(apiData);
        finalData = {
          dataSource: "api",
          apiEndpoint: selectedApi ? apiList[selectedApi] : "",
          headers: processedData.headers,
          rules: processedData.rules,
        };
      } else {
        // Handle manual data
        finalData = {
          dataSource: "manual",
          headers: manualHeaders,
          data: manualData.map((row) =>
            Object.fromEntries(
              manualHeaders.map((header, index) => [header, row[index]])
            )
          ),
        };
      }
      onSave(finalData);
      onClose();
    } catch (error) {
      console.error("Error saving table data:", error);
      setError("Failed to save table data. Please check your input.");
    }
  };

  const loadApiFields = async () => {
    if (!selectedApi) return;

    try {
      setIsLoading(true);
      setError(null);
      setApiFields([]);

      const apiConfig = apiList[selectedApi];
      if (!apiConfig) {
        throw new Error("Invalid API configuration");
      }

      const response = await GetValue(JSON.parse(apiConfig));
      console.log("API Response:", response);
      setApiResponse(response);

      // Get all fields with their types
      const fields = getAllFields(response).map((field) => ({
        path: field,
        type: getFieldType(
          field.split(".").reduce((obj, key) => {
            if (typeof obj === "object" && obj !== null) {
              return Array.isArray(obj) ? obj[Number(key)] : obj[key];
            }
            return "";
          }, response)
        ),
      }));
      setApiFields(fields);
    } catch (error) {
      console.error("Error loading API fields:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load API fields"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addFilter = () => {
    setFilters([
      ...filters,
      { field: selectedFields[0] || "", operator: "all", value: "" },
    ]);
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    // Reapply field selection to update the data with new filters
    if (selectedFields.length > 0) {
      handleFieldSelect(selectedFields[0]);
    }
  };

  const renderFilters = () => {
    if (selectedFields.length === 0) return null;

    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block font-medium">Filters</label>
          <button
            onClick={addFilter}
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Filter
          </button>
        </div>
        <div className="space-y-2">
          {filters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-2 border rounded"
            >
              <select
                value={filter.field}
                onChange={(e) => handleFilterChange(index, e.target.value)}
                className="border rounded px-2 py-1 bg-white"
              >
                {selectedFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
              <select
                value={filter.operator}
                onChange={(e) =>
                  handleFilterChange(
                    index,
                    null,
                    e.target.value as FilterOperator
                  )
                }
                className="border rounded px-2 py-1 bg-white"
              >
                {Object.entries(FilterOperatorLabels).map(([op, label]) => (
                  <option key={op} value={op}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={filter.value}
                onChange={(e) =>
                  handleFilterChange(index, null, null, e.target.value)
                }
                placeholder="Filter value..."
                className="border rounded px-2 py-1 flex-1 bg-white"
              />
              <button
                onClick={() => removeFilter(index)}
                className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFieldCheckboxes = () => {
    if (apiFields.length === 0) {
      return (
        <div className="mt-4">
          <button
            onClick={loadApiFields}
            disabled={isLoading}
            className={`w-full p-2 rounded ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isLoading ? "Loading Fields..." : "Load API Fields"}
          </button>
          {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
        </div>
      );
    }

    return (
      <div className="mt-4">
        <label className="block font-medium mb-2">Select Fields</label>
        <div className="space-y-2">
          {apiFields.map((field) => (
            <label
              key={field.path}
              className="flex items-center p-2 border rounded hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedFields.includes(field.path)}
                onChange={() => handleFieldSelect(field.path)}
                className="form-checkbox h-4 w-4 text-blue-500 accent-white"
              />
              <span className="ml-2 flex-1">{field.path}</span>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  field.type === "array"
                    ? "bg-blue-200 text-blue-800"
                    : field.type === "object"
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {field.type}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Configure Table Data</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Data Source</label>
            <select
              value={dataSource}
              onChange={(e) => {
                setDataSource(e.target.value as "manual" | "api");
                if (e.target.value === "manual" && manualHeaders.length === 0) {
                  setManualHeaders(["Column 1"]);
                  setManualData([[""]]);
                }
              }}
              className="w-full p-2 border rounded bg-white"
            >
              <option value="manual">Manual Input</option>
              <option value="api">API Data</option>
            </select>
          </div>

          {dataSource === "api" ? (
            <div>
              <label className="block font-medium mb-2">Select API</label>
              <select
                value={selectedApi}
                onChange={(e) => handleApiSelect(e.target.value)}
                className="w-full p-2 border rounded bg-white"
              >
                <option value="">Select an API</option>
                {Object.keys(apiList).map((api) => (
                  <option key={api} value={api}>
                    {api}
                  </option>
                ))}
              </select>

              {selectedApi && renderFieldCheckboxes()}

              {selectedApi && renderFilters()}

              {apiData && (
                <div className="mt-4">
                  <label className="block font-medium mb-2">
                    Selected Fields
                  </label>
                  <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-sm">
                    {apiData}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            renderManualDataSection()
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableDataModal;
