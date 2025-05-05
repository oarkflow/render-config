/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { usePuck } from "@/packages/measured/puck";
import React, { useEffect, useState, useRef } from "react";
import { PageTemplate } from "../../types";
import { pageTemplateApi } from "../../utils/Api";
import { toast } from "sonner";

// Helper function to generate a new unique ID
function generateUniqueId() {
  // Use more entropy by combining timestamp with random values
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create a map to keep track of which IDs we've seen already
const seenIds = new Map<string, boolean>();

// Helper function to recursively assign new IDs to all elements in the content
function ensureUniqueKeys(item: any) {
  // Skip if null or not an object
  if (!item || typeof item !== 'object') return item;
  
  // Create a new copy with a new ID
  const result = Array.isArray(item) ? [...item] : { ...item };
  
  // If the item has an ID, generate a completely new unique ID
  if (result.id) {
    // Extract the prefix (everything before the first hyphen)
    const idParts = result.id.split('-');
    const prefix = idParts[0]; // Take only the type prefix (Text, Column, etc.)
    
    // Generate a new unique ID that we haven't seen before
    let newId: string;
    do {
      newId = `${prefix}-${generateUniqueId()}`;
    } while (seenIds.has(newId));
    
    // Record this ID as seen
    seenIds.set(newId, true);
    
    // Set the new ID
    result.id = newId;
  }
  
  // Process arrays (like content)
  if (Array.isArray(result)) {
    for (let i = 0; i < result.length; i++) {
      result[i] = ensureUniqueKeys(result[i]);
    }
  } 
  // Process nested objects
  else if (typeof result === 'object') {
    Object.keys(result).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        result[key] = ensureUniqueKeys(result[key]);
      }
    });
  }
  
  return result;
}

const CustomElement: React.FC = () => {
  // Use ref to track if component has mounted and template selected
  const hasSelectedTemplate = useRef(false);
  const [isOpen, setIsOpen] = useState(true);
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  // Add state for the selected template
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const { appState } = usePuck();

  function removeCustomElements(data: any) {
    if (data.content && Array.isArray(data.content)) {
      data.content = data.content.filter((item: any) => item.type !== "Custom");
    }
    return data;
  }
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await pageTemplateApi.getAllTemplates();
      setTemplates(data);
    };
    fetchData();

    return () => {
      hasSelectedTemplate.current = false;
    };
  }, []);

  // Handle template selection - now just sets the selected template
  const handleTemplateSelect = (template: PageTemplate) => {
    setSelectedTemplate(template);
  };

  // Apply the selected template
  const applySelectedTemplate = () => {
    setIsOpen(false);
    try {
      if (!selectedTemplate) return;
      
      // Clear the seen IDs map before applying a new template
      seenIds.clear();
      
      const template = { ...selectedTemplate };
      template.metadata = removeCustomElements(template.metadata as any);
      console.log('Custom element removed');
      
      // Parse the template metadata
      const templateData = JSON.parse(template.metadata);
      
      // Ensure all content items have unique IDs by processing them
      const newContent = ensureUniqueKeys(templateData.content || []);
      const newZones = templateData.zones || {};
      const newRoot = templateData.root || {};
      console.log('New keys added to template elements');
      
      // Create a completely new content array
      const newAppContent: any[] = [];
      let customFound = false;
      
      // Go through existing content and replace Custom with template content
      for (let i = 0; i < appState.data.content.length; i++) {
        const item = appState.data.content[i];
        if (item.type === "Custom" && !customFound) {
          // Add template content instead of Custom element
          customFound = true;
          
          // Add each template content item individually
          newContent.forEach((contentItem: any) => {
            newAppContent.push(contentItem);
          });
        } else {
          // Keep non-Custom elements
          newAppContent.push(item);
        }
      }
      
      // Update the appState with the new content
      const finalZones = { ...appState.data.zones, ...newZones };
      const finalRoot = { ...appState.data.root, ...newRoot };
      
      appState.data = {
        content: newAppContent,
        zones: finalZones,
        root: finalRoot,
      };
      
      // Mark that a template has been selected to prevent dialog reopening
      hasSelectedTemplate.current = true;
      toast.success("Template applied successfully");
    } catch (e: any) {
      toast.error("Something went wrong applying the template");
      console.error("Error applying template:", e);
    }
  };

  // If a template has already been selected, don't render the dialog
  if (hasSelectedTemplate.current) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        // If dialog is closed manually, mark as selected to prevent reopening
        if (!open) {
          hasSelectedTemplate.current = true;
        }
      }}>
        <DialogContent className="sm:max-w-[600px]" aria-describedby="templates">
          <DialogHeader>
            <DialogTitle>Templates</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            {templates.map((template) => (
              <Card
                key={template.page_template_id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedTemplate?.page_template_id === template.page_template_id
                    ? "border-2 border-primary shadow-md"
                    : "hover:border-gray-300"
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Key:</strong> {template.key}
                  </p>
                  <p>
                    <strong>Status:</strong> {template.status}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(template?.updated_at || "").toLocaleDateString(
                      "en-GB",
                      {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsOpen(false);
              hasSelectedTemplate.current = true;
            }}>
              Cancel
            </Button>
            <Button 
              onClick={applySelectedTemplate}
              disabled={!selectedTemplate}
            >
              Apply Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomElement;
