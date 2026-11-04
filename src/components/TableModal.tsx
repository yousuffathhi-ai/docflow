import React, { useState } from 'react';
import { X, Table as TableIcon } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

export const TableModal: React.FC<TableModalProps> = ({ isOpen, onClose, editor }) => {
  const [hoveredRows, setHoveredRows] = useState(3);
  const [hoveredCols, setHoveredCols] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);

  if (!isOpen || !editor) return null;

  const handleInsert = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow })
      .run();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-black border border-neutral-700 text-white rounded-lg shadow-2xl max-w-sm w-full p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-white stroke-[2.2]" />
            <h3 className="font-bold text-sm">Insert Table</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Visual Grid Picker */}
        <div>
          <div className="text-xs text-neutral-300 font-semibold mb-2 flex items-center justify-between">
            <span>Grid Dimension:</span>
            <span className="font-mono text-white font-bold">
              {hoveredCols} × {hoveredRows}
            </span>
          </div>

          <div
            className="grid grid-cols-6 gap-1 p-2 bg-neutral-900 rounded border border-neutral-700 w-fit mx-auto cursor-pointer"
            onMouseLeave={() => {
              setHoveredRows(3);
              setHoveredCols(3);
            }}
          >
            {Array.from({ length: 6 }).map((_, r) =>
              Array.from({ length: 6 }).map((_, c) => {
                const isSelected = r < hoveredRows && c < hoveredCols;
                return (
                  <div
                    key={`${r}-${c}`}
                    onMouseEnter={() => {
                      setHoveredRows(r + 1);
                      setHoveredCols(c + 1);
                    }}
                    onClick={() => handleInsert(r + 1, c + 1)}
                    className={`w-6 h-6 rounded-xs border transition-colors ${
                      isSelected
                        ? 'bg-white border-white shadow-xs'
                        : 'bg-neutral-800 border-neutral-600 hover:border-neutral-400'
                    }`}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Header Row Option */}
        <div className="flex items-center gap-2 text-xs text-neutral-300 pt-1">
          <input
            type="checkbox"
            id="withHeader"
            checked={withHeaderRow}
            onChange={(e) => setWithHeaderRow(e.target.checked)}
            className="rounded bg-neutral-900 border-neutral-700 text-black focus:ring-0 w-4 h-4 accent-white cursor-pointer"
          />
          <label htmlFor="withHeader" className="cursor-pointer font-medium">
            Include styled header row
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white rounded hover:bg-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleInsert(hoveredRows, hoveredCols)}
            className="px-4 py-1.5 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded transition-colors shadow-xs"
          >
            Insert {hoveredCols} × {hoveredRows} Table
          </button>
        </div>
      </div>
    </div>
  );
};
