# React Website Builder Extension for Puck Editor

A powerful React library that extends the Puck editor functionality to build and render websites with ease. This library provides two main components: `WebBuilder` and `WebRenderer` that work together to create a seamless website building experience.

## Installation

```bash
npm install @oarkflow/render-config
```

## Key Components

## Key Components

### WebBuilder

The WebBuilder component provides a drag-and-drop interface for building websites. It extends Puck editor's functionality with additional features for website construction.

#### Props Interface

```typescript
interface WebBuilderProps {
  // Optional unique identifier for the node
  nodeId?: string;

  // Initial data configuration
  initialData?: {
    content: Array<{
      type: string;
      props: Record<string, unknown>;
    }>;
    root: {
      title: string;
    };
  };

  // Viewport configurations for responsive design
  viewports?: Array<{
    width: number;
    height: number | "auto";
    label: string;
    icon: JSX.Element;
  }>;

  // Array of plugins to extend functionality
  plugin?: Plugin[];

  // Callback function when publishing changes
  onPublish?: (data: unknown) => void;
}
```

### WebRenderer

The WebRenderer component is responsible for rendering the website based on the configuration created using WebBuilder.

#### Props Interface

```typescript
interface WebRendererProps {
  // Optional unique identifier for the node
  nodeId?: string;

  // Initial data configuration
  initialData?: {
    content: Array<{
      type: string;
      props: Record<string, unknown>;
    }>;
    root: {
      title: string;
    };
  };
}
```

## Usage

```jsx
import { WebBuilder, WebRenderer } from "@oarkflow/render-config";

// In your builder component
const BuilderComponent = () => {
  const handleSave = (config) => {
    // Handle saving the website configuration
    console.log("Website config:", config);
  };

  return (
    <WebBuilder
      onSave={handleSave}
      // Add your custom components and configurations
      components={{
        Hero: {
          // Your hero component configuration
        },
        // Add more components as needed
      }}
    />
  );
};

// In your viewer/renderer component
const ViewerComponent = () => {
  const config = {
    // Your website configuration
  };

  return (
    <WebRenderer
      config={config}
      // Additional props as needed
    />
  );
};
```

## Features

- Drag-and-drop website building interface
- Component-based architecture
- Real-time preview
- Customizable components
- Responsive design support
- Easy integration with existing React applications

## Contributing

If you want to contribute to this plugin, follow these steps:

0. Create a branch related to code change

   ```bash
   git checkout -b feature/your-feature-name
   ```

1. Update the code
   Make your changes and ensure they follow the project's coding standards

2. Commit and push the changes to GitHub

   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   git push origin feature/your-feature-name
   ```

3. Update the package on npm

   ```bash
   npm login
   npm version patch
   npm publish
   ```

4. Enjoy using the latest version in your projects!

## Version Bumping

When committing changes, use the following commit message conventions to automatically bump the package version:

- For minor version bump (e.g., 1.1.0 -> 1.2.0):

  ```
  feat: your message here
  ```

- For patch version bump (e.g., 1.1.0 -> 1.1.1):

  ```
  fix: your message here
  ```

Any other commit message format will result in a patch version bump by default.

The version bump occurs automatically when changes are pushed to the main branch through our GitHub Actions workflow.

## Example Use Case

Here's a complete example of how to use the library in a React application:

```jsx
import React, { useState } from "react";
import { WebBuilder, WebRenderer } from "@oarkflow/render-config";

// Define your custom components
const customComponents = {
  Hero: {
    render: ({ title, subtitle }) => (
      <div className="hero">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    ),
    defaultProps: {
      title: "Welcome",
      subtitle: "Start building your website",
    },
  },
  // Add more components as needed
};

// Builder Page Component
const BuilderPage = () => {
  const [config, setConfig] = useState(null);

  const handleSave = (newConfig) => {
    setConfig(newConfig);
    // Save to your backend or localStorage
  };
  const plugin = {
    /* puck editor plugins get more details from puck editor 
      documentation [here](https://puckeditor.com/docs/extending-puck/plugins) */
  };
  const viewports = [
    {
      width: number,
      height: number | "auto",
      label: "string",
      icon: "icon react Node",
    },
  ];

  return (
    <WebBuilder
      components={customComponents}
      onPublish={handleSave}
      initialConfig={config}
      plugin={plugin}
      viewports={viewports}
    />
  );
};

// Viewer Page Component
const ViewerPage = ({ config }) => {
  return <WebRenderer config={config} components={customComponents} />;
};

export { BuilderPage, ViewerPage };
```

## Support

For issues and feature requests, please create an issue on our [Github](https://github.com/oarkflow/render-config) repository.
