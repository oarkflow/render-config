import { AppWindowMac, Clock, FileStack, Server, Zap } from "lucide-react";

export interface ServiceConfig {
  serviceName: string;
  displayName?: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const services: ServiceConfig[] = [
  {
    serviceName: "etl",
    displayName: "ETL",
    description: "Extract, transform and load data",
    icon: <FileStack className="h-4 w-4" />,
    color: "#10b981",
    bgColor: "#d1fae5",
  },
  {
    serviceName: "background",
    description: "Run tasks in the background",
    icon: <Server className="h-4 w-4" />,
    color: "#6366f1",
    bgColor: "#e0e7ff",
  },
  {
    serviceName: "scheduler",
    description: "Schedule tasks to run at specific times",
    icon: <Clock className="h-4 w-4" />,
    color: "#f59e0b",
    bgColor: "#fef3c7",
  },
  {
    serviceName: "page",
    description: "Create interactive UI pages",
    icon: <AppWindowMac className="h-4 w-4" />,
    color: "#ec4899",
    bgColor: "#fbcfe8",
  },
  {
    serviceName: "api",
    description: "Build REST API endpoints",
    icon: <Zap className="h-4 w-4" />,
    color: "#3b82f6",
    bgColor: "#dbeafe",
  },
];

export default services;
