import React, { useState } from "react";

interface FieldProps {
  name?: string;
  [key: string]: unknown;
}
const FieldsComponent = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState("styles");

  // Filter children based on whether they're content-related
  const styleChildren: React.ReactNode[] = [];
  const dataChildren: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement<FieldProps>(child) &&
      child.props.name === "content"
    ) {
      dataChildren.push(child);
    } else {
      styleChildren.push(child);
    }
  });

  return (
    <div className="bg-red-100">
      <div className="flex mb-4 p-2   bg-gray-400 rounded-t-lg w-full">
        <button
          className={`px-4 py-2 mr-2 w-[50%] ${
            activeTab === "styles"
              ? "bg-white text-blue-600 rounded-t-lg"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("styles")}
        >
          Styles
        </button>
        <button
          className={`px-4 py-2 w-[50%] ${
            activeTab === "data"
              ? "bg-white text-blue-600 rounded-t-lg"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("data")}
        >
          Data
        </button>
      </div>

      <div className="p-4 rounded-b-lg ">
        {activeTab === "styles" ? (
          <div>
            <h3 className="text-lg font-semibold mb-4 w-auto">Styles</h3>
            {styleChildren}
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4 w-ful">Data</h3>
            {dataChildren}
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldsComponent;
