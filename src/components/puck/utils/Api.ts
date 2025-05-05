import { PageStatus, PageTemplate } from "../types";
import { IEndpoint, request } from "@/lib/api";

interface UpdateTemplateProps {
  id: number;
  updates: Partial<PageTemplate>;
}

const initialData = {
  root: {
    props: {
      title: "hello there",
    },
  },
  content: [
    {
      type: "Heading",
      props: {
        content: "Heading",
        align: null,
        color: null,
        backgroundColor: null,
        fontSize: "3.5rem",
        fontWeight: null,
        letterSpacing: null,
        lineHeight: null,
        textTransform: null,
        margin: null,
        padding: null,
        tailwindClass: "",
        id: "Heading-492fdc16-af6c-4682-8448-b7c04ee0e9fb",
      },
    },
    {
      type: "Text",
      props: {
        content: "New text block",
        align: null,
        color: null,
        backgroundColor: null,
        fontSize: null,
        fontWeight: null,
        letterSpacing: null,
        lineHeight: null,
        textTransform: null,
        margin: null,
        padding: null,
        tailwindClass: "",
        id: "Text-6f1e8579-cde7-4f60-8b74-25fb2999188a",
      },
    },
  ],
  zones: {},
};

// Define endpoints using IEndpoint interface
const Endpoint = {
  getAllTemplates: (): IEndpoint<void, { data: PageTemplate[] }, PageTemplate[]> => ({
    url: "/workflow/page-templates",
  }),
  getTemplateById: (id: string): IEndpoint<void, { data: PageTemplate }, PageTemplate> => ({
    url: `/workflow/page-templates/get/${id}`,
  }),
  createTemplate: (): IEndpoint<PageTemplate, { data: PageTemplate }, PageTemplate> => ({
    url: `/workflow/page-templates`,
    method: "post",
  }),
  updateTemplate: (id: number): IEndpoint<Partial<PageTemplate>, { data: PageTemplate }, PageTemplate> => ({
    url: `/workflow/page-templates/${id}`,
    method: "put",
  }),
  deleteTemplate: (id: string): IEndpoint<void, void, void> => ({
    url: `/workflow/page-templates/${id}`,
    method: "delete",
  }),
};

export const pageTemplateApi = {
  // Get all page templates
  getAllTemplates: async (): Promise<PageTemplate[]> => {
    try {
      const endpoint = Endpoint.getAllTemplates();
      return await request<void, { data: PageTemplate[] }, PageTemplate[]>(endpoint) || [];
    } catch (error) {
      console.error("Error fetching templates:", error);
      throw error;
    }
  },

  // Get a single template by ID
  getTemplateById: async (id: string): Promise<PageTemplate> => {
    try {
      const endpoint = Endpoint.getTemplateById(id);
      return await request<void, { data: PageTemplate }, PageTemplate>(endpoint);
    } catch (error) {
      console.error("Error fetching template:", error);
      throw error;
    }
  },

  // Create a new template
  createTemplate: async (
    pageName: string,
    pageSlug?: string
  ): Promise<{ code: number; success: boolean; data: PageTemplate; error?: string }> => {
    try {
      // Validate page name
      if (!pageName || pageName.trim() === '') {
        return { 
          code: 400, 
          success: false, 
          data: {} as PageTemplate, 
          error: "Web page name cannot be empty" 
        };
      }

      // Create slug from name if not provided
      const slug = pageSlug || pageName.toLowerCase().replace(/\s+/g, "-");
      
      // Validate slug
      if (!slug || slug.trim() === '') {
        return { 
          code: 400, 
          success: false, 
          data: {} as PageTemplate, 
          error: "Web page slug cannot be empty" 
        };
      }

      const pageData: PageTemplate = {
        name: pageName,
        key: slug,
        metadata: JSON.stringify(initialData),
        status: PageStatus.draft,
        is_active: true,
      };

      const endpoint = { ...Endpoint.createTemplate(), data: pageData };
      return await request<PageTemplate, { data: PageTemplate }, { code: number; success: boolean; data: PageTemplate }>(endpoint);
    } catch (error) {
      console.error("Error creating template:", error);
      throw error;
    }
  },
  
  // Create a new template with data
  createTemplateWithData: async ({
    data,
  }: {
    data: {
      name: string;
      key: string;
      status: PageStatus;
      metadata: string;
      is_active: boolean;
    };
  }): Promise<{
    code: number;
    status: boolean;
    data: PageTemplate;
  }> => {
    try {
      const pageData: PageTemplate = data;
      const endpoint = { ...Endpoint.createTemplate(), data: pageData };
      return await request<PageTemplate, { data: PageTemplate }, { code: number; status: boolean; data: PageTemplate }>(endpoint);
    } catch (error) {
      console.error("Error creating template:", error);
      throw error;
    }
  },

  // Update an existing template
  updateTemplate: async ({
    id,
    updates,
  }: UpdateTemplateProps): Promise<{ 
    code: number; 
    success: boolean; 
    data: PageTemplate; 
    error?: string 
  }> => {
    try {
      // Validate ID
      if (!id) {
        return { 
          code: 400, 
          success: false, 
          data: {} as PageTemplate, 
          error: "Web page ID cannot be empty" 
        };
      }

      // Validate name if provided
      if (updates.name !== undefined && (!updates.name || updates.name.trim() === '')) {
        return { 
          code: 400, 
          success: false, 
          data: {} as PageTemplate, 
          error: "Web page name cannot be empty" 
        };
      }

      // Validate slug/key if provided
      if (updates.key !== undefined && (!updates.key || updates.key.trim() === '')) {
        return { 
          code: 400, 
          success: false, 
          data: {} as PageTemplate, 
          error: "Web page slug cannot be empty" 
        };
      }
      
      const endpoint = { ...Endpoint.updateTemplate(id), data: updates };
      return await request<Partial<PageTemplate>, { data: PageTemplate }, { code: number; success: boolean; data: PageTemplate }>(endpoint);
    } catch (error) {
      console.error("Error updating template:", error);
      throw error;
    }
  },

  // Delete a template
  deleteTemplate: async (id: string): Promise<{ 
    code: number; 
    success: boolean; 
    error?: string 
  }> => {
    try {
      // Validate ID
      if (!id) {
        return { 
          code: 400, 
          success: false, 
          error: "Web page ID cannot be empty" 
        };
      }
      
      await request<void, void, void>(Endpoint.deleteTemplate(id));
      return { code: 200, success: true };
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
  },
};
