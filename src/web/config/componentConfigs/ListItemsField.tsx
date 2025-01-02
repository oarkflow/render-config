import { useEffect, useState } from "react";
import ContentFieldPicker from "../../components/ContentFieldPicker";

interface ListItem {
  content: string;
}

interface ListItemsValue {
  mode?: "manual" | "api";
  items?: ListItem[];
  apiPath?: string;
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
      };

  const [mode, setMode] = useState<"manual" | "api">(initialValue.mode);
  const [items, setItems] = useState<ListItem[]>(initialValue.items || []);
  const [apiPath, setApiPath] = useState(initialValue.apiPath);

  useEffect(() => {
    // Update state when value prop changes
    if (Array.isArray(value)) {
      setItems(value);
      setMode("manual");
    } else if (value && typeof value === "object") {
      setMode(value.mode || "manual");
      setItems(Array.isArray(value.items) ? value.items : []);
      setApiPath(value.apiPath || "");
    } else {
      setItems([]);
      setMode("manual");
      setApiPath("");
    }
  }, [value]);

  const handleModeChange = (newMode: "manual" | "api") => {
    if (mode === newMode) return;
    const newItems = newMode === "api" ? [] : items;
    setMode(newMode);
    setItems(newItems);
    onChange({
      mode: newMode,
      items: newItems,
      apiPath: apiPath,
    });
  };

  const handleItemsChange = (newItems: ListItem[]) => {
    if (JSON.stringify(items) === JSON.stringify(newItems)) return;
    setItems(Array.isArray(newItems) ? newItems : []);
    onChange({
      mode,
      items: Array.isArray(newItems) ? [...newItems] : [],
      apiPath,
    });
  };

  const handleApiPathChange = (path: string) => {
    if (apiPath === path) return;
    setApiPath(path);
    onChange({
      mode,
      items: Array.isArray(items) ? items : [],
      apiPath: path,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleModeChange("manual")}
          className={`px-4 py-2 rounded ${
            mode === "manual"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Manual
        </button>
        <button
          onClick={() => handleModeChange("api")}
          className={`px-4 py-2 rounded ${
            mode === "api"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          API
        </button>
      </div>

      {mode === "manual" ? (
        <div className="space-y-2">
          {Array.isArray(items) &&
            items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item?.content || ""}
                  onChange={(e) => {
                    if (!Array.isArray(items)) return;
                    const newItems = [...items];
                    newItems[index] = { content: e.target.value };
                    handleItemsChange(newItems);
                  }}
                  className="flex-1 px-3 py-2 border rounded"
                />
                <button
                  onClick={() => {
                    if (!Array.isArray(items)) return;
                    const newItems = items.filter((_, i) => i !== index);
                    handleItemsChange(newItems);
                  }}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            onClick={() => {
              const newItems = Array.isArray(items)
                ? [...items, { content: "" }]
                : [{ content: "" }];
              handleItemsChange(newItems);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Item
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <ContentFieldPicker
            value={apiPath}
            onChange={handleApiPathChange}
            label="List Api"
          />
        </div>
      )}
    </div>
  );
};

export default ListItemsField;
