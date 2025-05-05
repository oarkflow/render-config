import {
    Type,
    Image,
    Layout,
    List,
    Box,
    Grid,
    FileText,
    Video,
    Link,
    Table, Code, BookText, Sheet, FileUser,
} from 'lucide-react';
  
  export const getComponentIcon = (componentType: string) => {
    const type = componentType.toLowerCase();
    switch (type) {
      case 'heading':
      case 'text':
        return <Type className="w-6 h-6 mr-2" />;
      case 'image':
        return <Image className="w-6 h-6 mr-2" />;
      case 'rich text':
        return <Code className="w-6 h-6 mr-2" />;
      case 'form':
        return <BookText className="w-6 h-6 mr-2" />;
      case 'container':
      case 'section':
        return <Layout className="w-6 h-6 mr-2" />;
      case 'ul':
        return <List className="w-6 h-6 mr-2" />;
      case 'ol':
        return <List className="w-6 h-6 mr-2" />;
      case 'box':
      case 'div':
        return <Box className="w-6 h-6 mr-2" />;
      case 'grid':
        return <Grid className="w-6 h-6 mr-2" />;
      case 'video':
        return <Video className="w-6 h-6 mr-2" />;
      case 'link':
        return <Link className="w-6 h-6 mr-2" />;
      case 'column':
        return <Table className="w-6 h-6 mr-2" />;
      case 'custom':
        return <FileUser className="w-6 h-6 mr-2" />;
      case 'table':
        return <Sheet className="w-6 h-6 mr-2" />;
      default:
        return <FileText className="w-6 h-6 mr-2" />;
    }
  };