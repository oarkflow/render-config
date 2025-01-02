/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database, Globe, RotateCcw, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { removeCache } from "../utils/Cache";
import { GetValue } from "../utils/ResolveContents";

interface ContentFieldPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}


const isArrayType = (value: unknown): boolean => {
  return Array.isArray(value);
};

export const getArrayFields = (
  obj: any,
  prefix = "",
  index?: number
): string[] => {
  let fields: string[] = [];

  if (isArrayType(obj)) {
    const currentPath = index !== undefined ? `${prefix.slice(0, -1)}` : prefix;
    fields.push(currentPath || "root");
    // If array contains objects, also get their array fields
    if (obj.length > 0 && typeof obj[0] === "object" && obj[0] !== null) {
      fields = [
        ...fields,
        ...getArrayFields(obj[0], `${currentPath}.0.`, undefined),
      ];
    }
    return fields;
  }

  // If it's an object, traverse its properties
  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      const value = obj[key];
      const currentPath =
        index !== undefined ? `${prefix}${key}` : `${prefix}${key}`;

      if (isArrayType(value)) {
        fields.push(currentPath);
        // If array contains objects, also get their array fields
        if (value.length > 0 && typeof value[0] === "object") {
          fields = [
            ...fields,
            ...getArrayFields(value[0], `${currentPath}.0.`, 0),
          ];
        }
      } else if (typeof value === "object" && value !== null) {
        fields = [
          ...fields,
          ...getArrayFields(value, `${currentPath}.`, undefined),
        ];
      }
    }
  }

  return fields;
};

export const getAllFields = (
  obj: any,
  prefix = ""
): string[] => {
  let fields: string[] = [];
  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        fields = [...fields, ...getAllFields(obj[key], `${prefix}${key}.`)];
      } else {
        fields.push(`${prefix}${key}`);
      }
    }
  }
  return fields;
};

const ContentFieldPicker: React.FC<ContentFieldPickerProps> = ({
  value,
  onChange,
  label = "Content",
}) => {
  const [showApiModal, setShowApiModal] = useState(false);
  const [showGlobalModal, setShowGlobalModal] = useState(false);
  const [selectedApi, setSelectedApi] = useState<string>("");
  const [apiList, setApiList] = useState<Record<string, string>>({});
  const [apiFields, setApiFields] = useState<string[]>([]);
  const [globalFields, setGlobalFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const storedApis = localStorage.getItem("apisDatas");
    if (storedApis) {
      try {
        const parsedApis = JSON.parse(storedApis);
        const fields = parsedApis.globalConstants
          ? JSON.parse(parsedApis.globalConstants)
          : [];
        delete fields.type;
        setGlobalFields(Object.keys(fields));
        delete parsedApis.globalConstants;
        setApiList(parsedApis);
      } catch (error) {
        console.error("Error parsing API data:", error);
      }
    }
  }, []);

  const handleApiSelect = (apiName: string) => {
    setSelectedApi(apiName);
    setApiFields([]);
    setError(null);
  };


  const loadApiData = async () => {
    if (!selectedApi) return;

    const apiData = JSON.parse(apiList[selectedApi]);
    setIsLoading(true);
    setError(null);
    setApiFields([]);

    if (apiData.type === "restAPI" && apiData.url) {
      try {
        const response = await GetValue(apiData);
        if (typeof response === "string") {
          setError("API not supported yet: " + response);
          setIsLoading(false);
          return;
        }

        if (label === "List Api") {
          // For List Api, only get array fields
          const arrayFields = getArrayFields(response);
          setApiFields(arrayFields);
        } else {
          // For other cases, get all fields as before
          const fields = getAllFields(response);
          setApiFields(fields);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch API data"
        );
        console.error("Error fetching API data:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Selected API is not a REST API");
      setIsLoading(false);
    }
  };



  const handleFieldSelect = (field: string, type: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const textBefore = value.substring(0, cursorPos);
      const textAfter = value.substring(textarea.selectionEnd);
      const formattedApi = selectedApi;
      const newValue =
        type === "global"
          ? `${textBefore}{{global.${field}}}${textAfter}`
          : `${textBefore}{{${formattedApi}.${field}}}${textAfter}`;
      onChange(newValue);
      const newCursorPos = cursorPos + formattedApi.length + field.length + 5;
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
    if (type === "global") setShowGlobalModal(false);
    else setShowApiModal(false);
  };

  console.log(label, "content Picker");

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white sm:text-sm min-h-[100px]"
        />
        <div>
          <button
            onClick={() => setShowApiModal(true)}
            className="px-2 mb-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            title="Get data from API"
          >
            <Database />
          </button>
          <button
            onClick={() => setShowGlobalModal(true)}
            className="px-2 py-1  mb-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            title="Get data from API"
          >
            <Globe />
          </button>
          <button
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center "
            title="Remove all cache Data"
            onClick={() => {
              removeCache();
            }}
          >
            <Trash2 />
          </button>
        </div>
      </div>

      {showApiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Select API Data</h3>

            <div className="mb-4">
              <select
                className="w-full p-2 border rounded mb-2 bg-gray-300"
                value={selectedApi}
                onChange={(e) => handleApiSelect(e.target.value)}
              >
                <option value="" className="bg-gray-200">
                  Select API
                </option>
                {Object.keys(apiList).map((apiName) => (
                  <option key={apiName} value={apiName} className="bg-gray-100">
                    {apiName}
                  </option>
                ))}
              </select>

              <button
                onClick={loadApiData}
                disabled={!selectedApi || isLoading}
                className={`w-full p-2 rounded flex items-center justify-center gap-2 ${
                  !selectedApi || isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                {isLoading ? (
                  <RotateCcw className="animate-spin" />
                ) : (
                  "Load API Data"
                )}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {apiFields.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Field
                </label>
                <div className="max-h-60 overflow-y-auto border rounded">
                  {apiFields.map((field) => (
                    <button
                      key={field}
                      onClick={() => handleFieldSelect(field, "api")}
                      className=" p-2 text-left hover:bg-gray-100 border-b last:border-b-0 bg-slate-200 mb-1 mr-1 ml-1"
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowApiModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showGlobalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Select API Data</h3>

            {globalFields.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Field
                </label>
                <div className="max-h-60 overflow-y-auto border rounded">
                  {globalFields.map((field) => (
                    <button
                      key={field}
                      onClick={() => handleFieldSelect(field, "global")}
                      className="w-full bg-gray-300 p-2 text-left hover:bg-gray-100 border-b last:border-b-0"
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowGlobalModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentFieldPicker;
