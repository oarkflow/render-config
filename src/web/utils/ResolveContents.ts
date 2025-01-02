import { generateCacheKey, getCache, setCache } from "./Cache";

interface ApiData {
  type: string;
  url: string;
  method: string;
  [key: string]: string | Record<string, string> | number;
}

const getValueFromPath = (obj: unknown, path: string) => {
  const parts = path.split(".");
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
};

export const GetValue = async (
  content: ApiData
): Promise<string | Record<string, string>> => {
  if (content.type === "restAPI") {
    const { method, url, body, headers } = content;
    if (!url || !method) return "";

    const cacheKey = generateCacheKey(url, method, body);
    const cachedResponse = getCache(cacheKey);
    if (cachedResponse) {
      console.log("Cache hit", cacheKey);
      return cachedResponse as string;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(typeof headers === "object" && headers !== null ? headers : {}),
        },
        body: method !== "GET" && body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return `Error: ${response.status} - ${response.statusText}`;
      }

      const data = await response.json();
      setCache(cacheKey, data, 3600); // Cache for 1 hour
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return `Fetch error: ${error}`;
    }
  }

  if (content.type === "text") {
    return String(content?.value || "");
  }

  return "api not supported yet";
};

const UpdateContent = async (contentToResolve: string, noString = false) => {
  let result = contentToResolve;
  const templateRegex = /{{([^}]+)}}/g;
  const templates = contentToResolve.match(templateRegex);
  
  if (!templates) return result;
  console.log("here")

  const apiData = localStorage.getItem("apisDatas");
  if (!apiData) return contentToResolve;

  const parsedApiData = JSON.parse(apiData);

  for (const template of templates) {
    console.log("found template", template);
    const [apiName, ...pathParts] = template.slice(2, -2).split(".");
    const fieldPath = pathParts.join(".");
    console.log(apiName.trim(), fieldPath, " apiName, fieldPath");
    if (apiName === "global") {
      const data = JSON.parse(parsedApiData.globalConstants);
      console.log("here", data[fieldPath]);
      result = result.replace(template, data[fieldPath]);
      console.log("replaced", result);
      continue;
    }

    if (parsedApiData[apiName]) {
      try {
        console.log("calling GetValue");
        console.log(JSON.parse(parsedApiData[apiName]));
        const apiContent = await GetValue(JSON.parse(parsedApiData[apiName]));
        console.log(typeof apiContent, "is the type");
        if (typeof apiContent === "object" && apiContent !== null) {
          const fieldValue = getValueFromPath(apiContent, fieldPath);
          console.log(
            fieldValue,
            fieldPath,
            "is the main data that needs to return"
          );
          if (fieldValue !== undefined) {
            if (noString) return fieldValue;
            result = result.replace(template, String(fieldValue));
          }
        } else {
          result = result.replace(template, String(apiContent));
        }
      } catch (error) {
        console.error(`Error processing template ${template}:`, error);
      }
    }
  }

  return result;
};

export default UpdateContent;
