/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetValue } from "../utils/ResolveContents";

interface ApiResponse {
  data: any[];
  fields: string[];
  error?: string;
}

export const getAllFields = (obj: any, prefix = ""): string[] => {
  let fields: string[] = [];

  if (Array.isArray(obj)) {
    // If it's an array of objects, get fields from the first object
    if (obj.length > 0 && typeof obj[0] === "object") {
      fields = getAllFields(obj[0], prefix);
    }
    return fields;
  }

  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      const value = obj[key];
      const currentPath = prefix ? `${prefix}.${key}` : key;

      // Always add the current path
      fields.push(currentPath);

      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === "object") {
          // For array of objects, get fields from first object
          fields = [...fields, ...getAllFields(value[0], `${currentPath}.0`)];
        }
      } else if (typeof value === "object" && value !== null) {
        // For nested objects
        fields = [...fields, ...getAllFields(value, currentPath)];
      }
    }
  }

  return fields;
};

export const getFieldType = (value: any): "array" | "object" | "value" => {
  if (Array.isArray(value)) return "array";
  if (value !== null && typeof value === "object") return "object";
  return "value";
};

export const processApiResponse = (response: any): ApiResponse => {
  if (typeof response === "string") {
    return {
      data: [],
      fields: [],
      error: `API not supported yet: ${response}`,
    };
  }

  try {
    // Get all available fields from the response
    const fields = getAllFields(response);

    return {
      data: response,
      fields: fields,
    };
  } catch (error) {
    return {
      data: [],
      fields: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to process API response",
    };
  }
};

export const loadApiData = async (apiConfig: any): Promise<ApiResponse> => {
  try {
    if (!apiConfig || !apiConfig.type || !apiConfig.url) {
      throw new Error("Invalid API configuration");
    }

    if (apiConfig.type !== "rest") {
      throw new Error("Only REST API is supported");
    }

    const response = await GetValue(apiConfig);
    return processApiResponse(response);
  } catch (error) {
    return {
      data: [],
      fields: [],
      error:
        error instanceof Error ? error.message : "Failed to fetch API data",
    };
  }
};
