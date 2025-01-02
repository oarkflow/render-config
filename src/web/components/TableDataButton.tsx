import React, { useState } from "react";
import { TableData } from "../types";
import TableDataModal from "./TableDataModal";

interface TableDataButtonProps {
  value: TableData | null;
  onChange: (value: TableData | null) => void;
  label?: string;
  rows: number;
  columns: number;
}

const TableDataButton: React.FC<TableDataButtonProps> = ({
  value,
  onChange,
  label = "Table Data",
  rows,
  columns,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Configure Table Data
        </button>
        {value && (
          <div className="text-sm text-gray-500  flex-wrap break-words whitespace-pre-wrap">
            Source: {value.dataSource}
            {value.dataSource === "api" && ` - ${value.apiEndpoint}`}
          </div>
        )}
      </div>
      <TableDataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onChange}
        initialData={value || undefined}
        rows={rows}
        columns={columns}
      />
    </div>
  );
};

export default TableDataButton;
