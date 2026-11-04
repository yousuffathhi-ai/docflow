import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

import { FontSize, LineHeight } from './extensions/customExtensions';
import { DOCUMENT_TEMPLATES } from './templates/documentTemplates';
import {
  DocumentMetadata,
  DocumentStats,
  DocumentVersion,
  DocumentComment,
  TrackChangeItem,
  CitationItem,
  RecipientItem,
  PageLayoutSettings,
  ViewMode,
  DocumentTemplate,
} from './types/document';
import { calculateStats } from './utils/textStats';

import { Header } from './components/Header';
import { BackstageFileMenu } from './components/BackstageFileMenu';
import { RibbonToolbar } from './components/RibbonToolbar';
import { EditorCanvas } from './components/EditorCanvas';
import { NavigationPane } from './components/NavigationPane';
import { CommentsSidebar } from './components/CommentsSidebar';
import { ProofingSidebar } from './components/ProofingSidebar';
import { StatusBar } from './components/StatusBar';

import { TableModal } from './components/TableModal';
import { TemplateModal } from './components/TemplateModal';
import { FindReplaceModal } from './components/FindReplaceModal';
import { InsertElementsModal } from './components/InsertElementsModal';
import { MailMergeModal } from './components/MailMergeModal';
import { CitationsModal } from './components/CitationsModal';
import { PasswordProtectModal } from './components/PasswordProtectModal';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { VoiceTypingWidget } from './components/VoiceTypingWidget';
import { ReadAloudWidget } from './components/ReadAloudWidget';
import { ShareModal } from './components/ShareModal';
import { MobileToolbar } from './components/MobileToolbar';

const STORAGE_KEY_DOCS = 'doceditor_documents_v3';
const STORAGE_KEY_ACTIVE_ID = 'doceditor_active_id_v3';
const STORAGE_KEY_VERSIONS = 'doceditor_versions_v3';
const STORAGE_KEY_COMMENTS = 'doceditor_comments_v3';
const STORAGE_KEY_CITATIONS = 'doceditor_citations_v3';
const STORAGE_KEY_RECIPIENTS = 'doceditor_recipients_v3';
const STORAGE_KEY_AUTOSAVE = 'doceditor_autosave_v3';

export default function App() {
  // 1. All saved documents list
  const [documents, setDocuments] = useState<Array<{ id: string; title: string; updatedAt: string; content: string; meta: DocumentMetadata; layout: PageLayoutSettings }>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOCS);
      if (saved) return JSON.parse(saved);
    } catch {}
    const initialId = 'doc-initial-1';
    return [
      {
        id: initialId,
        title: 'Project Proposal: Cloud Modernization',
        updatedAt: new Date().toISOString(),
        content: DOCUMENT_TEMPLATES[1].content,
        meta: {
          id: initialId,
          title: 'Project Proposal: Cloud Modernization',
          author: 'Architecture Advisory',
          company: 'Nexus Technology Partners',
          subject: 'Infrastructure Strategy',
          keywords: 'cloud, architecture, migration',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
          isReadOnly: false,
          isPasswordProtected: false,
          isFinal: false,
        },
        layout: {
          marginPreset: 'normal',
          paperSize: 'a4',
          isLandscape: false,
          columns: 1,
          pageColor: '#ffffff',
          pageBorder: 'none',
          watermark: '',
          lineNumbers: false,
          hyphenation: false,
          textDirection: 'ltr',
          headerText: 'Project Proposal · Confidential Document',
          footerText: 'Internal Use Only · Page 1',
          showPageNumbers: true,
        },
      },
    ];
  });

  const [activeDocId, setActiveDocId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || 'doc-initial-1';
  });

  const activeDoc = useMemo(() => {
    return documents.find((d) => d.id === activeDocId) || documents[0];
  }, [documents, activeDocId]);

  // Document metadata and layout states
  const [documentMeta, setDocumentMeta] = useState<DocumentMetadata>(activeDoc.meta);
  const [layoutSettings, setLayoutSettings] = useState<PageLayoutSettings>(activeDoc.layout);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTOSAVE);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [editingMode, setEditingMode] = useState<'editing' | 'reviewing' | 'viewing'>('editing');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // UI View States
  const [viewMode, setViewMode] = useState<ViewMode>('page');
  const [rulerVisible, setRulerVisible] = useState<boolean>(true);
  const [showGridlines, setShowGridlines] = useState<boolean>(false);
  const [showFormattingMarks, setShowFormattingMarks] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [formatPainterActive, setFormatPainterActive] = useState<boolean>(false);
  const [copiedFormat, setCopiedFormat] = useState<any>(null);

  // Sidebars
  const [navigationPaneOpen, setNavigationPaneOpen] = useState<boolean>(false);
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false);
  const [proofingOpen, setProofingOpen] = useState<boolean>(false);

  // Modals & Backstage
  const [isBackstageOpen, setIsBackstageOpen] = useState<boolean>(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState<boolean>(false);
  const [isInsertModalOpen, setIsInsertModalOpen] = useState<boolean>(false);
  const [insertModalTab, setInsertModalTab] = useState<string>('shapes');
  const [isMailMergeOpen, setIsMailMergeOpen] = useState<boolean>(false);
  const [isCitationsOpen, setIsCitationsOpen] = useState<boolean>(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState<boolean>(false);
  const [isVoiceTypingOpen, setIsVoiceTypingOpen] = useState<boolean>(false);
  const [isReadAloudOpen, setIsReadAloudOpen] = useState<boolean>(false);

  // Document Collections
  const [versions, setVersions] = useState<DocumentVersion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VERSIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [comments, setComments] = useState<DocumentComment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [trackChangesActive, setTrackChangesActive] = useState<boolean>(false);
  const [trackChangesList, setTrackChangesList] = useState<TrackChangeItem[]>([]);

  const [citations, setCitations] = useState<CitationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CITATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recipients, setRecipients] = useState<RecipientItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECIPIENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Statistics
  const [stats, setStats] = useState<DocumentStats>({
    words: 0,
    characters: 0,
    charactersWithoutSpaces: 0,
    paragraphs: 0,
    lines: 0,
    readingTimeMinutes: 1,
    estimatedPages: 1,
  });

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      Subscript,
      Superscript,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      FontSize,
      LineHeight,
    ],
    content: activeDoc.content,
    editable: !documentMeta.isReadOnly,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[500px]',
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus('saving');
      const text = editor.getText();
      const html = editor.getHTML();
      setStats(calculateStats(text, html));
    },
    onSelectionUpdate: ({ editor }) => {
      // If format painter is active and we have copied attributes, apply to selection!
      if (formatPainterActive && copiedFormat) {
        if (copiedFormat.bold) editor.chain().focus().setBold().run();
        if (copiedFormat.italic) editor.chain().focus().setItalic().run();
        if (copiedFormat.underline) editor.chain().focus().setUnderline().run();
        if (copiedFormat.color) editor.chain().focus().setColor(copiedFormat.color).run();
        if (copiedFormat.fontSize) editor.chain().focus().setFontSize(copiedFormat.fontSize).run();
        if (copiedFormat.fontFamily) editor.chain().focus().setFontFamily(copiedFormat.fontFamily).run();
        setFormatPainterActive(false);
      }
    },
  });

  // Sync editor editable state with read-only and viewing mode
  useEffect(() => {
    if (editor) {
      if (editingMode === 'viewing' || documentMeta.isReadOnly) {
        editor.setEditable(false);
      } else {
        editor.setEditable(true);
      }
    }
  }, [editor, editingMode, documentMeta.isReadOnly]);

  // Recalculate stats when editor is ready
  useEffect(() => {
    if (editor) {
      const text = editor.getText();
      const html = editor.getHTML();
      setStats(calculateStats(text, html));
    }
  }, [editor]);

  // Toggle AutoSave preference
  const handleToggleAutoSave = useCallback(() => {
    setAutoSaveEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_AUTOSAVE, JSON.stringify(next));
      return next;
    });
  }, []);

  // Manual Save (immediate persistence)
  const handleManualSave = useCallback(() => {
    if (!editor) return;
    setSaveStatus('saving');
    try {
      const html = editor.getHTML();
      setDocuments((prevDocs) => {
        const updated = prevDocs.map((d) => {
          if (d.id === activeDocId) {
            return {
              ...d,
              title: documentMeta.title,
              content: html,
              updatedAt: new Date().toISOString(),
              meta: documentMeta,
              layout: layoutSettings,
            };
          }
          return d;
        });
        localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(updated));
        return updated;
      });

      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeDocId);
      localStorage.setItem(STORAGE_KEY_VERSIONS, JSON.stringify(versions));
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
      localStorage.setItem(STORAGE_KEY_CITATIONS, JSON.stringify(citations));
      localStorage.setItem(STORAGE_KEY_RECIPIENTS, JSON.stringify(recipients));

      setSaveStatus('saved');
    } catch (err) {
      console.error('LocalStorage save failed:', err);
    }
  }, [editor, activeDocId, documentMeta, layoutSettings, versions, comments, citations, recipients]);

  // Change editing mode
  const handleChangeEditingMode = useCallback((mode: 'editing' | 'reviewing' | 'viewing') => {
    setEditingMode(mode);
    if (mode === 'reviewing') {
      setCommentsOpen(true);
      setTrackChangesActive(true);
    }
  }, []);

  // Persist Active Document changes automatically if autoSaveEnabled is true
  useEffect(() => {
    if (!editor) return;
    if (!autoSaveEnabled) return;

    const timer = setTimeout(() => {
      try {
        const html = editor.getHTML();
        setDocuments((prevDocs) => {
          const updated = prevDocs.map((d) => {
            if (d.id === activeDocId) {
              return {
                ...d,
                title: documentMeta.title,
                content: html,
                updatedAt: new Date().toISOString(),
                meta: documentMeta,
                layout: layoutSettings,
              };
            }
            return d;
          });
          localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(updated));
          return updated;
        });

        localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeDocId);
        localStorage.setItem(STORAGE_KEY_VERSIONS, JSON.stringify(versions));
        localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
        localStorage.setItem(STORAGE_KEY_CITATIONS, JSON.stringify(citations));
        localStorage.setItem(STORAGE_KEY_RECIPIENTS, JSON.stringify(recipients));

        setSaveStatus('saved');
      } catch (err) {
        console.error('LocalStorage save failed:', err);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [
    editor?.getHTML(),
    activeDocId,
    documentMeta,
    layoutSettings,
    versions,
    comments,
    citations,
    recipients,
    autoSaveEnabled,
  ]);

  // Switch Active Document
  const handleSelectDocument = useCallback(
    (id: string) => {
      const target = documents.find((d) => d.id === id);
      if (!target) return;
      setActiveDocId(id);
      setDocumentMeta(target.meta);
      setLayoutSettings(target.layout);
      editor?.commands.setContent(target.content);
      editor?.commands.focus();
    },
    [documents, editor]
  );

  // Create New Document
  const handleNewDocument = useCallback(
    (template?: DocumentTemplate) => {
      const newId = `doc-${Date.now()}`;
      const title = template?.name || 'Untitled Document';
      const content = template?.content || DOCUMENT_TEMPLATES[0].content;

      const newDoc = {
        id: newId,
        title,
        updatedAt: new Date().toISOString(),
        content,
        meta: {
          id: newId,
          title,
          author: documentMeta.author || 'Author',
          company: documentMeta.company || 'Organization',
          subject: '',
          keywords: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
          isReadOnly: false,
          isPasswordProtected: false,
          isFinal: false,
        },
        layout: { ...layoutSettings },
      };

      setDocuments((prev) => [newDoc, ...prev]);
      setActiveDocId(newId);
      setDocumentMeta(newDoc.meta);
      setLayoutSettings(newDoc.layout);
      editor?.commands.setContent(content);
      editor?.commands.focus();
    },
    [documentMeta.author, documentMeta.company, layoutSettings, editor]
  );

  // Save As (Duplicate document)
  const handleSaveAs = useCallback(
    (newTitle: string) => {
      const newId = `doc-${Date.now()}`;
      const currentHtml = editor?.getHTML() || '';
      const newDoc = {
        id: newId,
        title: newTitle,
        updatedAt: new Date().toISOString(),
        content: currentHtml,
        meta: {
          ...documentMeta,
          id: newId,
          title: newTitle,
          updatedAt: new Date().toISOString(),
        },
        layout: { ...layoutSettings },
      };

      setDocuments((prev) => [newDoc, ...prev]);
      setActiveDocId(newId);
      setDocumentMeta(newDoc.meta);
      editor?.commands.focus();
    },
    [editor, documentMeta, layoutSettings]
  );

  // Delete Document
  const handleDeleteDocument = useCallback(
    (id: string) => {
      if (documents.length <= 1) {
        alert('Cannot delete the only document.');
        return;
      }
      if (window.confirm('Delete this document?')) {
        const remaining = documents.filter((d) => d.id !== id);
        setDocuments(remaining);
        if (activeDocId === id) {
          handleSelectDocument(remaining[0].id);
        }
      }
    },
    [documents, activeDocId, handleSelectDocument]
  );

  // Create Version Snapshot
  const handleCreateSnapshot = useCallback(
    (summary: string) => {
      if (!editor) return;
      const newVersion: DocumentVersion = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        title: documentMeta.title,
        author: documentMeta.author,
        summary,
        content: editor.getHTML(),
        wordCount: stats.words,
      };
      setVersions((prev) => [newVersion, ...prev]);
    },
    [editor, documentMeta.title, documentMeta.author, stats.words]
  );

  // Restore Version Snapshot
  const handleRestoreVersion = useCallback(
    (version: DocumentVersion) => {
      if (window.confirm(`Restore snapshot "${version.summary}" from ${new Date(version.timestamp).toLocaleString()}?`)) {
        editor?.commands.setContent(version.content);
        editor?.commands.focus();
      }
    },
    [editor]
  );

  // Format Painter trigger
  const handleToggleFormatPainter = useCallback(() => {
    if (!editor) return;
    if (!formatPainterActive) {
      // Capture current cursor format
      const marks = editor.getAttributes('textStyle');
      setCopiedFormat({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        color: marks.color,
        fontSize: marks.fontSize,
        fontFamily: marks.fontFamily,
      });
      setFormatPainterActive(true);
    } else {
      setFormatPainterActive(false);
      setCopiedFormat(null);
    }
  }, [editor, formatPainterActive]);

  // Change Case (UPPERCASE, lowercase, Title Case, Sentence case)
  const handleChangeCase = useCallback(
    (type: 'upper' | 'lower' | 'title' | 'sentence') => {
      if (!editor) return;
      const selection = editor.state.selection;
      if (selection && !selection.empty) {
        const selectedText = editor.state.doc.textBetween(selection.from, selection.to);
        let transformed = selectedText;
        if (type === 'upper') transformed = selectedText.toUpperCase();
        if (type === 'lower') transformed = selectedText.toLowerCase();
        if (type === 'title') {
          transformed = selectedText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        }
        if (type === 'sentence') {
          transformed = selectedText.charAt(0).toUpperCase() + selectedText.slice(1).toLowerCase();
        }
        editor.chain().focus().insertContent(transformed).run();
      }
    },
    [editor]
  );

  // Sort Selected Lines A-Z
  const handleSortSelectedLines = useCallback(() => {
    if (!editor) return;
    const text = editor.getText();
    const sorted = text
      .split('\n')
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .map((line) => `<p>${line}</p>`)
      .join('');
    editor.commands.setContent(sorted);
  }, [editor]);

  // Table of Contents Generator
  const handleTriggerAutoTOC = useCallback(() => {
    if (!editor) return;
    const html = editor.getHTML();
    const headings: string[] = [];
    const regex = /<h([1-3])[^>]*>(.*?)<\/h[1-3]>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
      headings.push(match[2].replace(/<[^>]+>/g, '').trim());
    }

    if (headings.length === 0) {
      alert('No Headings found in this document. Add Heading 1 or Heading 2 styles first.');
      return;
    }

    let tocHtml = `<div style="background-color: #fafafa; border: 1.5px solid #000; border-radius: 6px; padding: 18px; margin: 20px 0;"><h3 style="margin-top: 0; font-size: 16px; font-weight: bold; text-transform: uppercase;">Table of Contents</h3><ul style="list-style-type: none; padding-left: 0; margin-bottom: 0;">`;
    headings.forEach((h, i) => {
      tocHtml += `<li style="padding: 4px 0; border-bottom: 1px dotted #cbd5e1; display: flex; justify-content: space-between;"><span style="font-weight: 600;">${h}</span><span style="font-family: monospace;">Page ${Math.min(i + 1, stats.estimatedPages)}</span></li>`;
    });
    tocHtml += `</ul></div><p></p>`;

    editor.chain().focus().insertContentAt(0, tocHtml).run();
  }, [editor, stats.estimatedPages]);

  // Add Comment
  const handleAddComment = useCallback((text: string, selectedText: string) => {
    const newComment: DocumentComment = {
      id: Date.now().toString(),
      author: documentMeta.author || 'Reviewer',
      text,
      selectedText,
      createdAt: new Date().toISOString(),
      resolved: false,
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
  }, [documentMeta.author]);

  // Add Comment Reply
  const handleAddReply = useCallback((commentId: string, replyText: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [
              ...(c.replies || []),
              {
                id: Date.now().toString(),
                author: documentMeta.author || 'Reviewer',
                text: replyText,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return c;
      })
    );
  }, [documentMeta.author]);

  // Fullscreen
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F4F4F5] text-black antialiased select-text">
      {/* 1. Top Header Bar */}
      <Header
        editor={editor}
        documentTitle={documentMeta.title}
        onTitleChange={(newTitle) => setDocumentMeta((prev) => ({ ...prev, title: newTitle }))}
        saveStatus={saveStatus}
        autoSaveEnabled={autoSaveEnabled}
        onToggleAutoSave={handleToggleAutoSave}
        onManualSave={handleManualSave}
        editingMode={editingMode}
        onChangeEditingMode={handleChangeEditingMode}
        onToggleComments={() => setCommentsOpen(!commentsOpen)}
        commentsCount={comments.filter((c) => !c.resolved).length}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onTriggerPrint={() => setIsPrintPreviewOpen(true)}
        onSearchFocus={() => setIsFindReplaceOpen(true)}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />

      {/* 2. Desktop MS Word Ribbon Toolbar */}
      <RibbonToolbar
        editor={editor}
        onOpenFileMenu={() => setIsBackstageOpen(true)}
        rulerVisible={rulerVisible}
        onToggleRuler={() => setRulerVisible(!rulerVisible)}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        layoutSettings={layoutSettings}
        onUpdateLayoutSettings={(s) => setLayoutSettings({ ...layoutSettings, ...s })}
        onInsertTableModal={() => setIsTableModalOpen(true)}
        onOpenFindReplace={() => setIsFindReplaceOpen(true)}
        onOpenInsertModal={(tab) => {
          setInsertModalTab(tab || 'shapes');
          setIsInsertModalOpen(true);
        }}
        onOpenMailMerge={() => setIsMailMergeOpen(true)}
        onOpenCitations={() => setIsCitationsOpen(true)}
        onToggleNavigationPane={() => setNavigationPaneOpen(!navigationPaneOpen)}
        navigationPaneOpen={navigationPaneOpen}
        onToggleComments={() => setCommentsOpen(!commentsOpen)}
        commentsOpen={commentsOpen}
        onToggleProofing={() => setProofingOpen(!proofingOpen)}
        proofingOpen={proofingOpen}
        onOpenVoiceTyping={() => setIsVoiceTypingOpen(!isVoiceTypingOpen)}
        onOpenReadAloud={() => setIsReadAloudOpen(!isReadAloudOpen)}
        showGridlines={showGridlines}
        onToggleGridlines={() => setShowGridlines(!showGridlines)}
        showFormattingMarks={showFormattingMarks}
        onToggleFormattingMarks={() => setShowFormattingMarks(!showFormattingMarks)}
        formatPainterActive={formatPainterActive}
        onToggleFormatPainter={handleToggleFormatPainter}
        onTriggerAutoTOC={handleTriggerAutoTOC}
        onSortSelectedLines={handleSortSelectedLines}
        onChangeCase={handleChangeCase}
      />

      {/* 3. Main Workspace with Dockable Sidebars */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Pane */}
        {navigationPaneOpen && (
          <NavigationPane
            isOpen={navigationPaneOpen}
            onClose={() => setNavigationPaneOpen(false)}
            editor={editor}
          />
        )}

        {/* Center Paper Canvas */}
        <EditorCanvas
          editor={editor}
          rulerVisible={rulerVisible}
          viewMode={viewMode}
          zoomLevel={zoomLevel}
          layoutSettings={layoutSettings}
          showGridlines={showGridlines}
          showFormattingMarks={showFormattingMarks}
          isReadOnly={documentMeta.isReadOnly}
        />

        {/* Right Comments & Track Changes Sidebar */}
        {commentsOpen && (
          <CommentsSidebar
            isOpen={commentsOpen}
            onClose={() => setCommentsOpen(false)}
            comments={comments}
            onAddComment={handleAddComment}
            onResolveComment={(id) =>
              setComments((prev) => prev.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c)))
            }
            onDeleteComment={(id) => setComments((prev) => prev.filter((c) => c.id !== id))}
            onAddReply={handleAddReply}
            trackChangesActive={trackChangesActive}
            onToggleTrackChanges={() => setTrackChangesActive(!trackChangesActive)}
            trackChangesList={trackChangesList}
            onAcceptTrackChange={(id) => setTrackChangesList((prev) => prev.filter((t) => t.id !== id))}
            onRejectTrackChange={(id) => setTrackChangesList((prev) => prev.filter((t) => t.id !== id))}
            onAcceptAllTrackChanges={() => setTrackChangesList([])}
            onRejectAllTrackChanges={() => setTrackChangesList([])}
            editor={editor}
          />
        )}

        {/* Right Proofing & Thesaurus Sidebar */}
        {proofingOpen && (
          <ProofingSidebar
            isOpen={proofingOpen}
            onClose={() => setProofingOpen(false)}
            editor={editor}
          />
        )}
      </div>

      {/* 4. Bottom Status Bar */}
      <StatusBar
        stats={stats}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        rulerVisible={rulerVisible}
        onToggleRuler={() => setRulerVisible(!rulerVisible)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* ================= MODAL DIALOGS ================= */}
      {/* Backstage File Menu */}
      <BackstageFileMenu
        isOpen={isBackstageOpen}
        onClose={() => setIsBackstageOpen(false)}
        editor={editor}
        documentMeta={documentMeta}
        onUpdateMeta={(m) => setDocumentMeta({ ...documentMeta, ...m })}
        documentList={documents.map((d) => ({ id: d.id, title: d.title, updatedAt: d.updatedAt }))}
        onSelectDocument={handleSelectDocument}
        onDeleteDocument={handleDeleteDocument}
        onNewDocument={handleNewDocument}
        onSaveAs={handleSaveAs}
        versions={versions}
        onRestoreVersion={handleRestoreVersion}
        onCreateSnapshot={handleCreateSnapshot}
        stats={stats}
        layoutSettings={layoutSettings}
        onTriggerPrint={() => setIsPrintPreviewOpen(true)}
        onImportFile={(content, filename) => {
          const cleanName = filename.replace(/\.[^/.]+$/, '');
          setDocumentMeta({ ...documentMeta, title: cleanName });
          editor?.commands.setContent(content);
        }}
        onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
      />

      {/* Table Insertion Modal */}
      <TableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        editor={editor}
      />

      {/* Template Chooser */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={(tmpl) => handleNewDocument(tmpl)}
      />

      {/* Advanced Find & Replace */}
      <FindReplaceModal
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
        editor={editor}
      />

      {/* Insert Shapes, Charts, SmartArt, Equations, Symbols */}
      <InsertElementsModal
        isOpen={isInsertModalOpen}
        onClose={() => setIsInsertModalOpen(false)}
        editor={editor}
        defaultTab={insertModalTab as any}
      />

      {/* Mail Merge Wizard */}
      <MailMergeModal
        isOpen={isMailMergeOpen}
        onClose={() => setIsMailMergeOpen(false)}
        editor={editor}
        recipients={recipients}
        onUpdateRecipients={setRecipients}
      />

      {/* Citations & Bibliography */}
      <CitationsModal
        isOpen={isCitationsOpen}
        onClose={() => setIsCitationsOpen(false)}
        editor={editor}
        citations={citations}
        onUpdateCitations={setCitations}
      />

      {/* Password Protection */}
      <PasswordProtectModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        isProtected={documentMeta.isPasswordProtected}
        onSetPassword={(pwd) => {
          setDocumentMeta({ ...documentMeta, isPasswordProtected: true, passwordHash: pwd });
        }}
        onRemovePassword={() => {
          setDocumentMeta({ ...documentMeta, isPasswordProtected: false, passwordHash: undefined });
        }}
      />

      {/* Print Preview Dialog */}
      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        editor={editor}
        layoutSettings={layoutSettings}
        onUpdateLayout={(s) => setLayoutSettings({ ...layoutSettings, ...s })}
        documentMeta={documentMeta}
      />

      {/* Floating Dictation / Voice Typing Widget */}
      <VoiceTypingWidget
        isOpen={isVoiceTypingOpen}
        onClose={() => setIsVoiceTypingOpen(false)}
        editor={editor}
      />

      {/* Floating Read Aloud Audio Widget */}
      <ReadAloudWidget
        isOpen={isReadAloudOpen}
        onClose={() => setIsReadAloudOpen(false)}
        editor={editor}
      />

      {/* Touch-Optimized Mobile Toolbar */}
      <MobileToolbar
        editor={editor}
        marginPreset={layoutSettings.marginPreset}
        onChangeMarginPreset={(m) => setLayoutSettings({ ...layoutSettings, marginPreset: m })}
        onInsertTableModal={() => setIsTableModalOpen(true)}
      />

      {/* Word 365 Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        documentTitle={documentMeta.title}
      />
    </div>
  );
}
