import React, { useState } from 'react';
import { TableData } from '../types';
import TableDataModal from './TableDataModal';

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
  label = 'Table Data',
  rows,
  columns,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <label className="block text-sm font-semibold  mb-2">{label}</label>
      <div className="space-y-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full px-4 py-2 bg-[#d6f9ff]  rounded-md border /20 
            hover:bg-[#005f73] hover:text-white hover: 
            transition-all duration-200 font-medium"
        >
          Configure Table Data
        </button>
        {value && (
          <div className="p-2 bg-[#d6f9ff]/20 border /20 rounded-md">
            <div className="text-sm  flex-wrap break-words whitespace-pre-wrap">
              <span className="font-medium">Source:</span> {value.dataSource}
              {value.dataSource === 'api' && (
                <span className="block mt-1 /80">API: {value.apiEndpoint}</span>
              )}
            </div>
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
