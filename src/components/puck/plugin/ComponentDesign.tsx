import { ChevronRight } from "lucide-react";

import { ReactNode } from "react";

const Components = ({ children }: { children: ReactNode }) => {

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Render groups */}
      {Array.isArray(children) &&
        children.map((group) => (
          <div
            key={group.key}
            className="space-y-4"
          >
            {/* Group title */}
            <div className="text-sm font-semibold text-gray-600">
              {group.props.title}
            </div>

            {/* Items in grid with drag-and-drop */}
            <div className="grid grid-cols-3 gap-3">
              {group.props.children.map((item: { key: React.Key; props?: {label:string}; }) => (
                <div
                  key={item.key}
                  draggable
                  className="flex items-center justify-between px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm cursor-pointer"
                  // {...item.props}
                >
                  <span className="text-sm font-medium text-gray-700">
                    {item?.props?.label }
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Components;
