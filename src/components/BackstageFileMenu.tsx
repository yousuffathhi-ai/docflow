import React, { useState } from 'react';
import {
  ArrowLeft,
  Info,
  FilePlus,
  FolderOpen,
  Save,
  Clock,
  Share2,
  Download,
  Printer,
  Shield,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Eye,
  FileText,
  FileCode,
  Upload,
  Check,
  Calendar,
  User,
  Building,
  FileCheck,
  Settings,
  SpellCheck,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { DocumentMetadata, DocumentVersion, DocumentStats, DocumentTemplate, PageLayoutSettings } from '../types/document';
import { DOCUMENT_TEMPLATES } from '../templates/documentTemplates';
import { exportAsDocx, exportAsWordDoc, exportAsHtml, exportAsTxt, exportAsMarkdown, exportAsRtf, exportAsJson } from '../utils/exportUtils';
import { isAutoCorrectEnabled, setAutoCorrectEnabled, findDocumentTypos, correctWord } from '../utils/dictionaryService';
import { Editor } from '@tiptap/react';

interface BackstageFileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  documentMeta: DocumentMetadata;
  onUpdateMeta: (meta: Partial<DocumentMetadata>) => void;
  documentList: Array<{ id: string; title: string; updatedAt: string }>;
  onSelectDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onNewDocument: (template?: DocumentTemplate) => void;
  onSaveAs: (newTitle: string) => void;
  versions: DocumentVersion[];
  onRestoreVersion: (version: DocumentVersion) => void;
  onCreateSnapshot: (summary: string) => void;
  stats: DocumentStats;
  layoutSettings: PageLayoutSettings;
  onTriggerPrint: () => void;
  onImportFile: (content: string, filename: string) => void;
  onOpenPasswordModal: () => void;
}

type BackstageTab = 'info' | 'new' | 'open' | 'saveas' | 'history' | 'export' | 'share' | 'options';

export const BackstageFileMenu: React.FC<BackstageFileMenuProps> = ({
  isOpen,
  onClose,
  editor,
  documentMeta,
  onUpdateMeta,
  documentList,
  onSelectDocument,
  onDeleteDocument,
  onNewDocument,
  onSaveAs,
  versions,
  onRestoreVersion,
  onCreateSnapshot,
  stats,
  layoutSettings,
  onTriggerPrint,
  onImportFile,
  onOpenPasswordModal,
}) => {
  const [activeTab, setActiveTab] = useState<BackstageTab>('info');
  const [saveAsTitle, setSaveAsTitle] = useState(documentMeta.title + ' (Copy)');
  const [snapshotSummary, setSnapshotSummary] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [autoCorrect, setAutoCorrect] = useState<boolean>(() => isAutoCorrectEnabled());
  const [testInput, setTestInput] = useState<string>('');
  const [detectedTypos, setDetectedTypos] = useState<Array<{ word: string; replacement: string; count: number }>>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCopyShare = () => {
    if (!editor) return;
    const shareBundle = {
      meta: documentMeta,
      content: editor.getHTML(),
      exportedAt: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(shareBundle, null, 2)).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex select-none overflow-hidden animate-in fade-in duration-150">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (evt) => {
            const content = evt.target?.result as string;
            if (content) onImportFile(content, file.name);
          };
          reader.readAsText(file);
          e.target.value = '';
          onClose();
        }}
        accept=".txt,.html,.htm,.md,.json,.doc"
        className="hidden"
      />

      {/* Backstage Navigation Sidebar */}
      <div className="w-56 bg-neutral-950 border-r border-neutral-800 flex flex-col py-4 px-2 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 text-white hover:bg-neutral-800 rounded font-bold text-sm mb-4 transition-colors"
          title="Return to Document"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
          <span>Back to Document</span>
        </button>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded transition-colors text-left ${
              activeTab === 'info' ? 'bg-white text-black' : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            <Info className="w-4 h-4 stroke-[2.2]" />
            <span>Info & Protection</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('new')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded transition-colors text-left ${
              activeTab === 'new' ? 'bg-white text-black' : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            <FilePlus className="w-4 h-4 stroke-[2.2]" />
            <span>New Document</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('open')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded transition-colors text-left ${
              activeTab === 'open' ? 'bg-white text-black' : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            <FolderOpen className="w-4 h-4 stroke-[2.2]" />
            <span>Open Documents ({documentList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saveas')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded transition-colors text-left ${
              activeTab === 'saveas' ? 'bg-white text-black' : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            <Save className="w-4 h-4 stroke-[2.2]" />
            <span>Save As</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded transition-colors text-left ${
              activeTab === 'history' ? 'bg-white text-black' : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            <Clock className="w-4 h-4 stroke-[2.2]" />
            <span>Version History ({versions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded transition-colors text-left ${
              activeTab === 'export' ? 'bg-white text-black' : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            <Download className="w-4 h-4 stroke-[2.2]" />
            <span>Export & Formats</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onTriggerPrint();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded text-neutral-300 hover:bg-neutral-900 text-left transition-colors"
          >
            <Printer className="w-4 h-4 stroke-[2.2]" />
            <span>Print Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('share')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded transition-colors text-left ${
              activeTab === 'share' ? 'bg-white text-black' : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            <Share2 className="w-4 h-4 stroke-[2.2]" />
            <span>Share Document</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('options');
              if (editor) {
                setDetectedTypos(findDocumentTypos(editor.getText()));
              }
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded transition-colors text-left ${
              activeTab === 'options' ? 'bg-white text-black' : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            <Settings className="w-4 h-4 stroke-[2.2]" />
            <span>Options & Proofing</span>
          </button>
        </div>
      </div>

      {/* Backstage Content Viewport */}
      <div className="flex-1 bg-black p-8 overflow-y-auto">
        {/* ================= TAB 1: INFO & PROTECTION ================= */}
        {activeTab === 'info' && (
          <div className="max-w-4xl space-y-6">
            <h2 className="text-xl font-bold tracking-tight pb-3 border-b border-neutral-800">
              Document Information & Security
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Security & Permissions Card */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <Shield className="w-5 h-5 text-white stroke-[2.2]" />
                  <span>Protect Document</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Control what types of changes people can make to this document.
                </p>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={onOpenPasswordModal}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-xs font-bold text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 stroke-[2.2]" />
                      <span>{documentMeta.isPasswordProtected ? 'Change / Remove Password' : 'Encrypt with Password'}</span>
                    </div>
                    {documentMeta.isPasswordProtected && <Check className="w-4 h-4 text-white" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateMeta({ isReadOnly: !documentMeta.isReadOnly })}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 border rounded text-xs font-bold text-left transition-colors ${
                      documentMeta.isReadOnly ? 'bg-white text-black border-white' : 'bg-neutral-900 text-white border-neutral-700 hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 stroke-[2.2]" />
                      <span>Always Open Read-Only</span>
                    </div>
                    {documentMeta.isReadOnly && <Check className="w-4 h-4 stroke-[2.5]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateMeta({ isFinal: !documentMeta.isFinal })}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 border rounded text-xs font-bold text-left transition-colors ${
                      documentMeta.isFinal ? 'bg-white text-black border-white' : 'bg-neutral-900 text-white border-neutral-700 hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 stroke-[2.2]" />
                      <span>Mark as Final (Draft Complete)</span>
                    </div>
                    {documentMeta.isFinal && <Check className="w-4 h-4 stroke-[2.5]" />}
                  </button>
                </div>
              </div>

              {/* Document Properties Editor */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <FileText className="w-5 h-5 text-white stroke-[2.2]" />
                  <span>Document Properties</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-neutral-400 font-semibold block mb-1">Title</label>
                    <input
                      type="text"
                      value={documentMeta.title}
                      onChange={(e) => onUpdateMeta({ title: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 font-semibold block mb-1">Author</label>
                    <input
                      type="text"
                      value={documentMeta.author}
                      onChange={(e) => onUpdateMeta({ author: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 font-semibold block mb-1">Organization / Company</label>
                    <input
                      type="text"
                      value={documentMeta.company}
                      onChange={(e) => onUpdateMeta({ company: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 font-semibold block mb-1">Subject / Category</label>
                    <input
                      type="text"
                      value={documentMeta.subject}
                      onChange={(e) => onUpdateMeta({ subject: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Document Statistics Strip */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5">
              <h3 className="font-bold text-sm mb-3">Live Document Metrics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-neutral-900 p-3 rounded border border-neutral-800">
                  <div className="text-lg font-bold font-mono text-white">{stats.words.toLocaleString()}</div>
                  <div className="text-[11px] text-neutral-400 font-medium">Total Words</div>
                </div>
                <div className="bg-neutral-900 p-3 rounded border border-neutral-800">
                  <div className="text-lg font-bold font-mono text-white">{stats.characters.toLocaleString()}</div>
                  <div className="text-[11px] text-neutral-400 font-medium">Characters</div>
                </div>
                <div className="bg-neutral-900 p-3 rounded border border-neutral-800">
                  <div className="text-lg font-bold font-mono text-white">{stats.paragraphs}</div>
                  <div className="text-[11px] text-neutral-400 font-medium">Paragraphs</div>
                </div>
                <div className="bg-neutral-900 p-3 rounded border border-neutral-800">
                  <div className="text-lg font-bold font-mono text-white">{stats.estimatedPages}</div>
                  <div className="text-[11px] text-neutral-400 font-medium">Estimated A4 Pages</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: NEW DOCUMENT ================= */}
        {activeTab === 'new' && (
          <div className="max-w-4xl space-y-6">
            <h2 className="text-xl font-bold tracking-tight pb-3 border-b border-neutral-800">
              Create New Document
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {DOCUMENT_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    onNewDocument(tmpl);
                    onClose();
                  }}
                  className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-white p-5 rounded-lg cursor-pointer transition-all flex flex-col justify-between group shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FileText className="w-5 h-5 text-white stroke-[2.2]" />
                      <span className="text-[10px] uppercase font-bold text-neutral-400">{tmpl.category}</span>
                    </div>
                    <div className="font-bold text-sm text-white group-hover:underline">{tmpl.name}</div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{tmpl.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-800 text-xs font-bold text-white flex items-center justify-between">
                    <span>Create Document</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: OPEN DOCUMENTS ================= */}
        {activeTab === 'open' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h2 className="text-xl font-bold tracking-tight">Open Saved Documents</h2>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 bg-white text-black font-bold text-xs rounded hover:bg-neutral-200 transition-colors"
              >
                <Upload className="w-4 h-4 stroke-[2.2]" />
                <span>Import File from Computer</span>
              </button>
            </div>

            <div className="space-y-2">
              {documentList.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3.5 bg-neutral-950 border border-neutral-800 rounded hover:border-neutral-600 transition-colors"
                >
                  <div
                    onClick={() => {
                      onSelectDocument(doc.id);
                      onClose();
                    }}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <FileText className="w-5 h-5 text-white stroke-[2.2]" />
                    <div>
                      <div className="font-bold text-sm text-white hover:underline">{doc.title}</div>
                      <div className="text-[11px] text-neutral-400">
                        Last modified: {new Date(doc.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDocument(doc.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-bold bg-neutral-900 hover:bg-white hover:text-black border border-neutral-700 rounded transition-colors"
                    >
                      Open
                    </button>
                    {documentList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteDocument(doc.id)}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: SAVE AS ================= */}
        {activeTab === 'saveas' && (
          <div className="max-w-2xl space-y-6">
            <h2 className="text-xl font-bold tracking-tight pb-3 border-b border-neutral-800">
              Save As (Duplicate & Rename)
            </h2>

            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">New Document Title</label>
                <input
                  type="text"
                  value={saveAsTitle}
                  onChange={(e) => setSaveAsTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white font-semibold text-sm focus:outline-none focus:border-white"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  onSaveAs(saveAsTitle);
                  onClose();
                }}
                className="w-full py-2.5 bg-white text-black font-bold text-xs rounded hover:bg-neutral-200 transition-colors shadow-xs"
              >
                Create Duplicate Copy & Switch
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 5: VERSION HISTORY ================= */}
        {activeTab === 'history' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Version History</h2>
                <p className="text-xs text-neutral-400">Restore or inspect past iterations of this document.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Snapshot summary (e.g. Added section 3)"
                  value={snapshotSummary}
                  onChange={(e) => setSnapshotSummary(e.target.value)}
                  className="bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded text-xs text-white w-64"
                />
                <button
                  type="button"
                  onClick={() => {
                    onCreateSnapshot(snapshotSummary || 'Manual snapshot');
                    setSnapshotSummary('');
                  }}
                  className="px-3 py-1.5 bg-white text-black font-bold text-xs rounded hover:bg-neutral-200"
                >
                  Save Version
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {versions.length === 0 ? (
                <div className="text-neutral-500 text-xs py-8 text-center bg-neutral-950 border border-neutral-900 rounded">
                  No snapshot versions saved yet. Create one above to preserve points in time.
                </div>
              ) : (
                versions.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{v.title}</span>
                        <span className="text-[10px] bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded text-neutral-400">
                          {v.wordCount} words
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400">
                        {v.summary} · {new Date(v.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onRestoreVersion(v);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-white hover:text-black border border-neutral-700 text-xs font-bold rounded transition-colors"
                    >
                      Restore Version
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 6: EXPORT & FORMATS ================= */}
        {activeTab === 'export' && (
          <div className="max-w-4xl space-y-6">
            <h2 className="text-xl font-bold tracking-tight pb-3 border-b border-neutral-800">
              Export Document to Files
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div
                onClick={() => {
                  exportAsDocx(editor, documentMeta.title);
                  onClose();
                }}
                className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-700 hover:border-white p-5 rounded-lg cursor-pointer transition-all space-y-2 group shadow-sm ring-1 ring-neutral-700"
              >
                <div className="flex items-center justify-between">
                  <FileText className="w-5 h-5 text-white stroke-[2.2]" />
                  <span className="text-[10px] font-bold text-white bg-neutral-800 px-2 py-0.5 rounded border border-neutral-600">RECOMMENDED</span>
                </div>
                <div className="font-bold text-sm text-white group-hover:underline flex items-center gap-1.5">
                  <span>Word Document (.docx)</span>
                </div>
                <p className="text-xs text-neutral-400">Genuine Microsoft Word .docx format built with the docx library for standard MS Word interoperability.</p>
              </div>

              <div
                onClick={() => {
                  exportAsWordDoc(editor, documentMeta.title);
                  onClose();
                }}
                className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-white p-5 rounded-lg cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <FileText className="w-5 h-5 text-white stroke-[2.2]" />
                  <span className="text-[10px] font-bold text-neutral-400">DOC</span>
                </div>
                <div className="font-bold text-sm text-white group-hover:underline">Word Legacy (.doc)</div>
                <p className="text-xs text-neutral-400">Legacy Word 97-2003 compatible document format.</p>
              </div>

              <div
                onClick={() => {
                  onClose();
                  onTriggerPrint();
                }}
                className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-white p-5 rounded-lg cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <Printer className="w-5 h-5 text-white stroke-[2.2]" />
                  <span className="text-[10px] font-bold text-neutral-400">PDF</span>
                </div>
                <div className="font-bold text-sm text-white group-hover:underline">PDF Document (Print)</div>
                <p className="text-xs text-neutral-400">High-resolution print-ready A4 PDF without ribbons.</p>
              </div>

              <div
                onClick={() => {
                  exportAsHtml(editor, documentMeta.title, layoutSettings);
                  onClose();
                }}
                className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-white p-5 rounded-lg cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <FileCode className="w-5 h-5 text-white stroke-[2.2]" />
                  <span className="text-[10px] font-bold text-neutral-400">HTML</span>
                </div>
                <div className="font-bold text-sm text-white group-hover:underline">Web Page (.html)</div>
                <p className="text-xs text-neutral-400">Self-contained styled HTML file ready for web publishing.</p>
              </div>

              <div
                onClick={() => {
                  exportAsMarkdown(editor, documentMeta.title);
                  onClose();
                }}
                className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-white p-5 rounded-lg cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <FileCode className="w-5 h-5 text-white stroke-[2.2]" />
                  <span className="text-[10px] font-bold text-neutral-400">MD</span>
                </div>
                <div className="font-bold text-sm text-white group-hover:underline">Markdown (.md)</div>
                <p className="text-xs text-neutral-400">Clean Markdown syntax for developers and note apps.</p>
              </div>

              <div
                onClick={() => {
                  exportAsRtf(editor, documentMeta.title);
                  onClose();
                }}
                className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-white p-5 rounded-lg cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <FileText className="w-5 h-5 text-white stroke-[2.2]" />
                  <span className="text-[10px] font-bold text-neutral-400">RTF</span>
                </div>
                <div className="font-bold text-sm text-white group-hover:underline">Rich Text Format (.rtf)</div>
                <p className="text-xs text-neutral-400">Standard cross-platform rich text exchange file.</p>
              </div>

              <div
                onClick={() => {
                  exportAsTxt(editor, documentMeta.title);
                  onClose();
                }}
                className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-white p-5 rounded-lg cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <FileText className="w-5 h-5 text-white stroke-[2.2]" />
                  <span className="text-[10px] font-bold text-neutral-400">TXT</span>
                </div>
                <div className="font-bold text-sm text-white group-hover:underline">Plain Text (.txt)</div>
                <p className="text-xs text-neutral-400">Unformatted UTF-8 raw text without markup.</p>
              </div>

              <div
                onClick={() => {
                  const bundle = { meta: documentMeta, content: editor?.getHTML(), versions, stats };
                  exportAsJson(bundle, documentMeta.title);
                  onClose();
                }}
                className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-white p-5 rounded-lg cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <Download className="w-5 h-5 text-white stroke-[2.2]" />
                  <span className="text-[10px] font-bold text-neutral-400">JSON BUNDLE</span>
                </div>
                <div className="font-bold text-sm text-white group-hover:underline">Full Document Bundle (.json)</div>
                <p className="text-xs text-neutral-400">Complete archive with metadata, versions, and formatting.</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: SHARE ================= */}
        {activeTab === 'share' && (
          <div className="max-w-2xl space-y-6">
            <h2 className="text-xl font-bold tracking-tight pb-3 border-b border-neutral-800">
              Share Document
            </h2>

            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 space-y-4">
              <p className="text-xs text-neutral-400">
                Generate a portable JSON document package to share with teammates or import on another machine.
              </p>

              <button
                type="button"
                onClick={handleCopyShare}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black font-bold text-xs rounded hover:bg-neutral-200 transition-colors"
              >
                <Copy className="w-4 h-4 stroke-[2.2]" />
                <span>{copiedLink ? 'Document Data Copied to Clipboard!' : 'Copy Document Data to Clipboard'}</span>
              </button>

              <div className="pt-2 border-t border-neutral-800">
                <a
                  href={`mailto:?subject=${encodeURIComponent(documentMeta.title)}&body=${encodeURIComponent(
                    'Please find attached the draft for ' + documentMeta.title + '\n\n' + (editor?.getText().slice(0, 300) || '') + '...'
                  )}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-900 border border-neutral-700 text-white font-bold text-xs rounded hover:bg-neutral-800 transition-colors block text-center"
                >
                  Draft Email with Document Snippet
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 8: OPTIONS & AUTO-CORRECT ================= */}
        {activeTab === 'options' && (
          <div className="max-w-3xl space-y-6">
            <h2 className="text-xl font-bold tracking-tight pb-3 border-b border-neutral-800 flex items-center gap-2.5">
              <Settings className="w-5 h-5 text-neutral-300" />
              Word Options & Auto-Correct Proofing
            </h2>

            {/* Auto-Correct Toggle Card */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <SpellCheck className="w-4 h-4 text-neutral-300" />
                    Auto-Correct As You Type
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Automatically replace common typographical mistakes as you type (e.g. &quot;teh&quot; → &quot;the&quot;, &quot;recieve&quot; → &quot;receive&quot;).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !autoCorrect;
                    setAutoCorrect(next);
                    setAutoCorrectEnabled(next);
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    autoCorrect ? 'bg-white justify-end' : 'bg-neutral-800 justify-start'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${autoCorrect ? 'bg-black' : 'bg-neutral-500'}`} />
                </button>
              </div>

              {/* Interactive Test Playground */}
              <div className="pt-3 border-t border-neutral-800 space-y-2">
                <label className="text-[11px] font-semibold text-neutral-400 block uppercase tracking-wide">
                  Try Auto-Correct in action:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTestInput(val);
                      // If ends with space, test autocorrect on preceding word
                      if (val.endsWith(' ')) {
                        const words = val.trim().split(/\s+/);
                        const lastWord = words[words.length - 1];
                        const fixed = correctWord(lastWord);
                        if (fixed && fixed.toLowerCase() !== lastWord.toLowerCase()) {
                          words[words.length - 1] = fixed;
                          setTestInput(words.join(' ') + ' ');
                        }
                      }
                    }}
                    placeholder="Type 'teh', 'seperate', 'definately' and hit space..."
                    className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-xs text-white placeholder-neutral-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setTestInput('The separate and definite accommodation')}
                    className="px-3 py-2 bg-neutral-800 text-neutral-300 hover:text-white rounded text-xs"
                  >
                    Load Sample
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500">
                  Tip: Auto-Correct triggers immediately in the document canvas whenever you finish typing a word with a space or punctuation mark.
                </p>
              </div>
            </div>

            {/* Document Scan & Batch Fix Card */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-neutral-300" />
                    Document Typo Scanner
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Scan the entire document against the dictionary for known misspellings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (editor) {
                      setDetectedTypos(findDocumentTypos(editor.getText()));
                    }
                  }}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white rounded text-xs font-semibold"
                >
                  Scan Document
                </button>
              </div>

              {detectedTypos.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-400 font-semibold">
                      Found {detectedTypos.length} potential typo(s) in document:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editor) return;
                        let html = editor.getHTML();
                        detectedTypos.forEach(({ word, replacement }) => {
                          const regex = new RegExp(`\\b${word}\\b`, 'g');
                          html = html.replace(regex, replacement);
                        });
                        editor.commands.setContent(html);
                        setDetectedTypos([]);
                      }}
                      className="px-3 py-1 bg-white text-black hover:bg-neutral-200 rounded text-xs font-bold transition-colors"
                    >
                      Correct All in Document
                    </button>
                  </div>

                  <div className="border border-neutral-800 rounded overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-neutral-900 text-neutral-400">
                        <tr>
                          <th className="py-1.5 px-3">Typo</th>
                          <th className="py-1.5 px-3">Auto-Correction</th>
                          <th className="py-1.5 px-3 text-right">Occurrences</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-850">
                        {detectedTypos.map((t, idx) => (
                          <tr key={idx} className="hover:bg-neutral-900/50">
                            <td className="py-1.5 px-3 font-mono text-red-400">{t.word}</td>
                            <td className="py-1.5 px-3 font-mono text-green-400">{t.replacement}</td>
                            <td className="py-1.5 px-3 text-right text-neutral-400">{t.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic bg-neutral-900/50 p-3 rounded border border-neutral-800 text-center">
                  No common typos currently detected in your document. Everything looks clean!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
