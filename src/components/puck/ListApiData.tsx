import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertTriangle } from "lucide-react";
import { request } from "@/lib/api";

interface Integration {
  integration_id: number;
  name: string;
  slug: string;
  service_type: string;
  protocol: string;
  configuration: {
    responseFormat?: Record<string, unknown>;
    config?: Record<string, unknown>;
  };
}

interface ListApiDataProps {
  value?: string;
  onChange: (value: string, metadata?: { integrationName?: string; fieldName?: string }) => void;
  integrationName?: string;
  fieldName?: string;
}

// Function to extract array fields from configuration and check if root is array
function getArrayFields(integration: Integration): { fields: string[], isRootArray: boolean, hasResponseFormat: boolean } {
  const fields: string[] = [];
  let isRootArray = false;
  let hasResponseFormat = false;
  
  // Extract from responseFormat if available
  const searchForArrays = (obj: Record<string, unknown> | unknown[], path: string = '') => {
    if (!obj) return;
    
    hasResponseFormat = true;
    
    if (Array.isArray(obj)) {
      // If this is the root object and it's an array
      if (path === '') {
        isRootArray = true;
        fields.push('rootNode');
      } else {
        fields.push(path);
      }
      return;
    }
    
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        const newPath = path ? `${path}.${key}` : key;
        searchForArrays((obj as Record<string, unknown>)[key] as Record<string, unknown> | unknown[], newPath);
      });
    }
  };
  
  // Check in different potential locations for response format
  if (integration.configuration?.responseFormat) {
    searchForArrays(integration.configuration.responseFormat);
  } else if (integration.configuration?.config?.responseFormat) {
    searchForArrays(integration.configuration.config.responseFormat as Record<string, unknown> | unknown[]);
  }
  
  return { fields, isRootArray, hasResponseFormat };
}

const ListApiData: React.FC<ListApiDataProps> = ({ value, onChange, integrationName, fieldName }) => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [arrayFields, setArrayFields] = useState<string[]>([]);
  const [selectedField, setSelectedField] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasResponseFormat, setHasResponseFormat] = useState(true);

  // Try to parse the value prop to extract integration ID and field name
  useEffect(() => {
    if (value && integrations.length > 0) {
      try {
        const parts = value.split('/');
        const integrationId = parts[3]; // Assuming format "/api/integration/:id/data"
        const queryParams = new URLSearchParams(value.split('?')[1] || '');
        const field = queryParams.get('field') || '';
        
        if (integrationId) {
          // Set selected integration if we have one
          const integration = integrations.find(i => i.integration_id.toString() === integrationId);
          if (integration) {
            setSelectedIntegration(integration);
            
            // Get array fields for this integration
            const { fields, hasResponseFormat } = getArrayFields(integration);
            setArrayFields(fields);
            setHasResponseFormat(hasResponseFormat);
            
            // Set selected field if any
            if (field) {
              setSelectedField(field);
            } else if (fields.includes('rootNode')) {
              setSelectedField('rootNode');
            }
          }
        }
      } catch (e) {
        console.error("Error parsing value:", e);
      }
    }
  }, [value, integrations]);

  // If we have initial values for integrationName or fieldName, try to select them
  useEffect(() => {
    if (integrationName && integrations.length > 0) {
      const integration = integrations.find(i => i.name === integrationName);
      if (integration) {
        setSelectedIntegration(integration);
        
        // Get array fields for this integration
        const { fields, hasResponseFormat } = getArrayFields(integration);
        setArrayFields(fields);
        setHasResponseFormat(hasResponseFormat);
        
        // If we have a fieldName, select it if it's in the available fields
        if (fieldName && fields.includes(fieldName)) {
          setSelectedField(fieldName);
        }
      }
    }
  }, [integrationName, fieldName, integrations]);

  // Fetch integrations on component mount
  useEffect(() => {
    const fetchIntegrations = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        // Using request with correct endpoint object format
        const data = await request<null, Integration[], Integration[]>({
          url: '/workflow/integrations',
          method: 'get'
        });
        
        if (Array.isArray(data)) {
          setIntegrations(data);
        } else {
          setIntegrations([]);
          console.warn("Unexpected response format from integrations API");
        }
      } catch (err) {
        console.error("Error fetching integrations:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch integrations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntegrations();
  }, []);

  const handleIntegrationChange = (integrationId: string) => {
    const integration = integrations.find(i => i.integration_id.toString() === integrationId);
    
    if (integration) {
      setSelectedIntegration(integration);
      
      // Get array fields for this integration
      const { fields, isRootArray, hasResponseFormat } = getArrayFields(integration);
      setArrayFields(fields);
      setHasResponseFormat(hasResponseFormat);
      
      // Reset selected field
      setSelectedField('');
      
      // If root is array, pre-select rootNode
      if (isRootArray) {
        setSelectedField('rootNode');
        const integrationId = integration.integration_id.toString();
        const newValue = `/api/integration/${integrationId}/data`;
        onChange(newValue, { 
          integrationName: integration.name,
          fieldName: 'rootNode'
        });
      }
    }
  };
  
  const handleFieldChange = (field: string) => {
    setSelectedField(field);
    
    if (selectedIntegration) {
      const integrationId = selectedIntegration.integration_id.toString();
      // If field is rootNode, don't add it to the query params
      const newValue = field === 'rootNode' 
        ? `/api/integration/${integrationId}/data` 
        : `/api/integration/${integrationId}/data?field=${field}`;
        
      onChange(newValue, { 
        integrationName: selectedIntegration.name,
        fieldName: field
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Integration</Label>
        {isLoading ? (
          <div className="flex items-center space-x-2 py-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading integrations...</span>
          </div>
        ) : error ? (
          <div className="text-sm text-destructive py-2 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <Select 
            value={selectedIntegration?.integration_id.toString() || ''} 
            onValueChange={handleIntegrationChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an integration" />
            </SelectTrigger>
            <SelectContent>
              {integrations.map((integration) => (
                <SelectItem key={integration.integration_id} value={integration.integration_id.toString()}>
                  {integration.name}
                </SelectItem>
              ))}
              {integrations.length === 0 && (
                <div className="text-sm text-muted-foreground px-2 py-4 text-center">
                  No integrations found
                </div>
              )}
            </SelectContent>
          </Select>
        )}
      </div>
      
      {selectedIntegration && arrayFields.length > 0 && (
        <div className="space-y-2">
          <Label>Select Data Field</Label>
          <Select 
            value={selectedField} 
            onValueChange={handleFieldChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a data field" />
            </SelectTrigger>
            <SelectContent>
              {arrayFields.map((field) => (
                <SelectItem key={field} value={field}>
                  {field === 'rootNode' ? 'Root Response (Array)' : field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {selectedIntegration && (arrayFields.length === 0 || !hasResponseFormat) && (
        <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-700">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">No array fields found in this integration</p>
            <p className="mt-1">This integration doesn't provide a response format with array fields that can be used for lists.</p>
          </div>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className="rounded-md bg-muted p-3 text-sm space-y-2">
          <p className="font-medium">Integration Requirements:</p>
          <p>The selected integration should have a <code>responseFormat</code> field with array data.</p>
          <p>Each item should contain a <code>content</code> property or be convertible to a string.</p>
        </div>
      )}
    </div>
  );
};

export default ListApiData;
