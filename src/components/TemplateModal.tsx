import React, { useState } from 'react';
import { X, LayoutTemplate, FileText, ArrowRight } from 'lucide-react';
import { DOCUMENT_TEMPLATES } from '../templates/documentTemplates';
import { DocumentTemplate } from '../types/document';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DocumentTemplate) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'General', 'Business', 'Personal'];

  const filteredTemplates =
    selectedCategory === 'All'
      ? DOCUMENT_TEMPLATES
      : DOCUMENT_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-black border border-neutral-700 text-white rounded-lg shadow-2xl max-w-2xl w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <LayoutTemplate className="w-5 h-5 text-white stroke-[2.2]" />
            <div>
              <h3 className="font-bold text-base text-white">Document Templates</h3>
              <p className="text-xs text-neutral-400">
                Select a formatted document structure to start drafting.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded border border-neutral-800 w-fit text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-white rounded-lg p-4 flex flex-col justify-between transition-all group cursor-pointer text-left shadow-xs"
              onClick={() => {
                onSelectTemplate(template);
                onClose();
              }}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-white group-hover:text-white transition-colors">
                    <FileText className="w-4.5 h-4.5 text-white shrink-0 stroke-[2.2]" />
                    <span>{template.name}</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {template.category}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-white font-bold">
                <span>Use this template</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white rounded hover:bg-neutral-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
