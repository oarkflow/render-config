import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import ListApiData from "./ListApiData";

interface ListItem {
  content: string;
}

interface ListItemsValue {
  mode?: "manual" | "api";
  items?: ListItem[];
  apiPath?: string;
  integrationName?: string;
  fieldName?: string;
}

const ListItemsField = ({
  value,
  onChange,
}: {
  value: ListItemsValue | ListItem[];
  onChange: (value: ListItemsValue) => void;
}) => {
  // Convert old format (array) to new format (object with mode)
  const initialValue = Array.isArray(value)
    ? { mode: "manual" as const, items: value, apiPath: "" }
    : {
        mode: value?.mode || ("manual" as const),
        items: Array.isArray(value?.items) ? value.items : [],
        apiPath: value?.apiPath || "",
        integrationName: value?.integrationName || "",
        fieldName: value?.fieldName || "",
      };

  const [mode, setMode] = useState<"manual" | "api">(initialValue.mode);
  const [manualItems, setManualItems] = useState<ListItem[]>(initialValue.items || []);
  const [apiPath, setApiPath] = useState(initialValue.apiPath);
  const [integrationName, setIntegrationName] = useState(initialValue.integrationName);
  const [fieldName, setFieldName] = useState(initialValue.fieldName);

  // Initialize with some default items if the list is empty
  useEffect(() => {
    if (manualItems.length === 0 && !Array.isArray(value)) {
      setManualItems([{ content: "List item 1" }, { content: "List item 2" }]);
    }
  }, []);

  useEffect(() => {
    // Update state when value prop changes
    if (Array.isArray(value)) {
      setManualItems(value);
      setMode("manual");
    } else if (value && typeof value === "object") {
      setMode(value.mode || "manual");
      // Only update items if we're in the right mode or they're empty
      if (value.mode === "manual" || !manualItems.length) {
        setManualItems(Array.isArray(value.items) ? value.items : []);
      }
      setApiPath(value.apiPath || "");
      setIntegrationName(value.integrationName || "");
      setFieldName(value.fieldName || "");
    } else {
      if (!manualItems.length) {
        setManualItems([{ content: "List item 1" }, { content: "List item 2" }]);
      }
      setMode("manual");
      setApiPath("");
      setIntegrationName("");
      setFieldName("");
    }
  }, [value]);

  const handleModeChange = (newMode: "manual" | "api") => {
    if (mode === newMode) return;
    setMode(newMode);
    
    // Preserve the existing data but update the mode
    onChange({
      mode: newMode,
      items: manualItems,
      apiPath,
      integrationName,
      fieldName,
    });
  };

  const handleItemsChange = (newItems: ListItem[]) => {
    if (JSON.stringify(manualItems) === JSON.stringify(newItems)) return;
    setManualItems(Array.isArray(newItems) ? newItems : []);
    onChange({
      mode,
      items: Array.isArray(newItems) ? [...newItems] : [],
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
    
    onChange({
      mode,
      items: manualItems,
      apiPath: path,
      integrationName: metadata?.integrationName || integrationName,
      fieldName: metadata?.fieldName || fieldName,
    });
  };

  const addNewItem = () => {
    const newItems = [...manualItems, { content: "" }];
    handleItemsChange(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = manualItems.filter((_, i) => i !== index);
    handleItemsChange(newItems);
  };

  const updateItem = (index: number, content: string) => {
    const newItems = [...manualItems];
    newItems[index] = { content };
    handleItemsChange(newItems);
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
          <TabsTrigger value="manual">Manual Items</TabsTrigger>
          <TabsTrigger value="api">API Source</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <div className="space-y-2">
            {manualItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 group">
                <div className="flex-1 relative">
                  <Input
                    value={item?.content || ""}
                    onChange={(e) => updateItem(index, e.target.value)}
                    placeholder={`List item ${index + 1}`}
                    className="w-full pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addNewItem}
              className="mt-2 w-full flex items-center justify-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Item</span>
            </Button>
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

export default ListItemsField;
