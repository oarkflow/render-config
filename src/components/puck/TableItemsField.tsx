import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Plus } from "lucide-react";
import ListApiData from "./ListApiData";
import { TableData } from "./types";

const TableItemsField = ({
  value,
  onChange,
}: {
  value: TableData;
  onChange: (value: TableData) => void;
}) => {
  // Initialize with defaults or existing values
  const initialValue = {
    mode: value?.mode || "manual",
    dataSource: value?.dataSource || "manual",
    headers: Array.isArray(value?.headers) ? [...value.headers] : ["Column 1", "Column 2"],
    rows: Array.isArray(value?.rows) ? JSON.parse(JSON.stringify(value.rows)) : [["", ""], ["", ""]],
    data: Array.isArray(value?.data) ? [...value.data] : [],
    apiPath: value?.apiPath || "",
    apiEndpoint: value?.apiEndpoint || "",
    integrationName: value?.integrationName || "",
    fieldName: value?.fieldName || "",
    rules: value?.rules || {},
  };

  const [mode, setMode] = useState<"manual" | "api">(initialValue.mode as "manual" | "api");
  const [headers, setHeaders] = useState<string[]>(initialValue.headers);
  const [rows, setRows] = useState<(string | number | boolean | null)[][]>(initialValue.rows);
  const [apiPath, setApiPath] = useState(initialValue.apiPath);
  const [integrationName, setIntegrationName] = useState(initialValue.integrationName);
  const [fieldName, setFieldName] = useState(initialValue.fieldName);

  useEffect(() => {
    // Only update when the value changes from external sources
    if (
      value?.headers && 
      JSON.stringify(value.headers) !== JSON.stringify(headers)
    ) {
      setHeaders(Array.isArray(value.headers) ? [...value.headers] : ["Column 1", "Column 2"]);
    }
    
    if (
      value?.rows && 
      JSON.stringify(value.rows) !== JSON.stringify(rows)
    ) {
      setRows(Array.isArray(value.rows) ? JSON.parse(JSON.stringify(value.rows)) : [["", ""], ["", ""]]);
    }
    
    if (value?.mode && value.mode !== mode) {
      setMode(value.mode as "manual" | "api");
    }
    
    if (value?.apiPath !== undefined && value.apiPath !== apiPath) {
      setApiPath(value.apiPath);
    }
    
    if (value?.integrationName !== undefined && value.integrationName !== integrationName) {
      setIntegrationName(value.integrationName);
    }
    
    if (value?.fieldName !== undefined && value.fieldName !== fieldName) {
      setFieldName(value.fieldName);
    }
  }, [value]);

  const handleModeChange = (newMode: "manual" | "api") => {
    if (mode === newMode) return;
    setMode(newMode);
    
    // Preserve the existing data but update the mode
    onChange({
      ...value,
      mode: newMode,
      dataSource: newMode, // Keep these in sync
      headers,
      rows,
      apiPath,
      integrationName,
      fieldName,
    });
  };

  const handleHeaderChange = (index: number, text: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = text;
    setHeaders(newHeaders);
    
    // Update the state and trigger onChange
    onChange({
      ...value,
      mode,
      dataSource: mode,
      headers: newHeaders,
      rows,
      apiPath,
      integrationName,
      fieldName,
    });
  };

  const handleCellChange = (rowIndex: number, colIndex: number, text: string) => {
    const newRows = JSON.parse(JSON.stringify(rows));
    newRows[rowIndex][colIndex] = text;
    setRows(newRows);
    
    // Update the state and trigger onChange
    onChange({
      ...value,
      mode,
      dataSource: mode,
      headers,
      rows: newRows,
      apiPath,
      integrationName,
      fieldName,
    });
  };

  const addNewColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    const newRows = rows.map(row => [...row, ""]);
    
    setHeaders(newHeaders);
    setRows(newRows);
    
    // Update the state and trigger onChange
    onChange({
      ...value,
      mode,
      dataSource: mode,
      headers: newHeaders,
      rows: newRows,
      apiPath,
      integrationName,
      fieldName,
    });
  };

  const addNewRow = () => {
    const newRow = Array(headers.length).fill("");
    const newRows = [...rows, newRow];
    
    setRows(newRows);
    
    // Update the state and trigger onChange
    onChange({
      ...value,
      mode,
      dataSource: mode,
      headers,
      rows: newRows,
      apiPath,
      integrationName,
      fieldName,
    });
  };

  const removeRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    
    // Update the state and trigger onChange
    onChange({
      ...value,
      mode,
      dataSource: mode,
      headers,
      rows: newRows,
      apiPath,
      integrationName,
      fieldName,
    });
  };

  const removeColumn = (index: number) => {
    if (headers.length <= 1) return; // Prevent removing the last column
    
    const newHeaders = headers.filter((_, i) => i !== index);
    const newRows = rows.map(row => row.filter((_, i) => i !== index));
    
    setHeaders(newHeaders);
    setRows(newRows);
    
    // Update the state and trigger onChange
    onChange({
      ...value,
      mode,
      dataSource: mode,
      headers: newHeaders,
      rows: newRows,
      apiPath,
      integrationName,
      fieldName,
    });
  };

  const handleApiPathChange = (path: string, metadata?: { integrationName?: string; fieldName?: string }) => {
    setApiPath(path);
    
    if (metadata?.integrationName) {
      setIntegrationName(metadata.integrationName);
    }
    
    if (metadata?.fieldName) {
      setFieldName(metadata.fieldName);
    }
    
    // Create a proper API config that the table component can use
    const apiEndpoint = JSON.stringify({
      type: "rest",
      url: path,
    });
    
    onChange({
      ...value,
      mode,
      dataSource: mode,
      headers,
      rows,
      apiPath: path,
      apiEndpoint,
      integrationName: metadata?.integrationName || integrationName,
      fieldName: metadata?.fieldName || fieldName,
    });
  };

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue={mode}
        value={mode}
        onValueChange={(value) => handleModeChange(value as "manual" | "api")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="manual">Manual Data</TabsTrigger>
          <TabsTrigger value="api">API Source</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-8 px-2 py-2"></th>
                  {headers.map((header, index) => (
                    <th key={index} className="px-2 py-2">
                      <div className="flex items-center space-x-1">
                        <Input 
                          value={header}
                          onChange={(e) => handleHeaderChange(index, e.target.value)}
                          className="text-xs font-medium text-gray-700 px-2 py-1 h-8"
                          placeholder={`Column ${index + 1}`}
                        />
                        {headers.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeColumn(index)}
                            className="h-6 w-6 text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="w-8 px-2 py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={addNewColumn}
                      className="h-6 w-6 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="w-8 px-2 py-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRow(rowIndex)}
                        className="h-6 w-6 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="px-2 py-2">
                        <Input
                          value={cell !== null ? cell.toString() : ""}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          className="text-xs px-2 py-1 h-8"
                          placeholder={`Cell ${rowIndex+1}x${colIndex+1}`}
                        />
                      </td>
                    ))}
                    <td className="w-8 px-2 py-2"></td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={headers.length + 2} className="px-2 py-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addNewRow}
                      className="w-full flex items-center justify-center gap-1 text-xs h-8"
                    >
                      <PlusCircle className="h-3 w-3" />
                      <span>Add Row</span>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <ListApiData
            value={apiPath}
            onChange={handleApiPathChange}
          />
          {apiPath && (
            <div className="text-xs text-muted-foreground mt-1 border-t pt-2">
              <p className="font-medium">Data source: {integrationName || "Unknown integration"}</p>
              {fieldName && <p>Field: {fieldName}</p>}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TableItemsField;
