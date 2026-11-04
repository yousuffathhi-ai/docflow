import React, { useState } from 'react';
import {
  Save,
  Undo2,
  Redo2,
  Search,
  MessageSquare,
  ChevronDown,
  Share2,
  FileText,
  Printer,
  Download,
  Check,
  Edit3,
  Eye,
  Sliders,
  X,
  Menu,
} from 'lucide-react';
import { Editor } from '@tiptap/react';

interface HeaderProps {
  editor: Editor | null;
  documentTitle: string;
  onTitleChange: (newTitle: string) => void;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  autoSaveEnabled: boolean;
  onToggleAutoSave: () => void;
  onManualSave: () => void;
  editingMode: 'editing' | 'reviewing' | 'viewing';
  onChangeEditingMode: (mode: 'editing' | 'reviewing' | 'viewing') => void;
  onToggleComments: () => void;
  commentsCount: number;
  onOpenShareModal: () => void;
  onTriggerPrint: () => void;
  onSearchFocus: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  editor,
  documentTitle,
  onTitleChange,
  saveStatus,
  autoSaveEnabled,
  onToggleAutoSave,
  onManualSave,
  editingMode,
  onChangeEditingMode,
  onToggleComments,
  commentsCount,
  onOpenShareModal,
  onTriggerPrint,
  onSearchFocus,
  onSearchChange,
  searchQuery,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="no-print bg-[#18181B] text-white border-b border-[#27272A] select-none h-11 px-3 flex items-center justify-between gap-3 shrink-0 z-30">
      {/* ================= LEFT SECTION ================= */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Word 365 AutoSave Toggle */}
        <div className="flex items-center gap-1.5 mr-1 bg-[#27272A] py-1 px-2 rounded-full border border-neutral-700">
          <span className="text-[11px] font-semibold text-neutral-300 hidden sm:inline">AutoSave</span>
          <button
            type="button"
            onClick={onToggleAutoSave}
            role="switch"
            aria-checked={autoSaveEnabled}
            className={`w-7 h-4 rounded-full transition-colors relative flex items-center ${
              autoSaveEnabled ? 'bg-white' : 'bg-neutral-600'
            }`}
            title={`AutoSave is ${autoSaveEnabled ? 'ON' : 'OFF'}`}
          >
            <div
              className={`w-3 h-3 rounded-full transition-transform ${
                autoSaveEnabled ? 'translate-x-3.5 bg-black' : 'translate-x-0.5 bg-white'
              }`}
            />
          </button>
        </div>

        {/* Quick Access Toolbar Icons */}
        <button
          type="button"
          onClick={onManualSave}
          className="p-1.5 text-neutral-300 hover:text-white hover:bg-[#27272A] rounded transition-colors"
          title="Save (Ctrl+S)"
        >
          <Save className="w-4 h-4 stroke-[2.2]" />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
          className="p-1.5 text-neutral-300 hover:text-white hover:bg-[#27272A] disabled:opacity-30 rounded transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4 stroke-[2.2]" />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
          className="p-1.5 text-neutral-300 hover:text-white hover:bg-[#27272A] disabled:opacity-30 rounded transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4 stroke-[2.2]" />
        </button>

        <div className="h-4 w-px bg-neutral-700 mx-1 hidden sm:block" />

        {/* Document Title (e.g. "Document1 - Word") */}
        <div className="flex items-center gap-1.5 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditingTitle(false);
              }}
              autoFocus
              className="bg-[#27272A] text-white text-xs font-semibold px-2 py-0.5 rounded border border-white outline-none w-44 sm:w-56"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              className="group flex items-center gap-1.5 text-xs font-semibold text-neutral-200 hover:text-white hover:bg-[#27272A] px-2 py-1 rounded transition-colors truncate max-w-[140px] sm:max-w-[220px] text-left"
              title="Click to rename document"
            >
              <span className="truncate">{documentTitle || 'Document1 - Word'}</span>
              <span className="text-[10px] text-neutral-400 font-normal hidden md:inline">- Saved</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= CENTER SECTION: WORD 365 SEARCH BAR ================= */}
      <div className="flex-1 max-w-md hidden md:flex items-center justify-center">
        <div className="w-full relative flex items-center bg-[#27272A] hover:bg-[#323236] transition-colors rounded-md px-2.5 py-1 text-xs border border-neutral-700/80 focus-within:border-white focus-within:bg-[#18181B]">
          <Search className="w-3.5 h-3.5 text-neutral-400 mr-2 shrink-0 stroke-[2.2]" />
          <input
            type="text"
            placeholder="Search (Alt+Q)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={onSearchFocus}
            className="w-full bg-transparent text-white placeholder:text-neutral-400 focus:outline-none text-xs font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-neutral-400 hover:text-white text-xs ml-1"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ================= RIGHT SECTION: COMMENTS, EDITING MODE, SHARE ================= */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Comments Button */}
        <button
          type="button"
          onClick={onToggleComments}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-[#27272A] rounded transition-colors"
          title="Comments"
        >
          <MessageSquare className="w-3.5 h-3.5 stroke-[2.2]" />
          <span className="hidden sm:inline">Comments</span>
          {commentsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-black font-extrabold text-[10px] flex items-center justify-center">
              {commentsCount}
            </span>
          )}
        </button>

        {/* Editing Mode Dropdown ("Editing ▼") */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setShowModeDropdown(!showModeDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-neutral-200 hover:text-white hover:bg-[#27272A] rounded border border-neutral-700 transition-colors"
          >
            {editingMode === 'editing' && <Edit3 className="w-3 h-3 stroke-[2.2]" />}
            {editingMode === 'reviewing' && <Check className="w-3 h-3 stroke-[2.2]" />}
            {editingMode === 'viewing' && <Eye className="w-3 h-3 stroke-[2.2]" />}
            <span className="capitalize">{editingMode}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400 stroke-[2.2]" />
          </button>

          {showModeDropdown && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowModeDropdown(false)}
              />
              <div className="absolute right-0 mt-1 w-44 bg-[#18181B] border border-neutral-700 rounded-md shadow-2xl py-1 z-40 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onChangeEditingMode('editing');
                    setShowModeDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#27272A] ${
                    editingMode === 'editing' ? 'font-bold text-white bg-[#27272A]' : 'text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editing</span>
                  </div>
                  {editingMode === 'editing' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeEditingMode('reviewing');
                    setShowModeDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#27272A] ${
                    editingMode === 'reviewing' ? 'font-bold text-white bg-[#27272A]' : 'text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5" />
                    <span>Reviewing</span>
                  </div>
                  {editingMode === 'reviewing' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeEditingMode('viewing');
                    setShowModeDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#27272A] ${
                    editingMode === 'viewing' ? 'font-bold text-white bg-[#27272A]' : 'text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Viewing</span>
                  </div>
                  {editingMode === 'viewing' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* High-Contrast Matte Share Button (Solid white with black text & border) */}
        <button
          type="button"
          onClick={onOpenShareModal}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-white text-black hover:bg-neutral-200 border border-neutral-300 rounded shadow-xs transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 stroke-[2.4]" />
          <span>Share</span>
        </button>

        {/* Print Shortcut */}
        <button
          type="button"
          onClick={onTriggerPrint}
          className="p-1.5 text-neutral-300 hover:text-white hover:bg-[#27272A] rounded transition-colors hidden sm:block"
          title="Print or Save PDF (Ctrl+P)"
        >
          <Printer className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>
    </header>
  );
};
