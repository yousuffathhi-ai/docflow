import React, { useState } from 'react';
import { X, BookMarked, Plus, Trash2, Library, Quote } from 'lucide-react';
import { CitationItem } from '../types/document';
import { Editor } from '@tiptap/react';

interface CitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  citations: CitationItem[];
  onUpdateCitations: (citations: CitationItem[]) => void;
}

const DEFAULT_CITATIONS: CitationItem[] = [
  {
    id: '1',
    type: 'book',
    title: 'Literate Programming',
    author: 'Donald E. Knuth',
    year: '1984',
    publisher: 'Center for the Study of Language and Information',
  },
  {
    id: '2',
    type: 'article',
    title: 'The Part-Time Parliament',
    author: 'Leslie Lamport',
    year: '1998',
    journal: 'ACM Transactions on Computer Systems',
  },
  {
    id: '3',
    type: 'website',
    title: 'Uniform Resource Locators (URL)',
    author: 'Tim Berners-Lee',
    year: '1994',
    url: 'https://www.ietf.org/rfc/rfc1738.txt',
  },
];

export const CitationsModal: React.FC<CitationsModalProps> = ({
  isOpen,
  onClose,
  editor,
  citations,
  onUpdateCitations,
}) => {
  const [style, setStyle] = useState<'APA' | 'MLA' | 'Chicago' | 'IEEE'>('APA');
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newPublisher, setNewPublisher] = useState('');
  const [newType, setNewType] = useState<'book' | 'article' | 'website'>('book');

  if (!isOpen || !editor) return null;

  const currentList = citations.length > 0 ? citations : DEFAULT_CITATIONS;

  const handleAddCitation = () => {
    if (!newTitle.trim() || !newAuthor.trim()) return;
    const item: CitationItem = {
      id: Date.now().toString(),
      type: newType,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      year: newYear.trim() || '2026',
      publisher: newPublisher.trim(),
    };
    onUpdateCitations([...currentList, item]);
    setNewTitle('');
    setNewAuthor('');
    setNewYear('');
    setNewPublisher('');
  };

  const handleDelete = (id: string) => {
    onUpdateCitations(currentList.filter((c) => c.id !== id));
  };

  const handleInsertInText = (c: CitationItem, index: number) => {
    const lastName = c.author.split(' ').pop() || c.author;
    let snippet = '';
    if (style === 'APA' || style === 'Chicago') {
      snippet = `(${lastName}, ${c.year})`;
    } else if (style === 'MLA') {
      snippet = `(${lastName})`;
    } else {
      snippet = `[${index + 1}]`;
    }
    editor.chain().focus().insertContent(` ${snippet} `).run();
  };

  const handleInsertBibliography = () => {
    let heading = 'References';
    if (style === 'MLA') heading = 'Works Cited';
    if (style === 'Chicago') heading = 'Bibliography';

    let listHtml = `<h2>${heading}</h2><ol>`;
    currentList.forEach((c) => {
      if (style === 'APA') {
        listHtml += `<li>${c.author} (${c.year}). <em>${c.title}</em>. ${c.publisher || c.journal || ''}</li>`;
      } else if (style === 'MLA') {
        listHtml += `<li>${c.author}. <em>${c.title}</em>. ${c.publisher || c.journal || ''}, ${c.year}.</li>`;
      } else if (style === 'IEEE') {
        listHtml += `<li>${c.author}, "${c.title}," ${c.journal || c.publisher || ''}, ${c.year}.</li>`;
      } else {
        listHtml += `<li>${c.author}. ${c.year}. <em>${c.title}</em>. ${c.publisher || c.journal || ''}.</li>`;
      }
    });
    listHtml += `</ol><p></p>`;

    editor.chain().focus().insertContent(listHtml).run();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-black border border-neutral-700 text-white rounded-lg shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <BookMarked className="w-5 h-5 text-white stroke-[2.2]" />
            <div>
              <h3 className="font-bold text-base">Citations & Bibliography Manager</h3>
              <p className="text-xs text-neutral-400">
                Format scholarly citations and insert formatted reference lists.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Style Selector */}
        <div className="flex items-center justify-between bg-neutral-950 p-2 rounded border border-neutral-800 text-xs font-bold">
          <span className="text-neutral-400">Citation Standard Style:</span>
          <div className="flex gap-1.5">
            {(['APA', 'MLA', 'Chicago', 'IEEE'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={`px-3 py-1 rounded transition-colors ${
                  style === s ? 'bg-white text-black shadow-xs font-extrabold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-2 text-xs space-y-4">
          {/* Add Source Form */}
          <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded space-y-2.5">
            <span className="font-bold text-white text-xs block">Add Bibliographic Source</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Author (e.g. John Smith)"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
              />
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
              />
              <input
                type="text"
                placeholder="Year (e.g. 2026)"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
              />
              <input
                type="text"
                placeholder="Publisher or Journal"
                value={newPublisher}
                onChange={(e) => setNewPublisher(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddCitation}
                className="px-3.5 py-1.5 bg-white text-black font-bold rounded hover:bg-neutral-200"
              >
                + Add Citation
              </button>
            </div>
          </div>

          {/* Source List */}
          <div className="space-y-2">
            <span className="font-bold text-neutral-400 text-xs block">Document Sources ({currentList.length}):</span>
            <div className="space-y-2">
              {currentList.map((c, idx) => (
                <div
                  key={c.id}
                  className="p-3 bg-neutral-950 border border-neutral-800 rounded flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white text-xs">
                      {c.author} ({c.year}). <em>{c.title}</em>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {c.publisher || c.journal || 'Independent'} · [{c.type}]
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleInsertInText(c, idx)}
                      className="px-2.5 py-1 bg-neutral-900 hover:bg-white hover:text-black border border-neutral-700 font-bold rounded text-xs transition-colors"
                      title="Insert inline parenthetical citation"
                    >
                      Insert In-Text
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="text-neutral-500 hover:text-white p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleInsertBibliography}
            className="px-4 py-2 text-xs font-bold bg-white text-black rounded hover:bg-neutral-200 shadow-xs"
          >
            Insert Full {style} Bibliography to Document ➔
          </button>
        </div>
      </div>
    </div>
  );
};
