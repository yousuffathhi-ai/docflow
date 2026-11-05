import React from 'react';
import { X, BookOpen, Clock, FileText, AlignLeft, Layers, Copy, Check } from 'lucide-react';
import { DocumentStats, SectionWordCount } from '../types/document';
import { calculateSectionStats } from '../utils/textStats';

interface WordCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: DocumentStats;
  htmlContent: string;
}

export const WordCountModal: React.FC<WordCountModalProps> = ({
  isOpen,
  onClose,
  stats,
  htmlContent,
}) => {
  const [copied, setCopied] = React.useState(false);
  const sectionStats: SectionWordCount[] = React.useMemo(() => {
    if (!isOpen) return [];
    return calculateSectionStats(htmlContent);
  }, [isOpen, htmlContent]);

  if (!isOpen) return null;

  const speakingTimeMinutes = Math.max(1, Math.ceil(stats.words / 130));

  const handleCopyStats = () => {
    let summary = `Document Statistics:\n`;
    summary += `Total Words: ${stats.words.toLocaleString()}\n`;
    summary += `Total Characters (with spaces): ${stats.characters.toLocaleString()}\n`;
    summary += `Total Characters (no spaces): ${stats.charactersWithoutSpaces.toLocaleString()}\n`;
    summary += `Paragraphs: ${stats.paragraphs}\n`;
    summary += `Estimated Pages: ${stats.estimatedPages}\n`;
    summary += `Reading Time: ~${stats.readingTimeMinutes} min\n\n`;
    summary += `Section Breakdown:\n`;
    sectionStats.forEach((sec, idx) => {
      summary += `${idx + 1}. [H${sec.level}] ${sec.title}: ${sec.wordCount.toLocaleString()} words (${sec.percentage}%)\n`;
    });

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border border-zinc-300 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900 text-white">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-zinc-300" />
            <h2 className="text-base font-semibold tracking-wide">Word Count & Document Statistics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Top Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md">
              <span className="text-xs text-zinc-500 block uppercase font-medium">Words</span>
              <span className="text-2xl font-bold text-zinc-900">{stats.words.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md">
              <span className="text-xs text-zinc-500 block uppercase font-medium">Characters</span>
              <span className="text-2xl font-bold text-zinc-900">{stats.characters.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md">
              <span className="text-xs text-zinc-500 block uppercase font-medium">Paragraphs</span>
              <span className="text-2xl font-bold text-zinc-900">{stats.paragraphs.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md">
              <span className="text-xs text-zinc-500 block uppercase font-medium">Pages (est.)</span>
              <span className="text-2xl font-bold text-zinc-900">{stats.estimatedPages}</span>
            </div>
          </div>

          {/* Secondary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-600 bg-zinc-100 p-3 rounded-md border border-zinc-200">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-500" />
              <span>Characters (no spaces): <strong className="text-zinc-800">{stats.charactersWithoutSpaces.toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-500" />
              <span>Reading: <strong className="text-zinc-800">~{stats.readingTimeMinutes} min</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-zinc-500" />
              <span>Speaking: <strong className="text-zinc-800">~{speakingTimeMinutes} min</strong></span>
            </div>
          </div>

          {/* Section Breakdown Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-700" />
                Section & Chapter Breakdown
              </h3>
              <span className="text-xs text-zinc-500">
                {sectionStats.length} {sectionStats.length === 1 ? 'section' : 'sections'} detected
              </span>
            </div>

            {sectionStats.length === 0 ? (
              <p className="text-xs text-zinc-500 italic p-4 text-center border border-dashed border-zinc-300 rounded">
                No sections detected. Add headings (H1, H2, H3) to organize your document into chapters.
              </p>
            ) : (
              <div className="border border-zinc-200 rounded-md overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-100 border-b border-zinc-200 text-zinc-700 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Section / Heading</th>
                      <th className="py-2.5 px-3 text-right">Words</th>
                      <th className="py-2.5 px-3 text-right">Chars</th>
                      <th className="py-2.5 px-3 w-32">Share</th>
                      <th className="py-2.5 px-3 text-right">Read Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {sectionStats.map((sec) => (
                      <tr key={sec.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="py-2 px-3 font-medium text-zinc-800 max-w-xs truncate">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700 text-[10px] mr-1.5 font-mono">
                            H{sec.level}
                          </span>
                          <span title={sec.title}>{sec.title}</span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-zinc-900">
                          {sec.wordCount.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-zinc-600">
                          {sec.characterCount.toLocaleString()}
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 h-2 bg-zinc-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-zinc-800 rounded-full"
                                style={{ width: `${Math.min(100, sec.percentage)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-zinc-600 w-7 text-right font-mono">
                              {sec.percentage}%
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right text-zinc-600">
                          ~{sec.readingTimeMinutes}m
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <button
            onClick={handleCopyStats}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-100 transition-colors shadow-xs active:translate-y-px"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-zinc-900" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Stats Summary</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-zinc-900 rounded hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
