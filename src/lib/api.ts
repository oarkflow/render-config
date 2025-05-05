import { API_BASE_URL } from "@/config/api";

/* eslint-disable no-unused-vars */
export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IEndpoint<TData = unknown, TResponse = unknown, TExtracted = unknown> {
    url: string;
    method?: HttpMethod;
    data?: TData;
    dataKey?: string;
    headers?: Record<string, string>;
}

interface ApiResponse<TResponse> {
    data: TResponse;
    success: boolean;
    message?: string;
    code: number;
}

function extractData<TExtracted>(obj: unknown, key?: string): TExtracted {
    key = key ?? "data";
    return key
        .split('.')
        .reduce((acc: unknown, part: string): unknown => {
            if (acc !== null && typeof acc === 'object' && part in acc) {
                return (acc as Record<string, unknown>)[part];
            }
            return undefined;
        }, obj) as TExtracted;
}

function hasError<T>(response: ApiResponse<T>): boolean {
    return !response.success || (response.code < 200 || response.code > 399);
}

export async function request<TData, TResponse, TExtracted>(
    endpoint: IEndpoint<TData, TResponse, TExtracted>
): Promise<TExtracted> {
    const { url, method, data, headers, dataKey } = endpoint;
    const httpMethod = method ?? "get"
    const options: RequestInit = {
        method: httpMethod.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
    };

    try {
        const response = await fetch(`${API_BASE_URL + url}`, options);
        const result: ApiResponse<TResponse> = await response.json();

        if (!response.ok || hasError(result)) {
            throw new Error(result.message || 'Request failed');
        }

        const extracted = extractData<TExtracted>(result, dataKey);
        return extracted;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
}

// File upload response interface
export interface FileUploadResponse {
  file_id: number;
  modified_at: string | null;
  file_name: string;
  title: string;
  mime_type: string;
  size: string;
  extension: string;
  url: string;
  row_count: number | null;
  status: string | null;
  is_active: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Upload a file to the server using multipart/form-data
 * @param file The file to upload
 * @param url The API endpoint URL
 * @param fieldName The field name to use in the form data
 * @returns The uploaded file details
 */
export async function uploadFile(
  file: File, 
  url: string = '/media/upload', 
  fieldName: string = 'file'
): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append(fieldName, file);
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      body: formData,
      // Don't manually set Content-Type as browser will set it with boundary
    });
    
    const result: ApiResponse<FileUploadResponse[]> = await response.json();
    
    if (!response.ok || hasError(result)) {
      throw new Error(result.message || 'File upload failed');
    }
    
    // The API returns an array of files, but we're uploading just one
    return result.data[0];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error uploading file');
  }
}
