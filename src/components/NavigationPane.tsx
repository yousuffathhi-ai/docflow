import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  ListTree,
  FileText,
  Search,
  X,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface NavigationPaneProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  onSearchQuery?: (q: string) => void;
}

export const NavigationPane: React.FC<NavigationPaneProps> = ({
  isOpen,
  onClose,
  editor,
  onSearchQuery,
}) => {
  const [activeTab, setActiveTab] = useState<'headings' | 'pages' | 'results'>('headings');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen || !editor) return null;

  // Extract headings from editor HTML
  const html = editor.getHTML();
  const headingMatches: Array<{ level: number; text: string; id: string }> = [];
  const regex = /<h([1-3])[^>]*>(.*?)<\/h[1-3]>/gi;
  let match;
  let index = 0;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if (text) {
      headingMatches.push({ level, text, id: `heading-${index++}` });
    }
  }

  // Handle click on a heading to scroll to it
  const handleHeadingClick = (text: string) => {
    // Search for element with this text in editor
    const editorDom = document.querySelector('.ProseMirror');
    if (!editorDom) return;
    const elements = editorDom.querySelectorAll('h1, h2, h3');
    for (const el of Array.from(elements)) {
      if (el.textContent?.trim() === text) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (el as HTMLElement).style.outline = '2px solid black';
        setTimeout(() => {
          (el as HTMLElement).style.outline = 'none';
        }, 1500);
        break;
      }
    }
  };

  // Search occurrences
  const plainText = editor.getText();
  const searchResults: string[] = [];
  if (searchQuery.trim().length > 1) {
    const words = plainText.split('\n').filter(Boolean);
    for (const paragraph of words) {
      if (paragraph.toLowerCase().includes(searchQuery.toLowerCase())) {
        searchResults.push(paragraph.trim());
      }
    }
  }

  return (
    <aside className="no-print w-72 bg-white border-r border-neutral-300 text-black flex flex-col h-full shadow-xs shrink-0 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-neutral-300 bg-neutral-100">
        <span className="font-bold text-xs uppercase tracking-wide">Navigation Pane</span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-neutral-200 rounded text-neutral-600 hover:text-black"
          title="Close Navigation"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-2.5 border-b border-neutral-200 bg-white">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-50 rounded border border-neutral-300 focus-within:border-black">
          <Search className="w-3.5 h-3.5 text-neutral-500 stroke-[2.2]" />
          <input
            type="text"
            placeholder="Search document..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim()) setActiveTab('results');
            }}
            className="w-full bg-transparent text-xs text-black font-medium focus:outline-none placeholder:text-neutral-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-neutral-400 hover:text-black text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 text-xs font-bold text-neutral-600 bg-neutral-50">
        <button
          type="button"
          onClick={() => setActiveTab('headings')}
          className={`flex-1 py-1.5 text-center transition-colors border-b-2 ${
            activeTab === 'headings' ? 'border-black text-black bg-white' : 'border-transparent hover:text-black'
          }`}
        >
          Headings ({headingMatches.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pages')}
          className={`flex-1 py-1.5 text-center transition-colors border-b-2 ${
            activeTab === 'pages' ? 'border-black text-black bg-white' : 'border-transparent hover:text-black'
          }`}
        >
          Pages
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-1.5 text-center transition-colors border-b-2 ${
            activeTab === 'results' ? 'border-black text-black bg-white' : 'border-transparent hover:text-black'
          }`}
        >
          Results ({searchResults.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-2 text-xs space-y-1">
        {activeTab === 'headings' && (
          <>
            {headingMatches.length === 0 ? (
              <div className="text-neutral-400 text-center py-6 px-4">
                No headings found in this document. Add Heading 1, 2, or 3 styles to populate outline.
              </div>
            ) : (
              headingMatches.map((h, i) => (
                <div
                  key={i}
                  onClick={() => handleHeadingClick(h.text)}
                  className={`cursor-pointer px-2 py-1.5 rounded hover:bg-neutral-100 flex items-center gap-1.5 transition-colors ${
                    h.level === 1 ? 'font-bold text-black' : h.level === 2 ? 'pl-4 font-semibold text-neutral-800' : 'pl-6 text-neutral-600'
                  }`}
                >
                  <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0 stroke-[2.2]" />
                  <span className="truncate">{h.text}</span>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'pages' && (
          <div className="space-y-3 p-2">
            <div
              onClick={() => {
                const editorDom = document.querySelector('.ProseMirror');
                editorDom?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-3 border border-neutral-300 rounded bg-neutral-50 hover:border-black cursor-pointer shadow-xs text-center space-y-1.5"
            >
              <div className="w-16 h-20 bg-white border border-neutral-300 mx-auto shadow-inner flex items-center justify-center text-[10px] text-neutral-400">
                A4
              </div>
              <div className="font-bold text-[11px] text-black">Page 1</div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-1.5">
            {searchResults.length === 0 ? (
              <div className="text-neutral-400 text-center py-6 px-4">
                {searchQuery ? 'No matching text found.' : 'Enter a query above to search.'}
              </div>
            ) : (
              searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => handleHeadingClick(res.slice(0, 30))}
                  className="p-2 rounded bg-neutral-50 border border-neutral-200 hover:border-black cursor-pointer transition-colors"
                >
                  <p className="line-clamp-2 text-[11px] text-neutral-700 font-medium">"{res}"</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
