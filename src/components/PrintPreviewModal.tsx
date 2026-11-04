import React, { useState } from 'react';
import { X, Printer, FileText, Settings, Sliders } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { PageLayoutSettings, DocumentMetadata } from '../types/document';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  layoutSettings: PageLayoutSettings;
  onUpdateLayout: (settings: Partial<PageLayoutSettings>) => void;
  documentMeta: DocumentMetadata;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  editor,
  layoutSettings,
  onUpdateLayout,
  documentMeta,
}) => {
  const [copies, setCopies] = useState(1);
  const [pageRange, setPageRange] = useState<'all' | 'custom'>('all');
  const [customRange, setCustomRange] = useState('1');
  const [printMarkup, setPrintMarkup] = useState(false);

  if (!isOpen || !editor) return null;

  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none">
      <div className="bg-black border border-neutral-700 text-white rounded-lg shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <Printer className="w-5 h-5 text-white stroke-[2.2]" />
            <h3 className="font-bold text-sm">Print & PDF Preview — {documentMeta.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Content split: Left options panel, Right live A4 document sheet preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* Options Sidebar */}
          <div className="w-72 bg-neutral-950 border-r border-neutral-800 p-5 space-y-5 overflow-y-auto text-xs shrink-0">
            <div>
              <button
                type="button"
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black font-extrabold rounded hover:bg-neutral-200 transition-colors shadow-xs text-sm"
              >
                <Printer className="w-4 h-4 stroke-[2.4]" />
                <span>Print Document</span>
              </button>
            </div>

            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px] block">Print Settings</span>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Copies</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={copies}
                  onChange={(e) => setCopies(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Page Range</label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-300">
                    <input
                      type="radio"
                      name="range"
                      checked={pageRange === 'all'}
                      onChange={() => setPageRange('all')}
                      className="accent-white"
                    />
                    <span>All Pages</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-300">
                    <input
                      type="radio"
                      name="range"
                      checked={pageRange === 'custom'}
                      onChange={() => setPageRange('custom')}
                      className="accent-white"
                    />
                    <span>Specific Pages (e.g. 1-3)</span>
                  </label>
                  {pageRange === 'custom' && (
                    <input
                      type="text"
                      value={customRange}
                      onChange={(e) => setCustomRange(e.target.value)}
                      placeholder="e.g. 1-2"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white font-mono mt-1"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Orientation</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateLayout({ isLandscape: false })}
                    className={`py-1.5 rounded font-bold border transition-colors ${
                      !layoutSettings.isLandscape ? 'bg-white text-black border-white' : 'bg-neutral-900 text-white border-neutral-700'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateLayout({ isLandscape: true })}
                    className={`py-1.5 rounded font-bold border transition-colors ${
                      layoutSettings.isLandscape ? 'bg-white text-black border-white' : 'bg-neutral-900 text-white border-neutral-700'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Margins</label>
                <select
                  value={layoutSettings.marginPreset}
                  onChange={(e) => onUpdateLayout({ marginPreset: e.target.value as any })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
                >
                  <option value="normal">Normal (1.0 inch)</option>
                  <option value="narrow">Narrow (0.5 inch)</option>
                  <option value="moderate">Moderate (0.75 inch)</option>
                  <option value="wide">Wide (1.5 inch)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-neutral-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-300">
                  <input
                    type="checkbox"
                    checked={printMarkup}
                    onChange={(e) => setPrintMarkup(e.target.checked)}
                    className="accent-white"
                  />
                  <span>Print Comments & Revisions</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Live Document Preview */}
          <div className="flex-1 bg-neutral-900 p-8 overflow-y-auto flex justify-center items-start">
            <div
              className={`bg-white text-black p-8 shadow-2xl rounded-xs transition-all ${
                layoutSettings.isLandscape ? 'w-[750px] min-h-[500px]' : 'w-[520px] min-h-[720px]'
              }`}
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '11px',
                lineHeight: '1.5',
              }}
            >
              {layoutSettings.watermark && (
                <div className="text-center font-extrabold text-3xl text-neutral-300 tracking-widest uppercase my-4 select-none">
                  {layoutSettings.watermark}
                </div>
              )}
              <div
                className="preview-doc-content"
                dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
