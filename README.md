# React Website Builder Extension for Puck Editor

A powerful React library that extends the Puck editor functionality to build and render websites with ease. This library provides two main components: `WebBuilder` and `WebRenderer` that work together to create a seamless website building experience.

## Installation

```bash
npm install @oarkflow/render-config
```

## Key Components

### WebBuilder
The WebBuilder component provides a drag-and-drop interface for building websites. It extends Puck editor's functionality with additional features for website construction.

### WebRenderer
The WebRenderer component is responsible for rendering the website based on the configuration created using WebBuilder.

## Usage

```jsx
import { WebBuilder, WebRenderer } from '@oarkflow/render-config';

// In your builder component
const BuilderComponent = () => {
  const handleSave = (config) => {
    // Handle saving the website configuration
    console.log('Website config:', config);
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

## Example Use Case

Here's a complete example of how to use the library in a React application:

```jsx
import React, { useState } from 'react';
import { WebBuilder, WebRenderer } from '@oarkflow/render-config';

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
      title: 'Welcome',
      subtitle: 'Start building your website'
    }
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

  return (
    <WebBuilder
      components={customComponents}
      onSave={handleSave}
      initialConfig={config}
    />
  );
};

// Viewer Page Component
const ViewerPage = ({ config }) => {
  return (
    <WebRenderer
      config={config}
      components={customComponents}
    />
  );
};

export { BuilderPage, ViewerPage };
```

## License

MIT

## Support

For issues and feature requests, please create an issue on our GitHub repository.
