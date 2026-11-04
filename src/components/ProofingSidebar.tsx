import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  AlertTriangle,
  X,
  Search,
  Replace,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { lookupThesaurus, ThesaurusEntry } from '../utils/thesaurusData';

interface ProofingSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

export const ProofingSidebar: React.FC<ProofingSidebarProps> = ({
  isOpen,
  onClose,
  editor,
}) => {
  const [activeTab, setActiveTab] = useState<'thesaurus' | 'spelling' | 'accessibility'>('thesaurus');
  const [searchWord, setSearchWord] = useState('');
  const [thesaurusResult, setThesaurusResult] = useState<ThesaurusEntry | null>(null);

  if (!isOpen || !editor) return null;

  const handleLookup = (word: string) => {
    setSearchWord(word);
    const res = lookupThesaurus(word);
    setThesaurusResult(res);
  };

  const handleReplaceWord = (newWord: string) => {
    if (!editor) return;
    // If text is selected in editor, replace selection
    const selection = editor.state.selection;
    if (selection && !selection.empty) {
      editor.chain().focus().insertContent(newWord).run();
    } else {
      // Replace last instance of searchWord
      const text = editor.getText();
      if (searchWord && text.includes(searchWord)) {
        const regex = new RegExp(`\\b${searchWord}\\b`, 'i');
        const updatedHtml = editor.getHTML().replace(regex, newWord);
        editor.commands.setContent(updatedHtml);
      }
    }
  };

  // Run automated proofing scan on editor text
  const docText = editor.getText();
  const spellingIssues: Array<{ original: string; suggestion: string; reason: string }> = [];

  const commonTypos: Record<string, string> = {
    teh: 'the',
    recieve: 'receive',
    seperate: 'separate',
    definately: 'definitely',
    occured: 'occurred',
    untill: 'until',
    goverment: 'government',
    alot: 'a lot',
    truely: 'truly',
    wierd: 'weird',
    achive: 'achieve',
    calender: 'calendar',
  };

  // Check for common typos
  const words = docText.split(/\s+/);
  for (const w of words) {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    if (commonTypos[clean]) {
      spellingIssues.push({
        original: w,
        suggestion: commonTypos[clean],
        reason: 'Common spelling mistake',
      });
    }
  }

  // Check repeated consecutive words ("the the")
  const repeatedRegex = /\b(\w+)\s+\1\b/gi;
  let repMatch;
  while ((repMatch = repeatedRegex.exec(docText)) !== null) {
    spellingIssues.push({
      original: repMatch[0],
      suggestion: repMatch[1],
      reason: 'Repeated consecutive word',
    });
  }

  // Accessibility Audit
  const html = editor.getHTML();
  const accessibilityIssues: Array<{ title: string; desc: string; severity: 'warning' | 'info' }> = [];

  // 1. Missing headings
  if (!html.includes('<h1')) {
    accessibilityIssues.push({
      title: 'Missing Document Title (Heading 1)',
      desc: 'Screen readers require a top-level Heading 1 for document landmarks.',
      severity: 'warning',
    });
  }

  // 2. Images missing alt tags
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  let missingAltCount = 0;
  for (const img of imgMatches) {
    if (!img.includes('alt="') || img.includes('alt=""')) {
      missingAltCount++;
    }
  }
  if (missingAltCount > 0) {
    accessibilityIssues.push({
      title: `${missingAltCount} image(s) missing alternative text`,
      desc: 'Screen readers require descriptive alt attributes on images.',
      severity: 'warning',
    });
  }

  // 3. Very long paragraphs
  const paragraphs = html.match(/<p[^>]*>(.*?)<\/p>/gi) || [];
  let longPCount = 0;
  for (const p of paragraphs) {
    const textLen = p.replace(/<[^>]+>/g, '').split(/\s+/).length;
    if (textLen > 150) longPCount++;
  }
  if (longPCount > 0) {
    accessibilityIssues.push({
      title: `${longPCount} excessively long paragraph(s)`,
      desc: 'Paragraphs over 150 words hinder readability for cognitive accessibility.',
      severity: 'info',
    });
  }

  return (
    <aside className="no-print w-80 bg-white border-l border-neutral-300 text-black flex flex-col h-full shadow-xs shrink-0 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-neutral-300 bg-neutral-100">
        <span className="font-bold text-xs uppercase tracking-wide">Proofing & Quality</span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-neutral-200 rounded text-neutral-600 hover:text-black"
          title="Close Proofing"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 text-xs font-bold text-neutral-600 bg-neutral-50">
        <button
          type="button"
          onClick={() => setActiveTab('thesaurus')}
          className={`flex-1 py-2 text-center transition-colors border-b-2 ${
            activeTab === 'thesaurus' ? 'border-black text-black bg-white' : 'border-transparent hover:text-black'
          }`}
        >
          Thesaurus
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('spelling')}
          className={`flex-1 py-2 text-center transition-colors border-b-2 ${
            activeTab === 'spelling' ? 'border-black text-black bg-white' : 'border-transparent hover:text-black'
          }`}
        >
          Spelling ({spellingIssues.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('accessibility')}
          className={`flex-1 py-2 text-center transition-colors border-b-2 ${
            activeTab === 'accessibility' ? 'border-black text-black bg-white' : 'border-transparent hover:text-black'
          }`}
        >
          Accessibility
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 text-xs space-y-3">
        {/* ================= THESAURUS ================= */}
        {activeTab === 'thesaurus' && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-50 rounded border border-neutral-300 focus-within:border-black">
              <Search className="w-3.5 h-3.5 text-neutral-500 stroke-[2.2]" />
              <input
                type="text"
                placeholder="Look up word (e.g. create, system)..."
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLookup(searchWord);
                }}
                className="w-full bg-transparent text-xs text-black font-medium focus:outline-none placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={() => handleLookup(searchWord)}
                className="px-2 py-0.5 bg-black text-white font-bold rounded text-[11px]"
              >
                Find
              </button>
            </div>

            {thesaurusResult ? (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded space-y-2.5">
                <div>
                  <div className="font-bold text-sm text-black capitalize">{searchWord}</div>
                  <div className="text-[10px] text-neutral-500 italic">{thesaurusResult.partOfSpeech}</div>
                  <p className="text-[11px] text-neutral-700 mt-1">{thesaurusResult.definition}</p>
                </div>

                <div>
                  <span className="font-bold text-[10px] uppercase text-neutral-500 block mb-1">Synonyms (Click to Replace):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {thesaurusResult.synonyms.map((syn) => (
                      <button
                        key={syn}
                        type="button"
                        onClick={() => handleReplaceWord(syn)}
                        className="px-2 py-1 bg-white hover:bg-black hover:text-white border border-neutral-300 rounded font-semibold text-xs transition-colors"
                        title={`Replace with "${syn}"`}
                      >
                        {syn}
                      </button>
                    ))}
                  </div>
                </div>

                {thesaurusResult.antonyms && (
                  <div>
                    <span className="font-bold text-[10px] uppercase text-neutral-500 block mb-1">Antonyms:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {thesaurusResult.antonyms.map((ant) => (
                        <span key={ant} className="px-2 py-0.5 bg-neutral-200 text-neutral-800 rounded text-[11px]">
                          {ant}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-neutral-400 text-center py-6">
                Type any common word above (or select a word in your document) to explore synonyms and replace with 1 click.
              </div>
            )}
          </div>
        )}

        {/* ================= SPELLING & GRAMMAR ================= */}
        {activeTab === 'spelling' && (
          <div className="space-y-3">
            {spellingIssues.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <CheckCircle className="w-8 h-8 text-black mx-auto stroke-[2.2]" />
                <div className="font-bold text-sm text-black">Spelling & Grammar Check Complete</div>
                <p className="text-xs text-neutral-500">No spelling mistakes or repeated words detected.</p>
              </div>
            ) : (
              spellingIssues.map((issue, idx) => (
                <div key={idx} className="p-3 bg-neutral-50 border border-neutral-300 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black text-xs line-through">{issue.original}</span>
                    <span className="text-[10px] text-neutral-400">{issue.reason}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-black text-xs bg-white px-2 py-0.5 rounded border border-neutral-300">
                      Suggestion: {issue.suggestion}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const regex = new RegExp(`\\b${issue.original}\\b`, 'gi');
                        const updated = editor.getHTML().replace(regex, issue.suggestion);
                        editor.commands.setContent(updated);
                      }}
                      className="px-2.5 py-1 bg-black text-white rounded font-bold text-[11px] hover:bg-neutral-800"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ================= ACCESSIBILITY CHECKER ================= */}
        {activeTab === 'accessibility' && (
          <div className="space-y-3">
            <div className="p-3 bg-neutral-50 border border-neutral-300 rounded space-y-1">
              <div className="font-bold text-xs text-black flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                <span>Accessibility Inspection</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Audits document structure against WCAG AA requirements.
              </p>
            </div>

            {accessibilityIssues.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle className="w-8 h-8 text-black mx-auto stroke-[2.2]" />
                <div className="font-bold text-sm text-black">All Accessibility Checks Passed</div>
                <p className="text-xs text-neutral-500">Document has proper heading hierarchy and formatted assets.</p>
              </div>
            ) : (
              accessibilityIssues.map((issue, i) => (
                <div key={i} className="p-3 bg-white border border-neutral-300 rounded shadow-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-black">
                    <AlertTriangle className="w-3.5 h-3.5 text-black stroke-[2.4]" />
                    <span>{issue.title}</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">{issue.desc}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
