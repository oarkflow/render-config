/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Database,
  Globe,
  Trash2,
  Copy,
  Pencil,
} from 'lucide-react';
import React, { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { request } from '@/lib/api';
import { MentionsInput, Mention  } from 'react-mentions';
import '@/styles/react-mentions.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; 

interface ContentFieldPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

interface ResponseIntegration {
  integration_id: number;
  name: string;
  slug: string;
  configuration: any;
  description: string;
  excerpt: string;
  service_type: string;
  protocol: string;
  allowed_integration_count: number;
  status: string;
  is_active: boolean;
}

interface GlobalSetting {
  user_setting_id: number;
  user_id: number;
  key: string;
  value: string;
  value_type: string;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Suggestion {
  key: string;
  path: string;
  fullPath: string;
  type: 'integration' | 'global' | 'local';
}

interface MentionData {
  id: string;
  display: string;
  type: 'integration' | 'global' | 'local';
  preview: string;
  key?: string; // Optional property for displaying in AutocompleteItem
}

const ContentFieldPicker: React.FC<ContentFieldPickerProps> = ({
  onChange,
  value = '',
  ...props
}) => {
  const [showViewLocalModal, setShowViewLocalModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedJsons, setSavedJsons] = useState<Record<string, any>>({});
  const [globalSettings, setGlobalSettings] = useState<{ key: string; value: string }[]>([]);

  const [apiFields, setApiFields] = useState<string[]>([]);
  const [jsonName, setJsonName] = useState<string>('');
  const [jsonContent, setJsonContent] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Add a setValue state to properly handle controlled component
  const [internalValue, setInternalValue] = useState<string>(value);
  const [showGlobalModal, setShowGlobalModal] = useState(false);
  const [showAddLocalModal, setShowAddLocalModal] = useState(false);
  const [selectedApi, setSelectedApi] = useState<string>('');
  const [apiList, setApiList] = useState<Record<string, string>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const cursorPosition = { top: 0, left: 0 };
  // Global data state
  const [globalDataLoading, setGlobalDataLoading] = useState(false);
  const [globalDataError, setGlobalDataError] = useState<string | null>(null);

  // Function to fetch integrations from API
  const fetchIntegrations = useCallback(async () => {
    try {
      setIsLoading(true);

      const response: ResponseIntegration[] = await request({
        url: '/workflow/integrations',
        method: 'get',
        dataKey: 'data',
      });

      // Store integrations in localStorage for path extraction
      localStorage.setItem('integrations', JSON.stringify(response));

      if (response.length > 0) {
        const firstIntegration = response[0];
        const integrationList: Record<string, string>[] = [];

        const integrationMap: Record<string, string> = {};
        response.forEach(integration => {
          integrationMap[integration.name] = JSON.stringify({
            type: 'integration',
            configuration: integration.configuration,
          });
        });

        integrationList.push(integrationMap);
        setApiList(integrationList);

        // If global constants are available, extract them
        try {
          const fields = firstIntegration.configuration?.globalConstants
            ? JSON.parse(firstIntegration.configuration.globalConstants)
            : {};

          if (fields && typeof fields === 'object' && !Array.isArray(fields)) {
            delete fields.type;
            setGlobalSettings(fields);
          }
        } catch (err) {
          console.error('Error parsing global constants:', err);
        }
      }
    } catch (err) {
      console.error('Error fetching integrations:', err);
      setApiList([]);
    } finally {
      setIsLoading(false);
    }
  }, [request]); // Add request to dependency array

  // Load API data from API request
  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  // Function to fetch global settings data
  const fetchGlobalSettings = useCallback(async () => {
    try {
      setGlobalDataLoading(true);
      setGlobalDataError(null);

      const response = await request<unknown, { data: GlobalSetting[] }, GlobalSetting[]>({
        url: '/user-settings/1/list',
        method: 'get',
        dataKey: 'data',
      });

      // Transform the data to the format we need
      const formattedSettings = response.map(setting => ({
        key: setting.key,
        value: setting.value,
      }));

      setGlobalSettings(formattedSettings);
    } catch (error) {
      console.error('Error fetching global settings:', error);
      setGlobalDataError('Failed to load global settings');
    } finally {
      setGlobalDataLoading(false);
    }
  }, []);

  // Load global settings when the global modal is opened
  useEffect(() => {
    if (showGlobalModal) {
      fetchGlobalSettings();
    }
  }, [showGlobalModal, fetchGlobalSettings]);

  const handleApiSelect = (apiName: string) => {
    setSelectedApi(apiName);
  };

  const loadApiData = async (value: string) => {
    setIsLoading(true);
    setError(null);
    setApiFields([]);

    try {
      // Check if it's a regular API (not part of an integration)
      if (!value.startsWith('integration_')) {
        // It's a third-party API, extract fields from the configuration
        const apiData = apiList[0]?.[value];
        if (!apiData) {
          setError('API data not found.');
          return;
        }

        let configuration;
        try {
          configuration = JSON.parse(apiData);
          console.log('API Configuration:', configuration);
        } catch (err) {
          console.error('Error parsing API configuration:', err);
          setError('Invalid API configuration format.');
          return;
        }

        // For the integration type, check different possible locations of responseFormat
        let responseFormatFound = false;
        let fieldsToExtract: string[] = [];

        // Check directly in configuration.responseFormat
        if (configuration.configuration?.responseFormat) {
          fieldsToExtract = getAllFields(configuration.configuration.responseFormat);
          console.log('Extracted fields from configuration.responseFormat:', fieldsToExtract);
          setApiFields(fieldsToExtract);
          responseFormatFound = true;
        }
        // Check in configuration.request_api.response
        else if (configuration.configuration?.request_api?.response) {
          fieldsToExtract = getAllFields(configuration.configuration.request_api.response);
          console.log('Extracted fields from request_api.response:', fieldsToExtract);
          setApiFields(fieldsToExtract);
          responseFormatFound = true;
        }
        // Check nested config for responseFormat
        else if (configuration.configuration?.config?.responseFormat) {
          fieldsToExtract = getAllFields(configuration.configuration.config.responseFormat);
          console.log('Extracted fields from config.responseFormat:', fieldsToExtract);
          setApiFields(fieldsToExtract);
          responseFormatFound = true;
        }
        // Look for any key that might contain a responseFormat
        else {
          const configKeys = Object.keys(configuration);
          for (const key of configKeys) {
            if (
              configuration[key] &&
              typeof configuration[key] === 'object' &&
              configuration[key].responseFormat
            ) {
              fieldsToExtract = getAllFields(configuration[key].responseFormat);
              console.log(`Extracted fields from ${key}.responseFormat:`, fieldsToExtract);
              setApiFields(fieldsToExtract);
              responseFormatFound = true;
              break;
            }
          }
        }

        // Even if no responseFormat was found, don't show an error
        // There might be other useful fields in the configuration
        if (!responseFormatFound) {
          console.log('No specific response format found, but continuing anyway');

          // Try to extract any fields from the configuration as a fallback
          const allFields = getAllFields(configuration);
          if (allFields.length > 0) {
            console.log('Extracted general fields from configuration:', allFields);
            setApiFields(allFields);
          } else {
            setApiFields(['data', 'status', 'message']); // Provide some common defaults
          }
        }
      } else {
        // For regular API, we don't need to fetch anything
        // Just set a placeholder message
        console.log('Regular API, no response format to extract');
        setApiFields(['data', 'response', 'status', 'message']); // Provide some common defaults
      }
    } catch (err) {
      console.error('Error loading API data:', err);
      setError('Error loading API data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllFields = (obj: any, prefix = ''): string[] => {
    let fields: string[] = [];
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          fields = [...fields, ...getAllFields(obj[key], `${prefix}${key}.`)];
        } else {
          fields.push(`${prefix}${key}`);
        }
      }
    }
    return fields;
  };

  const copyIntegrationField = (field: string) => {
    if (!selectedApi || !apiList || apiList.length === 0) return;

    try {
      const apiData = JSON.parse(apiList[0][selectedApi]);
      if (apiData.type === 'integration') {
        // Get the slug from the integration data
        const slug = apiData.slug || selectedApi.toLowerCase().replace(/\s+/g, '_');

        // Format: ${integration.slug.configuration.responseFormat.field}
        const formattedPath = `\${integration.${slug}.configuration.responseFormat.${field}}`;

        // Copy to clipboard
        navigator.clipboard.writeText(formattedPath);

        // Use toast function correctly
        toast.success(`Field copied: ${formattedPath}`);

        // Close any open dialogs
        // setShowApiModal(false);
      }
    } catch (err) {
      console.error('Error copying field path:', err);
      toast.error('Failed to copy field path');
    }
  };
  // Set focus in the textarea to make sure we get correct caret position
  useEffect(() => {
    if (textareaRef.current) {
      // Ensure selection is present to get cursor position
      textareaRef.current.focus();
      // Preserve the cursor position
      textareaRef.current.setSelectionRange(cursorPosition.top, cursorPosition.left);
    }
  }, []);

  // Remove unused state and refs
  // Remove unused keyboard handling function

  // Load local JSON data when component mounts
  useEffect(() => {
    const storedJsons = localStorage.getItem('localJsonData');
    if (storedJsons) {
      try {
        setSavedJsons(JSON.parse(storedJsons));
      } catch (error) {
        console.error('Error parsing saved JSON data:', error);
      }
    }

    // Fetch integration data
    fetchIntegrations();

    // Fetch global data
    fetchGlobalSettings();
  }, [fetchIntegrations, fetchGlobalSettings]);

  // Create nested suggestions for the integration fields
  const createNestedIntegrationSuggestions = (): Suggestion[] => {
    const nestedPaths: Suggestion[] = [];

    try {
      // Get integrations data from localStorage
      const integrationData = localStorage.getItem('integrations');
      if (integrationData) {
        const integrations = JSON.parse(integrationData);

        integrations.forEach((integration: any) => {
          // Check for responseFormat in various possible locations
          let responseFormat = null;

          if (integration.configuration?.responseFormat) {
            responseFormat = integration.configuration.responseFormat;
          } else if (integration.configuration?.request_api?.response) {
            responseFormat = integration.configuration.request_api.response;
          } else if (integration.configuration?.response) {
            responseFormat = integration.configuration.response;
          }

          // Define a nested function to extract paths
          const extractResponseFormatPaths = (obj: any, prefix: string) => {
            if (!obj || typeof obj !== 'object') return;

            Object.keys(obj).forEach(key => {
              const currentPath = `${prefix}.${key}`;

              // Add current path with integration name included
              nestedPaths.push({
                key: `integration.${integration.slug}.${currentPath}`,
                path: currentPath,
                fullPath: `\${integration.${integration.slug}.${currentPath}}`,
                type: 'integration',
              });

              // Recursively process nested objects
              if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                extractResponseFormatPaths(obj[key], currentPath);
              }
              // For arrays, add array access notation
              else if (Array.isArray(obj[key]) && obj[key].length > 0) {
                const arrayPath = `${currentPath}[0]`;

                nestedPaths.push({
                  key: `integration.${integration.slug}.${arrayPath}`,
                  path: arrayPath,
                  fullPath: `\${integration.${integration.slug}.${arrayPath}}`,
                  type: 'integration',
                });

                // If first item is object, extract its paths too
                if (typeof obj[key][0] === 'object' && obj[key][0] !== null) {
                  extractResponseFormatPaths(obj[key][0], arrayPath);
                }
              }
            });
          };

          // Start the extraction with the proper prefix
          extractResponseFormatPaths(responseFormat, 'configuration.responseFormat');
        });
      }
    } catch (error) {
      console.error('Error extracting integration paths:', error);
    }

    // Remove duplicates by using a Set for the keys
    const uniqueKeys = new Set<string>();
    const uniquePaths: Suggestion[] = [];

    nestedPaths.forEach(item => {
      if (!uniqueKeys.has(item.key)) {
        uniqueKeys.add(item.key);
        uniquePaths.push(item);
      }
    });

    return uniquePaths;
  };

  // Get suggestions for integration data
  const getIntegrationSuggestions = (token: string): Suggestion[] => {
    const nestedIntegrationPaths = createNestedIntegrationSuggestions();
    const suggestions: Suggestion[] = [];

    // If token is provided, filter suggestions that include the token
    if (token && token.trim() !== '') {
      nestedIntegrationPaths.forEach(item => {
        if (item.key.toLowerCase().includes(token.toLowerCase())) {
          suggestions.push(item);
        }
      });
    } else {
      // Return all integration suggestions if no token
      suggestions.push(...nestedIntegrationPaths);
    }

    return suggestions;
  };

  // Get suggestions for global settings
  const getGlobalSuggestions = (token: string): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    globalSettings.forEach(setting => {
      const key = `global.${setting.key}`;

      // Add suggestion only if it includes the token or token is empty
      if (!token || key.toLowerCase().includes(token.toLowerCase())) {
        suggestions.push({
          key: key,
          path: setting.key,
          fullPath: `\${global.${setting.key}}`,
          type: 'global',
        });
      }
    });

    return suggestions;
  };

  // Get suggestions for local JSON data
  const getLocalSuggestions = (token: string): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    // Process local JSON data to create nested paths
    Object.keys(savedJsons).forEach(key => {
      // Add the top-level key suggestion
      const localKey = `local.${key}`;

      // Add only if it includes the token or token is empty
      if (!token || localKey.toLowerCase().includes(token.toLowerCase())) {
        suggestions.push({
          key: localKey,
          path: key,
          fullPath: `\${local.${key}}`,
          type: 'local',
        });
      }

      // If the value is an object, add nested paths
      if (typeof savedJsons[key] === 'object' && savedJsons[key] !== null) {
        // Deep traverse the object to create nested paths
        const addNestedPaths = (obj: any, currentPath: string) => {
          Object.keys(obj).forEach(nestedKey => {
            const newPath = `${currentPath}.${nestedKey}`;
            const fullKey = `local.${newPath}`;

            // Add only if it includes the token or token is empty
            if (!token || fullKey.toLowerCase().includes(token.toLowerCase())) {
              suggestions.push({
                key: fullKey,
                path: newPath,
                fullPath: `\${local.${newPath}}`,
                type: 'local',
              });
            }

            // Continue traversing if this is also an object
            if (typeof obj[nestedKey] === 'object' && obj[nestedKey] !== null) {
              addNestedPaths(obj[nestedKey], newPath);
            }
          });
        };

        // Start traversing from the top-level key
        addNestedPaths(savedJsons[key], key);
      }
    });

    return suggestions;
  };

  // Simplified suggestion provider for react-mentions format
  const suggestionProviderMentions = (token: string): MentionData[] => {
    console.log('Autocomplete data triggered with token:', token);

    // Get original suggestions from all sources
    const localSuggestions = getLocalSuggestions(token);
    const integrationSuggestions = getIntegrationSuggestions(token);
    const globalSuggestions = getGlobalSuggestions(token);

    console.log('Original suggestions count:', {
      localCount: localSuggestions.length,
      integrationCount: integrationSuggestions.length,
      globalCount: globalSuggestions.length,
    });

    // Convert to react-mentions format
    const formattedLocalSuggestions = localSuggestions.map(item => ({
      id: item.key,
      display: item.key,
      type: 'local' as const,
      preview:
        typeof savedJsons[item.path] === 'object'
          ? JSON.stringify(savedJsons[item.path]).substring(0, 30) + '...'
          : String(savedJsons[item.path]),
    }));

    const formattedIntegrationSuggestions = integrationSuggestions.map(item => {
      const path = item.path;
      // Create a simplified preview based on the integration memory structure
      let preview = 'Integration field';

      // Format different paths based on the standardized configuration
      if (path.includes('auth.credential')) {
        preview = 'Authentication credential';
      } else if (path.includes('configuration.request_api.request')) {
        preview = 'API request configuration';
      } else if (path.includes('configuration.request_api.response')) {
        preview = 'API response mapping';
      }

      return {
        id: item.key,
        display: item.key,
        type: 'integration' as const,
        preview: preview,
      };
    });

    const formattedGlobalSuggestions = globalSuggestions.map(item => {
      // Find the matching global setting to get its value
      const globalSetting = globalSettings.find(setting => setting.key === item.path);
      const preview = globalSetting
        ? String(globalSetting.value).substring(0, 30) +
          (String(globalSetting.value).length > 30 ? '...' : '')
        : 'Global setting';

      return {
        id: item.key,
        display: item.key,
        type: 'global' as const,
        preview,
      };
    });

    // Combine all suggestions
    const allSuggestions = [
      ...formattedLocalSuggestions,
      ...formattedIntegrationSuggestions,
      ...formattedGlobalSuggestions,
    ];

    console.log('Formatted suggestions for dropdown:', allSuggestions);

    return allSuggestions;
  };

  // Item component for rendering suggestions
  // const AutocompleteItem = ({ entity }: { entity: MentionData }) => {
  //   let iconClass = '';
  //   let labelText = '';

  //   if (entity.type === 'integration') {
  //     iconClass = 'bg-blue-100 text-blue-800';
  //     labelText = 'API';
  //   } else if (entity.type === 'global') {
  //     iconClass = 'bg-purple-100 text-purple-800';
  //     labelText = 'Global';
  //   } else {
  //     iconClass = 'bg-green-100 text-green-800';
  //     labelText = 'Local';
  //   }

  //   return (
  //     <div className="p-2 hover:bg-gray-100 flex items-center cursor-pointer overflow-hidden">
  //       <div className="flex flex-col w-full overflow-hidden">
  //         <div className="flex items-center gap-2 flex-wrap">
  //           <span className="font-medium break-all whitespace-normal">{entity.display}</span>
  //           <span className={`text-xs px-2 py-0.5 rounded ${iconClass}`}>{labelText}</span>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // Load data when component mounts
  useEffect(() => {
    // Load saved JSON data from localStorage
    const savedData = localStorage.getItem('localJsonData');
    if (savedData) {
      try {
        setSavedJsons(JSON.parse(savedData));
      } catch (error) {
        console.error('Error parsing saved JSON data:', error);
      }
    }

    // Fetch integration data
    fetchIntegrations();

    // Fetch global data
    fetchGlobalSettings();
  }, [fetchIntegrations, fetchGlobalSettings]);

  const clearField = () => {
    setInternalValue('');
    onChange?.('');
    setSelectedApi('');
    setApiFields([]);
    setError(null);
  };

  // const mentionsInputStyle:any = {
  //   suggestions: {
  //     list: {
  //       backgroundColor: 'white',
  //       border: '1px solid rgba(0,0,0,0.15)',
  //       fontSize: 10,
  //       maxHeight: 'min(300px, 70vh)',
  //       maxWidth: '25vw',
  //       overflow: 'auto',
  //       borderRadius: '0.375rem',
  //       boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  //       width: '25vw', // Limit width to prevent overflow
  //       zIndex: 999,
  //       whiteSpace: 'wrap',
  //     },
  //     item: {
  //       padding: '5px 12px',
  //       borderBottom: '1px solid rgba(0,0,0,0.15)',
  //     },
  //   },
  //   input: {
  //     width: '100%',
  //     height: '150px',
  //     padding: '9px 12px',
  //     boxSizing: 'border-box',
  //     border: '1px solid rgba(0,0,0,0.15)',
  //     borderRadius: '0.375rem',
  //     fontSize: 14,
  //     lineHeight: '20px',
  //     backgroundColor: '#fff',
  //     outline: 0,
  //     resize: 'vertical',
  //   },
  //   highlighter: {
  //     boxSizing: 'border-box',
  //     overflow: 'auto',
  //     height: '150px',
  //     width: '100%',
  //     padding: '9px 12px',
  //     borderRadius: '0.375rem',
  //     fontSize: 14,
  //     lineHeight: '20px',
  //   },
  // };

  // Update useEffect to sync value with internalValue when value changes from props
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div className="space-y-2 w-full">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium text-sm">Data Source</label>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1 bg-white hover:bg-gray-100 border border-gray-300 rounded-md text-xs flex items-center gap-1"
                    title="Local Data Options"
                  >
                    <Database className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setShowViewLocalModal(true)}>
                    Show Local Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowAddLocalModal(true)}>
                    Create Local Data
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                className="p-1 bg-white hover:bg-gray-100 border border-gray-300 rounded-md text-xs flex items-center gap-1"
                onClick={() => setShowGlobalModal(true)}
                title="Use Global Data"
              >
                <Globe className="h-4 w-4" />
              </button>
              <button
                className="p-1 bg-white hover:bg-gray-100 border border-gray-300 rounded-md text-xs flex items-center gap-1"
                onClick={clearField}
                title="Clear Content"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedApi || ''}
            onChange={e => handleApiSelect(e.target.value)}
          >
            <option value="">Select Data Source</option>
            {apiList &&
              apiList.length > 0 &&
              Object.keys(apiList[0]).map(apiName => (
                <option key={apiName} value={apiName}>
                  {apiName.startsWith('integration_')
                    ? `${JSON.parse(apiList[0][apiName]).name}`
                    : apiName}
                </option>
              ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-medium text-sm">Content Template</label>
          <div className="relative">
            <div className="border border-gray-300 rounded-md relative">
              <MentionsInput
                value={internalValue}
                onChange={(event: any, newValue: string) => {
                  // We don't want to transform here anymore since we want to
                  // preserve the format in both textarea and UI
                  setInternalValue(newValue);
                  onChange?.(newValue);
                }}
                className="mentions-input"
                // style={mentionsInputStyle}
                placeholder="Enter content here. Use $ to access variables from local JSON, integrations, or global settings."
              >
                <Mention
                  trigger="${"
                  data={(search: string) => {
                    console.log('Search query:', search);
                    // Filter suggestions based on search input (without the $ character)
                    return suggestionProviderMentions(search);
                  }}
                  renderSuggestion={(
                    suggestion: any,
                    search: string,
                    highlightedDisplay: ReactNode,
                    index: number,
                    focused: boolean,
                  ) => (
                    <div
                      className={`${focused ? 'bg-gray-100' : ''} flex items-start p-2 overflow-hidden`}
                    >
                      <div className="flex flex-col w-full overflow-hidden">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium break-all whitespace-normal">
                            {suggestion.display}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              suggestion.type === 'integration'
                                ? 'bg-blue-100 text-blue-800'
                                : suggestion.type === 'global'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {suggestion.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  displayTransform={(id: string) => `${id}`}
                  markup="${__id__}"
                />
              </MentionsInput>
              {/* {internalValue && (
                <button
                  type="button"
                  className="absolute right-2 top-2 p-1 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={clearField}
                  aria-label="Clear field"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )} */}
            </div>
          </div>
        </div>

        {selectedApi && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-medium text-sm">Available Fields</label>
              <button
                className="text-xs text-blue-500 hover:text-blue-700"
                onClick={() => loadApiData(selectedApi)}
              >
                Refresh Fields
              </button>
            </div>

            {isLoading && <div className="text-sm text-gray-500">Loading fields...</div>}
            {error && <div className="text-sm text-red-500">{error}</div>}

            {!isLoading && !error && apiFields.length === 0 && (
              <div className="text-sm text-gray-500">
                No response format fields found. Click "Refresh Fields" to try again.
              </div>
            )}

            {!isLoading && !error && apiFields.length > 0 && (
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-1 divide-y divide-gray-200">
                    {apiFields.map((field, index) => {
                      // Get the API data to extract the slug
                      const apiData =
                        selectedApi && apiList && apiList.length > 0
                          ? JSON.parse(apiList[0][selectedApi])
                          : null;

                      const slug = apiData?.slug || '';
                      const formattedField = `\${integrations.${slug}.responseformat.${field}}`;

                      return (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-gray-50 flex justify-between items-center"
                        >
                          <div className="truncate text-sm" title={formattedField}>
                            {field}
                          </div>
                          <button
                            className="text-blue-500 hover:text-blue-700 p-1"
                            onClick={() => copyIntegrationField(field)}
                            title="Copy to clipboard"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Local Data Modal */}
      {showAddLocalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90%]">
            <h3 className="text-lg font-medium mb-4">Add Local JSON Data</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={jsonName}
                  onChange={e => setJsonName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter a name for this JSON data"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">JSON Data</label>
                <textarea
                  value={jsonContent}
                  onChange={e => {
                    // Just store the raw text without any parsing
                    setJsonContent(e.target.value);
                    setError(null); // Clear any previous errors
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-40 font-mono text-sm"
                  placeholder="{}"
                />
                {error && <div className="text-red-500 text-xs">{error}</div>}
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={() => {
                    setShowAddLocalModal(false);
                    setJsonName('');
                    setJsonContent('{}');
                    setError(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={!jsonName}
                  onClick={() => {
                    // Only validate and parse JSON when saving
                    try {
                      const jsonData = JSON.parse(jsonContent);
                      // Save the parsed JSON data
                      const newJsons = { ...savedJsons, [jsonName]: jsonData };
                      setSavedJsons(newJsons);
                      localStorage.setItem('localJsonData', JSON.stringify(newJsons));
                      setShowAddLocalModal(false);
                      setJsonName('');
                      setJsonContent('{}');
                      setError(null);
                      toast.success('Local JSON data added successfully!');
                    } catch (error: any) {
                      setError('Invalid JSON format' + error.message);
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Local Data Modal */}
      {showViewLocalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90%]">
            <h3 className="text-lg font-medium mb-4">Manage Local JSON Data</h3>
            <div className="space-y-4">
              {Object.keys(savedJsons).length > 0 ? (
                <div className="space-y-3">
                  {Object.keys(savedJsons).map(key => {
                    const jsonData = savedJsons[key];
                    const fields = getAllFields(jsonData);

                    return (
                      <div key={key} className="border border-gray-200 rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{key}</h4>
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => {
                                // setSelectedJsonName(key);
                                // Set the raw text for editing
                                setJsonContent(JSON.stringify(savedJsons[key], null, 2));
                                // setEditMode(true);
                                setJsonName(key);
                                setShowViewLocalModal(false);
                                setShowAddLocalModal(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => {
                                const newJsons = { ...savedJsons };
                                delete newJsons[key];
                                setSavedJsons(newJsons);
                                localStorage.setItem('localJsonData', JSON.stringify(newJsons));
                                toast.success('Local JSON data deleted successfully!');
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="mt-3">
                            <h5 className="text-sm font-medium mb-1">Fields:</h5>
                            <div className="border border-gray-200 rounded-md overflow-hidden">
                              <div className="max-h-60 overflow-y-auto">
                                <div className="grid grid-cols-1 divide-y divide-gray-200">
                                  {fields.map((field, index) => (
                                    <div
                                      key={index}
                                      className="px-3 py-2 hover:bg-gray-50 flex justify-between items-center"
                                    >
                                      <div className="truncate text-sm">{field}</div>
                                      <button
                                        className="text-blue-500 hover:text-blue-700 p-1"
                                        onClick={() => {
                                          const path = `\${local.${key}.${field}}`;
                                          navigator.clipboard
                                            .writeText(path)
                                            .then(() => {
                                              toast.success(`Copied: ${path}`);
                                              setShowViewLocalModal(false); // Close the modal after copying
                                            })
                                            .catch(error => {
                                              console.error('Error copying field:', error);
                                              toast.error('Failed to copy to clipboard');
                                            });
                                        }}
                                        title="Copy to clipboard"
                                      >
                                        <Copy className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">No local JSON data saved</div>
              )}
              <div className="flex justify-end pt-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={() => setShowViewLocalModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Data Modal */}
      {showGlobalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90%]">
            <h3 className="text-lg font-medium mb-4">Global Settings</h3>

            {globalDataLoading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : globalDataError ? (
              <div className="text-red-500 py-4">
                {globalDataError}
                <button
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  onClick={fetchGlobalSettings}
                >
                  Retry
                </button>
              </div>
            ) : globalSettings.length === 0 ? (
              <div className="text-gray-500 py-4">No global settings available</div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                <div className="space-y-2">
                  {globalSettings.map((setting, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-md flex justify-between items-center hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-medium">{setting.key}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[300px]">
                          {setting.value}
                        </div>
                      </div>
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          const textToCopy = `\${global.${setting.key}}`;
                          navigator.clipboard
                            .writeText(textToCopy)
                            .then(() => {
                              toast.success(`Copied: ${textToCopy}`);
                              setShowGlobalModal(false); // Close the modal after copying
                            })
                            .catch(err => {
                              console.error('Failed to copy: ', err);
                              toast.error('Failed to copy to clipboard');
                            });
                        }}
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={() => setShowGlobalModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentFieldPicker;
