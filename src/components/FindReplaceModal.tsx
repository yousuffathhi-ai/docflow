import React, { useState } from 'react';
import { X, Search, Replace, Check } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface FindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  isOpen,
  onClose,
  editor,
}) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);

  if (!isOpen || !editor) return null;

  const countMatches = () => {
    if (!findText) {
      setMatchCount(0);
      return;
    }
    const text = editor.getText();
    const flags = matchCase ? 'g' : 'gi';
    const pattern = wholeWord ? `\\b${findText}\\b` : findText;
    try {
      const regex = new RegExp(pattern, flags);
      const matches = text.match(regex);
      setMatchCount(matches ? matches.length : 0);
    } catch {
      setMatchCount(0);
    }
  };

  const handleReplace = () => {
    if (!findText) return;
    const html = editor.getHTML();
    const flags = matchCase ? '' : 'i';
    const pattern = wholeWord ? `\\b${findText}\\b` : findText;
    try {
      const regex = new RegExp(pattern, flags);
      const updated = html.replace(regex, replaceText);
      editor.commands.setContent(updated);
      countMatches();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    const html = editor.getHTML();
    const flags = matchCase ? 'g' : 'gi';
    const pattern = wholeWord ? `\\b${findText}\\b` : findText;
    try {
      const regex = new RegExp(pattern, flags);
      const updated = html.replace(regex, replaceText);
      editor.commands.setContent(updated);
      setMatchCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-black border border-neutral-700 text-white rounded-lg shadow-2xl max-w-md w-full p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-white stroke-[2.2]" />
            <h3 className="font-bold text-sm">Find & Replace</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-neutral-300 font-bold block mb-1">Find Text</label>
            <input
              type="text"
              placeholder="Word or phrase to find..."
              value={findText}
              onChange={(e) => {
                setFindText(e.target.value);
                setMatchCount(null);
              }}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white font-medium focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-bold block mb-1">Replace With</label>
            <input
              type="text"
              placeholder="Replacement text..."
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white font-medium focus:outline-none focus:border-white"
            />
          </div>

          {/* Options */}
          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-neutral-300">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
                className="rounded bg-neutral-900 border-neutral-700 text-white accent-white"
              />
              <span>Match case</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-neutral-300">
              <input
                type="checkbox"
                checked={wholeWord}
                onChange={(e) => setWholeWord(e.target.checked)}
                className="rounded bg-neutral-900 border-neutral-700 text-white accent-white"
              />
              <span>Whole word only</span>
            </label>
          </div>

          {matchCount !== null && (
            <div className="text-[11px] text-neutral-400 font-mono pt-1">
              {matchCount} match{matchCount === 1 ? '' : 'es'} found in document.
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
          <button
            type="button"
            onClick={countMatches}
            className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded border border-neutral-700"
          >
            Count Matches
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReplace}
              className="px-3 py-1.5 text-xs font-bold bg-neutral-900 hover:bg-white hover:text-black border border-neutral-700 rounded transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleReplaceAll}
              className="px-4 py-1.5 text-xs font-bold bg-white text-black hover:bg-neutral-200 rounded transition-colors shadow-xs"
            >
              Replace All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
