import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import {
  Clipboard,
  Scissors,
  Copy,
  Paintbrush,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Highlighter,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListTree,
  Outdent,
  Indent,
  ArrowUpDown,
  Pilcrow,
  SplitSquareVertical,
  PaintBucket,
  Grid,
  Search,
  Replace,
  MousePointer,
  Mic,
  ChevronDown,
  Table as TableIcon,
  Image as ImageIcon,
  Shapes,
  BarChart3,
  Network,
  Sigma,
  Pi,
  FileSignature,
  FileText,
  Bookmark,
  Calendar,
  Columns,
  Minus,
  Sparkles,
  HelpCircle,
  Undo2,
  Redo2,
  Check,
  RemoveFormatting,
} from 'lucide-react';
import { DocumentMargin, ViewMode, PageLayoutSettings } from '../types/document';

interface RibbonToolbarProps {
  editor: Editor | null;
  onOpenFileMenu: () => void;
  rulerVisible: boolean;
  onToggleRuler: () => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  layoutSettings: PageLayoutSettings;
  onUpdateLayoutSettings: (settings: Partial<PageLayoutSettings>) => void;
  onInsertTableModal: () => void;
  onOpenFindReplace: () => void;
  onOpenInsertModal: (tab?: string) => void;
  onOpenMailMerge: () => void;
  onOpenCitations: () => void;
  onToggleNavigationPane: () => void;
  navigationPaneOpen: boolean;
  onToggleComments: () => void;
  commentsOpen: boolean;
  onToggleProofing: () => void;
  proofingOpen: boolean;
  onOpenVoiceTyping: () => void;
  onOpenReadAloud: () => void;
  showGridlines: boolean;
  onToggleGridlines: () => void;
  showFormattingMarks: boolean;
  onToggleFormattingMarks: () => void;
  formatPainterActive: boolean;
  onToggleFormatPainter: () => void;
  onTriggerAutoTOC: () => void;
  onSortSelectedLines: () => void;
  onChangeCase: (type: 'upper' | 'lower' | 'title' | 'sentence') => void;
}

type RibbonTab =
  | 'home'
  | 'insert'
  | 'design'
  | 'layout'
  | 'references'
  | 'mailings'
  | 'review'
  | 'view'
  | 'help';

const FONT_FAMILIES = [
  { label: 'Aptos Body (Word Default)', value: "'Aptos', 'Plus Jakarta Sans', system-ui, sans-serif" },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Calibri', value: 'Calibri, sans-serif' },
  { label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'EB Garamond', value: "'EB Garamond', Garamond, serif" },
  { label: 'JetBrains Mono', value: "'JetBrains Mono', Courier, monospace" },
  { label: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif" },
];

const FONT_SIZES = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];

// Grayscale Color Swatches
const FONT_COLORS = [
  { name: 'Black (#000000)', value: '#000000' },
  { name: 'Dark Charcoal (#27272A)', value: '#27272a' },
  { name: 'Neutral Gray (#52525B)', value: '#52525b' },
  { name: 'Muted Gray (#71717A)', value: '#71717a' },
  { name: 'Light Gray (#A1A1AA)', value: '#a1a1aa' },
  { name: 'Off White (#F4F4F5)', value: '#f4f4f5' },
];

const HIGHLIGHT_COLORS = [
  { name: 'No Color', value: '' },
  { name: 'Light Zinc (#F4F4F5)', value: '#f4f4f5' },
  { name: 'Medium Zinc (#E4E4E7)', value: '#e4e4e7' },
  { name: 'Dark Tint (#D4D4D8)', value: '#d4d4d8' },
  { name: 'Deep Gray (#A1A1AA)', value: '#a1a1aa' },
];

export const RibbonToolbar: React.FC<RibbonToolbarProps> = ({
  editor,
  onOpenFileMenu,
  rulerVisible,
  onToggleRuler,
  viewMode,
  onChangeViewMode,
  layoutSettings,
  onUpdateLayoutSettings,
  onInsertTableModal,
  onOpenFindReplace,
  onOpenInsertModal,
  onOpenMailMerge,
  onOpenCitations,
  onToggleNavigationPane,
  navigationPaneOpen,
  onToggleComments,
  commentsOpen,
  onToggleProofing,
  proofingOpen,
  onOpenVoiceTyping,
  onOpenReadAloud,
  showGridlines,
  onToggleGridlines,
  showFormattingMarks,
  onToggleFormattingMarks,
  formatPainterActive,
  onToggleFormatPainter,
  onTriggerAutoTOC,
  onSortSelectedLines,
  onChangeCase,
}) => {
  const [activeTab, setActiveTab] = useState<RibbonTab>('home');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showLineHeightPicker, setShowLineHeightPicker] = useState(false);
  const [showCasePicker, setShowCasePicker] = useState(false);

  const ribbonRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ribbonRef.current && !ribbonRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        setShowLineHeightPicker(false);
        setShowCasePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) return null;

  // Active state marks
  const isBold = editor.isActive('bold');
  const isItalic = editor.isActive('italic');
  const isUnderline = editor.isActive('underline');
  const isStrike = editor.isActive('strike');
  const isSubscript = editor.isActive('subscript');
  const isSuperscript = editor.isActive('superscript');
  const isBulletList = editor.isActive('bulletList');
  const isOrderedList = editor.isActive('orderedList');
  const isBlockquote = editor.isActive('blockquote');

  const alignLeft = editor.isActive({ textAlign: 'left' });
  const alignCenter = editor.isActive({ textAlign: 'center' });
  const alignRight = editor.isActive({ textAlign: 'right' });
  const alignJustify = editor.isActive({ textAlign: 'justify' });

  const currentFont = editor.getAttributes('textStyle').fontFamily || FONT_FAMILIES[0].value;
  const currentFontSize = (editor.getAttributes('textStyle').fontSize || '12pt').replace('pt', '');

  const handleFontSizeChange = (size: string) => {
    editor.chain().focus().setFontSize(`${size}pt`).run();
  };

  const handleFontSizeIncrement = (delta: number) => {
    const currentNum = parseInt(currentFontSize, 10) || 12;
    const newNum = Math.min(72, Math.max(6, currentNum + delta));
    editor.chain().focus().setFontSize(`${newNum}pt`).run();
  };

  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) editor.chain().focus().insertContent(text).run();
    } catch {
      editor.chain().focus();
    }
  };

  const handleCopyClick = () => {
    const selection = editor.state.selection;
    if (selection && !selection.empty) {
      const text = editor.state.doc.textBetween(selection.from, selection.to);
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  const handleCutClick = () => {
    handleCopyClick();
    editor.chain().focus().deleteSelection().run();
  };

  return (
    <div
      ref={ribbonRef}
      className="no-print bg-[#FAFAFA] border-b border-[#D4D4D8] text-black select-none hidden md:block shadow-xs"
    >
      {/* ================= RIBBON TABS STRIP (#F4F4F5 container) ================= */}
      <div className="flex items-center px-2 bg-[#F4F4F5] border-b border-[#D4D4D8] text-xs">
        {/* Special Solid Black "File" Tab (Backstage trigger) */}
        <button
          type="button"
          onClick={onOpenFileMenu}
          className="px-3.5 py-1.5 font-bold tracking-tight text-xs uppercase bg-[#18181B] text-white hover:bg-[#27272A] rounded-t-xs mr-1 shadow-xs"
        >
          File
        </button>

        {[
          { id: 'home', label: 'Home' },
          { id: 'insert', label: 'Insert' },
          { id: 'design', label: 'Design' },
          { id: 'layout', label: 'Layout' },
          { id: 'references', label: 'References' },
          { id: 'mailings', label: 'Mailings' },
          { id: 'review', label: 'Review' },
          { id: 'view', label: 'View' },
          { id: 'help', label: 'Help' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as RibbonTab)}
            className={`px-3 py-1.5 font-semibold text-xs border-b-2 transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-[#FAFAFA] text-black border-black font-bold shadow-xs'
                : 'border-transparent text-neutral-600 hover:text-black hover:bg-[#E4E4E7]/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= RIBBON BODY CANVAS (#FAFAFA) ================= */}
      <div className="px-3 py-1.5 flex items-stretch gap-2 overflow-x-auto min-h-[92px]">
        {/* ================= 1. HOME TAB ================= */}
        {activeTab === 'home' && (
          <>
            {/* GROUP 1: CLIPBOARD */}
            <div className="flex flex-col justify-between pr-2 border-r border-[#D4D4D8] shrink-0">
              <div className="flex items-center gap-1.5">
                {/* Large Paste Button */}
                <button
                  type="button"
                  onClick={handlePasteClick}
                  className="flex flex-col items-center justify-center px-2 py-1 hover:bg-[#E4E4E7] rounded transition-colors group"
                  title="Paste (Ctrl+V)"
                >
                  <Clipboard className="w-5 h-5 stroke-[2.2] text-black group-hover:scale-105" />
                  <span className="text-[10px] font-semibold mt-0.5">Paste</span>
                </button>

                {/* Vertical Cut, Copy, Format Painter */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={handleCutClick}
                    className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-[#E4E4E7] rounded text-[11px] font-medium"
                    title="Cut (Ctrl+X)"
                  >
                    <Scissors className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span className="hidden xl:inline">Cut</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyClick}
                    className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-[#E4E4E7] rounded text-[11px] font-medium"
                    title="Copy (Ctrl+C)"
                  >
                    <Copy className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span className="hidden xl:inline">Copy</span>
                  </button>
                  <button
                    type="button"
                    onClick={onToggleFormatPainter}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      formatPainterActive ? 'bg-black text-white' : 'hover:bg-[#E4E4E7]'
                    }`}
                    title="Format Painter"
                  >
                    <Paintbrush className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span className="hidden xl:inline">Format</span>
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-neutral-400 font-medium text-center pt-0.5">Clipboard</div>
            </div>

            {/* GROUP 2: FONT */}
            <div className="flex flex-col justify-between pr-2.5 border-r border-[#D4D4D8] shrink-0">
              <div className="space-y-1">
                {/* Row 1: Font Family, Size, Increase/Decrease, Clear */}
                <div className="flex items-center gap-1">
                  <select
                    value={currentFont}
                    onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                    className="bg-white border border-[#D4D4D8] hover:border-black rounded px-2 py-0.5 text-xs font-semibold focus:outline-none w-36 truncate cursor-pointer"
                    title="Font Family"
                  >
                    {FONT_FAMILIES.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={currentFontSize}
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                    className="bg-white border border-[#D4D4D8] hover:border-black rounded px-1 py-0.5 text-xs font-semibold focus:outline-none w-14 cursor-pointer"
                    title="Font Size"
                  >
                    {FONT_SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleFontSizeIncrement(1)}
                    className="p-1 hover:bg-[#E4E4E7] rounded font-bold text-xs"
                    title="Increase Font Size"
                  >
                    A^
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFontSizeIncrement(-1)}
                    className="p-1 hover:bg-[#E4E4E7] rounded font-bold text-xs"
                    title="Decrease Font Size"
                  >
                    Av
                  </button>

                  {/* Change Case Dropdown (Aa) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCasePicker(!showCasePicker)}
                      className="p-1 hover:bg-[#E4E4E7] rounded text-xs font-bold flex items-center"
                      title="Change Case (UPPERCASE, lowercase, Title Case)"
                    >
                      <span>Aa</span>
                      <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                    </button>
                    {showCasePicker && (
                      <div className="absolute top-full left-0 mt-1 bg-black text-white border border-neutral-700 rounded-md shadow-2xl py-1 z-50 w-36 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            onChangeCase('sentence');
                            setShowCasePicker(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-neutral-800"
                        >
                          Sentence case
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onChangeCase('lower');
                            setShowCasePicker(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-neutral-800"
                        >
                          lowercase
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onChangeCase('upper');
                            setShowCasePicker(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-neutral-800"
                        >
                          UPPERCASE
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onChangeCase('title');
                            setShowCasePicker(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-neutral-800"
                        >
                          Capitalize Each Word
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                    className="p-1 hover:bg-[#E4E4E7] rounded text-neutral-600 hover:text-black"
                    title="Clear All Formatting"
                  >
                    <RemoveFormatting className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>
                </div>

                {/* Row 2: B, I, U, ab (strike), x2, x^2, Highlight, Font Color */}
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`w-6 h-6 flex items-center justify-center rounded font-bold text-xs transition-colors ${
                      isBold ? 'bg-black text-white shadow-xs' : 'hover:bg-[#E4E4E7]'
                    }`}
                    title="Bold (Ctrl+B)"
                  >
                    <Bold className="w-3.5 h-3.5 stroke-[2.6]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`w-6 h-6 flex items-center justify-center rounded font-bold text-xs transition-colors ${
                      isItalic ? 'bg-black text-white shadow-xs' : 'hover:bg-[#E4E4E7]'
                    }`}
                    title="Italic (Ctrl+I)"
                  >
                    <Italic className="w-3.5 h-3.5 stroke-[2.6]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`w-6 h-6 flex items-center justify-center rounded font-bold text-xs transition-colors ${
                      isUnderline ? 'bg-black text-white shadow-xs' : 'hover:bg-[#E4E4E7]'
                    }`}
                    title="Underline (Ctrl+U)"
                  >
                    <UnderlineIcon className="w-3.5 h-3.5 stroke-[2.6]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`w-6 h-6 flex items-center justify-center rounded font-bold text-xs transition-colors ${
                      isStrike ? 'bg-black text-white shadow-xs' : 'hover:bg-[#E4E4E7]'
                    }`}
                    title="Strikethrough"
                  >
                    <Strikethrough className="w-3.5 h-3.5 stroke-[2.6]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-colors ${
                      isSubscript ? 'bg-black text-white shadow-xs' : 'hover:bg-[#E4E4E7]'
                    }`}
                    title="Subscript (x₂)"
                  >
                    <SubscriptIcon className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-colors ${
                      isSuperscript ? 'bg-black text-white shadow-xs' : 'hover:bg-[#E4E4E7]'
                    }`}
                    title="Superscript (x²)"
                  >
                    <SuperscriptIcon className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>

                  {/* Highlight Tone Picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowHighlightPicker(!showHighlightPicker);
                        setShowColorPicker(false);
                      }}
                      className="p-1 hover:bg-[#E4E4E7] rounded flex items-center"
                      title="Text Highlight Tone"
                    >
                      <Highlighter className="w-3.5 h-3.5 stroke-[2.2]" />
                      <ChevronDown className="w-2 h-2 ml-0.5" />
                    </button>
                    {showHighlightPicker && (
                      <div className="absolute top-full left-0 mt-1 bg-black text-white border border-neutral-700 rounded-md shadow-2xl p-2 z-50 w-36 space-y-1 text-xs">
                        {HIGHLIGHT_COLORS.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => {
                              if (c.value) {
                                editor.chain().focus().setHighlight({ color: c.value }).run();
                              } else {
                                editor.chain().focus().unsetHighlight().run();
                              }
                              setShowHighlightPicker(false);
                            }}
                            className="w-full flex items-center justify-between px-2 py-1 rounded text-neutral-200 hover:bg-neutral-800 text-[11px]"
                          >
                            <span>{c.name}</span>
                            <span className="w-3.5 h-3.5 rounded border border-neutral-600" style={{ backgroundColor: c.value || '#000' }} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Font Color Picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowColorPicker(!showColorPicker);
                        setShowHighlightPicker(false);
                      }}
                      className="p-1 hover:bg-[#E4E4E7] rounded flex items-center"
                      title="Font Color"
                    >
                      <Palette className="w-3.5 h-3.5 stroke-[2.2]" />
                      <ChevronDown className="w-2 h-2 ml-0.5" />
                    </button>
                    {showColorPicker && (
                      <div className="absolute top-full left-0 mt-1 bg-black text-white border border-neutral-700 rounded-md shadow-2xl p-2.5 z-50 w-36 grid grid-cols-3 gap-2">
                        {FONT_COLORS.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => {
                              editor.chain().focus().setColor(c.value).run();
                              setShowColorPicker(false);
                            }}
                            className="w-7 h-7 rounded border border-neutral-600 hover:scale-105"
                            style={{ backgroundColor: c.value }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-neutral-400 font-medium text-center pt-0.5">Font</div>
            </div>

            {/* GROUP 3: PARAGRAPH */}
            <div className="flex flex-col justify-between pr-2.5 border-r border-[#D4D4D8] shrink-0">
              <div className="space-y-1">
                {/* Row 1: Bullets, Numbers, Multilevel, Indent/Outdent, Sort, Show/Hide ¶ */}
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                      isBulletList ? 'bg-black text-white shadow-xs' : 'hover:bg-[#E4E4E7]'
                    }`}
                    title="Bullets"
                  >
                    <List className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                      isOrderedList ? 'bg-black text-white shadow-xs' : 'hover:bg-[#E4E4E7]'
                    }`}
                    title="Numbering"
                  >
                    <ListOrdered className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().liftListItem('listItem').run()}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#E4E4E7]"
                    title="Decrease Indent"
                  >
                    <Outdent className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#E4E4E7]"
                    title="Increase Indent"
                  >
                    <Indent className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>

                  <button
                    type="button"
                    onClick={onSortSelectedLines}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#E4E4E7]"
                    title="Sort (A-Z)"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>

                  <button
                    type="button"
                    onClick={onToggleFormattingMarks}
                    className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                      showFormattingMarks ? 'bg-black text-white shadow-xs' : 'hover:bg-[#E4E4E7]'
                    }`}
                    title="Show/Hide Paragraph Marks (¶)"
                  >
                    <Pilcrow className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>
                </div>

                {/* Row 2: Alignment, Line Spacing, Shading, Borders */}
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                      alignLeft ? 'bg-black text-white shadow-xs' : 'hover:bg-[#E4E4E7]'
                    }`}
                    title="Align Left (Ctrl+L)"
                  >
                    <AlignLeft className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                      alignCenter ? 'bg-black text-white shadow-xs' : 'hover:bg-[#E4E4E7]'
                    }`}
                    title="Align Center (Ctrl+E)"
                  >
                    <AlignCenter className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                      alignRight ? 'bg-black text-white shadow-xs' : 'hover:bg-[#E4E4E7]'
                    }`}
                    title="Align Right (Ctrl+R)"
                  >
                    <AlignRight className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                      alignJustify ? 'bg-black text-white shadow-xs' : 'hover:bg-[#E4E4E7]'
                    }`}
                    title="Justify (Ctrl+J)"
                  >
                    <AlignJustify className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>

                  {/* Line Spacing */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowLineHeightPicker(!showLineHeightPicker)}
                      className="p-1 hover:bg-[#E4E4E7] rounded flex items-center"
                      title="Line and Paragraph Spacing"
                    >
                      <SplitSquareVertical className="w-3.5 h-3.5 stroke-[2.2]" />
                      <ChevronDown className="w-2 h-2 ml-0.5" />
                    </button>
                    {showLineHeightPicker && (
                      <div className="absolute top-full left-0 mt-1 bg-black text-white border border-neutral-700 rounded-md shadow-2xl py-1 z-50 w-32 text-xs">
                        {['1.0', '1.15', '1.5', '2.0', '2.5', '3.0'].map((lh) => (
                          <button
                            key={lh}
                            type="button"
                            onClick={() => {
                              editor.chain().focus().setLineHeight(lh).run();
                              setShowLineHeightPicker(false);
                            }}
                            className="w-full text-left px-3 py-1 hover:bg-neutral-800 text-[11px]"
                          >
                            {lh} Line Spacing
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onInsertTableModal()}
                    className="p-1 hover:bg-[#E4E4E7] rounded"
                    title="Table Borders & Shading"
                  >
                    <Grid className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-neutral-400 font-medium text-center pt-0.5">Paragraph</div>
            </div>

            {/* GROUP 4: STYLES GALLERY CARDS */}
            <div className="flex flex-col justify-between pr-2.5 border-r border-[#D4D4D8] shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-[280px] lg:max-w-md py-0.5">
                {[
                  {
                    id: 'normal',
                    name: 'Normal',
                    preview: 'AaBbCc',
                    action: () => editor.chain().focus().setParagraph().run(),
                    isActive: editor.isActive('paragraph') && !editor.isActive('heading'),
                  },
                  {
                    id: 'h1',
                    name: 'Heading 1',
                    preview: 'AaBbCc',
                    bold: true,
                    action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
                    isActive: editor.isActive('heading', { level: 1 }),
                  },
                  {
                    id: 'h2',
                    name: 'Heading 2',
                    preview: 'AaBbCc',
                    bold: true,
                    action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                    isActive: editor.isActive('heading', { level: 2 }),
                  },
                  {
                    id: 'title',
                    name: 'Title',
                    preview: 'AaBbCc',
                    action: () => editor.chain().focus().toggleHeading({ level: 1 }).setFontSize('24pt').run(),
                    isActive: false,
                  },
                  {
                    id: 'subtitle',
                    name: 'Subtitle',
                    preview: 'AaBbCc',
                    action: () => editor.chain().focus().setParagraph().toggleItalic().run(),
                    isActive: false,
                  },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={st.action}
                    className={`flex flex-col items-center justify-center px-3 py-1.5 border rounded-sm transition-all shrink-0 ${
                      st.isActive
                        ? 'border-black bg-white shadow-xs ring-1 ring-black'
                        : 'border-[#D4D4D8] bg-white hover:border-black'
                    }`}
                  >
                    <span className={`text-xs ${st.bold ? 'font-bold' : ''}`}>{st.preview}</span>
                    <span className="text-[10px] font-medium text-neutral-500 mt-0.5">{st.name}</span>
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-neutral-400 font-medium text-center pt-0.5">Styles</div>
            </div>

            {/* GROUP 5: EDITING & VOICE */}
            <div className="flex flex-col justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={onOpenFindReplace}
                    className="flex items-center gap-1 px-2 py-0.5 hover:bg-[#E4E4E7] rounded text-[11px] font-medium"
                    title="Find"
                  >
                    <Search className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>Find</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenFindReplace}
                    className="flex items-center gap-1 px-2 py-0.5 hover:bg-[#E4E4E7] rounded text-[11px] font-medium"
                    title="Replace"
                  >
                    <Replace className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>Replace</span>
                  </button>
                </div>

                <div className="h-9 w-px bg-[#D4D4D8] mx-0.5" />

                {/* Word 365 Dictate Microphone Button */}
                <button
                  type="button"
                  onClick={onOpenVoiceTyping}
                  className="flex flex-col items-center justify-center px-2 py-1 hover:bg-[#E4E4E7] rounded transition-colors group"
                  title="Dictate (Speech to Text)"
                >
                  <Mic className="w-5 h-5 stroke-[2.2] text-black group-hover:scale-105" />
                  <span className="text-[10px] font-semibold mt-0.5">Dictate</span>
                </button>
              </div>
              <div className="text-[10px] text-neutral-400 font-medium text-center pt-0.5">Editing & Voice</div>
            </div>
          </>
        )}

        {/* ================= 2. INSERT TAB ================= */}
        {activeTab === 'insert' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onInsertTableModal}
              className="flex flex-col items-center px-2.5 py-1 hover:bg-[#E4E4E7] rounded"
            >
              <TableIcon className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">Table</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenInsertModal('shapes')}
              className="flex flex-col items-center px-2.5 py-1 hover:bg-[#E4E4E7] rounded"
            >
              <Shapes className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">Shapes</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenInsertModal('charts')}
              className="flex flex-col items-center px-2.5 py-1 hover:bg-[#E4E4E7] rounded"
            >
              <BarChart3 className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">Chart</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenInsertModal('smartart')}
              className="flex flex-col items-center px-2.5 py-1 hover:bg-[#E4E4E7] rounded"
            >
              <Network className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">SmartArt</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenInsertModal('equations')}
              className="flex flex-col items-center px-2.5 py-1 hover:bg-[#E4E4E7] rounded"
            >
              <Sigma className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">Equation</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenInsertModal('symbols')}
              className="flex flex-col items-center px-2.5 py-1 hover:bg-[#E4E4E7] rounded"
            >
              <Pi className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">Symbol</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenInsertModal('signature')}
              className="flex flex-col items-center px-2.5 py-1 hover:bg-[#E4E4E7] rounded"
            >
              <FileSignature className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">Signature</span>
            </button>
          </div>
        )}

        {/* ================= 3. DESIGN TAB ================= */}
        {activeTab === 'design' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onUpdateLayoutSettings({ watermark: layoutSettings.watermark ? '' : 'CONFIDENTIAL' })}
              className="flex flex-col items-center px-3 py-1 hover:bg-[#E4E4E7] rounded"
            >
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">
                Watermark: {layoutSettings.watermark ? 'Active' : 'None'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateLayoutSettings({ pageBorder: layoutSettings.pageBorder === 'box' ? 'none' : 'box' })}
              className="flex flex-col items-center px-3 py-1 hover:bg-[#E4E4E7] rounded"
            >
              <Grid className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">
                Page Border: {layoutSettings.pageBorder}
              </span>
            </button>
          </div>
        )}

        {/* ================= 4. LAYOUT TAB ================= */}
        {activeTab === 'layout' && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Margins</span>
              <select
                value={layoutSettings.marginPreset}
                onChange={(e) => onUpdateLayoutSettings({ marginPreset: e.target.value as any })}
                className="bg-white border border-[#D4D4D8] rounded px-2 py-0.5 text-xs font-semibold"
              >
                <option value="normal">Normal (1.0")</option>
                <option value="narrow">Narrow (0.5")</option>
                <option value="moderate">Moderate (0.75")</option>
                <option value="wide">Wide (1.5")</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Orientation</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onUpdateLayoutSettings({ isLandscape: false })}
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded border ${
                    !layoutSettings.isLandscape ? 'bg-black text-white border-black' : 'bg-white border-[#D4D4D8]'
                  }`}
                >
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateLayoutSettings({ isLandscape: true })}
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded border ${
                    layoutSettings.isLandscape ? 'bg-black text-white border-black' : 'bg-white border-[#D4D4D8]'
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Columns</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => onUpdateLayoutSettings({ columns: col as any })}
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded border ${
                      layoutSettings.columns === col ? 'bg-black text-white border-black' : 'bg-white border-[#D4D4D8]'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. REFERENCES TAB ================= */}
        {activeTab === 'references' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onTriggerAutoTOC}
              className="flex flex-col items-center px-3 py-1 hover:bg-[#E4E4E7] rounded"
            >
              <FileText className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">Table of Contents</span>
            </button>
            <button
              type="button"
              onClick={onOpenCitations}
              className="flex flex-col items-center px-3 py-1 hover:bg-[#E4E4E7] rounded"
            >
              <Bookmark className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">Citations & Bibliography</span>
            </button>
          </div>
        )}

        {/* ================= 6. MAILINGS TAB ================= */}
        {activeTab === 'mailings' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenMailMerge}
              className="flex flex-col items-center px-3 py-1 bg-black text-white rounded font-bold"
            >
              <FileText className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] mt-0.5">Start Mail Merge</span>
            </button>
          </div>
        )}

        {/* ================= 7. REVIEW TAB ================= */}
        {activeTab === 'review' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleProofing}
              className={`flex flex-col items-center px-3 py-1 rounded transition-colors ${
                proofingOpen ? 'bg-black text-white' : 'hover:bg-[#E4E4E7]'
              }`}
            >
              <Check className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">Editor & Proofing</span>
            </button>
            <button
              type="button"
              onClick={onToggleComments}
              className={`flex flex-col items-center px-3 py-1 rounded transition-colors ${
                commentsOpen ? 'bg-black text-white' : 'hover:bg-[#E4E4E7]'
              }`}
            >
              <FileText className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">Review Comments</span>
            </button>
            <button
              type="button"
              onClick={onOpenReadAloud}
              className="flex flex-col items-center px-3 py-1 hover:bg-[#E4E4E7] rounded"
            >
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">Read Aloud</span>
            </button>
          </div>
        )}

        {/* ================= 8. VIEW TAB ================= */}
        {activeTab === 'view' && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Views</span>
              <div className="flex gap-1">
                {[
                  { id: 'page', label: 'Print Layout' },
                  { id: 'continuous', label: 'Web Layout' },
                  { id: 'read', label: 'Read Mode' },
                  { id: 'focus', label: 'Focus' },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onChangeViewMode(v.id as ViewMode)}
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded border ${
                      viewMode === v.id ? 'bg-black text-white border-black' : 'bg-white border-[#D4D4D8]'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleRuler}
              className={`px-3 py-1.5 text-xs font-semibold rounded border ${
                rulerVisible ? 'bg-black text-white border-black' : 'bg-white border-[#D4D4D8]'
              }`}
            >
              Ruler
            </button>

            <button
              type="button"
              onClick={onToggleGridlines}
              className={`px-3 py-1.5 text-xs font-semibold rounded border ${
                showGridlines ? 'bg-black text-white border-black' : 'bg-white border-[#D4D4D8]'
              }`}
            >
              Gridlines
            </button>

            <button
              type="button"
              onClick={onToggleNavigationPane}
              className={`px-3 py-1.5 text-xs font-semibold rounded border ${
                navigationPaneOpen ? 'bg-black text-white border-black' : 'bg-white border-[#D4D4D8]'
              }`}
            >
              Navigation Pane
            </button>
          </div>
        )}

        {/* ================= 9. HELP TAB ================= */}
        {activeTab === 'help' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => alert('DocEditor Help Center:\n\nKeyboard Shortcuts:\nCtrl+B = Bold\nCtrl+I = Italic\nCtrl+U = Underline\nCtrl+Z = Undo\nCtrl+Y = Redo\nCtrl+P = Print / PDF\nCtrl+S = Save\n\nAll documents automatically saved to your browser local storage.')}
              className="flex flex-col items-center px-3 py-1 hover:bg-[#E4E4E7] rounded"
            >
              <HelpCircle className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold mt-0.5">Help & Shortcuts</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
