/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export interface ListItem {
  content: string;
}

export interface ListItemsValue {
  mode?: "manual" | "api";
  items?: ListItem[];
  apiPath?: string;
  integrationName?: string;
  fieldName?: string;
}

export interface ListRendererProps {
  items: ListItemsValue | ListItem[];
  listStyle: string;
  listStylePosition: "inside" | "outside";
  as: "ol" | "ul";
  [key: string]: any;
}

/**
 * A component that renders a list from either manual items or an API source.
 * If in API mode and API data is available, it will use that. Otherwise, it falls back to manual items.
 */
const ListRenderer = ({ 
  items, 
  listStyle, 
  listStylePosition, 
  as: Component, 
  ...rest 
}: ListRendererProps) => {
  const [apiItems, setApiItems] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Normalize the items object for consistent handling
  const normalizedItems: ListItemsValue = Array.isArray(items) 
    ? { mode: "manual", items, apiPath: "" }
    : items || { mode: "manual", items: [], apiPath: "" };
    
  const mode = normalizedItems.mode || "manual";
  const apiPath = normalizedItems.apiPath || "";
  const fieldName = normalizedItems.fieldName || "";
  const manualItems = Array.isArray(normalizedItems.items) ? normalizedItems.items : [];

  useEffect(() => {
    async function fetchListItems() {
      if (mode !== "api" || !apiPath) return;
      
      setIsLoading(true);
      setError("");
      
      try {
        // Use the API utility for fetching data
        const response = await fetch(apiPath);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();

        // Extract the data using the fieldName if provided
        let items;
        if (fieldName) {
          // Split the field path (e.g., "body.users") and traverse the object
          items = fieldName.split('.').reduce((obj, key) => 
            obj && typeof obj === 'object' ? obj[key] : undefined, 
            data
          );
        } else {
          // If no field name, use the data directly
          items = data;
        }
        
        if (Array.isArray(items)) {
          // Map items to the expected format
          const formattedItems = items.map(item => {
            if (typeof item === 'string') {
              return { content: item };
            } else if (item && typeof item === 'object') {
              // Look for a property that might contain the content
              const content = 
                item.content || 
                item.text || 
                item.name || 
                item.title || 
                item.label ||
                JSON.stringify(item);
              return { content: String(content) };
            } else {
              return { content: String(item) };
            }
          });
          setApiItems(formattedItems);
        } else {
          setApiItems([]);
          setError("API did not return an array");
        }
      } catch (err) {
        console.error("Error fetching list items:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch list items");
        setApiItems([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchListItems();
  }, [mode, apiPath, fieldName]);

  // Use API items if available and in API mode, otherwise use manual items
  const displayItems = (mode === "api" && apiItems.length > 0) 
    ? apiItems 
    : manualItems;

  return (
    <>
      <Component style={{ listStyle, listStylePosition }} {...rest}>
        {isLoading && <li className="text-gray-400">Loading items...</li>}
        {error && <li className="text-red-500">Error: {error}</li>}
        {!isLoading && !error && displayItems.map((item: ListItem, index: number) => (
          <li key={index}>{item.content}</li>
        ))}
        {!isLoading && !error && displayItems.length === 0 && (
          <li className="text-gray-400">No items to display</li>
        )}
      </Component>
      {mode === "api" && apiItems.length === 0 && !isLoading && !error && manualItems.length === 0 && (
        <div className="text-sm text-amber-500 mt-1">
          No items to display. Please check your integration settings or add manual items.
        </div>
      )}
    </>
  );
};

export default ListRenderer;
