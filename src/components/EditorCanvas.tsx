import React from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import { RulerBar } from './RulerBar';
import { PageLayoutSettings, ViewMode } from '../types/document';

interface EditorCanvasProps {
  editor: Editor | null;
  rulerVisible: boolean;
  viewMode: ViewMode;
  zoomLevel: number;
  layoutSettings: PageLayoutSettings;
  showGridlines: boolean;
  showFormattingMarks: boolean;
  isReadOnly?: boolean;
  onSelectImage?: (img: HTMLImageElement) => void;
  onExitFocusMode?: () => void;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  editor,
  rulerVisible,
  viewMode,
  zoomLevel,
  layoutSettings,
  showGridlines,
  showFormattingMarks,
  isReadOnly = false,
  onSelectImage,
  onExitFocusMode,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewMode === 'focus' && onExitFocusMode) {
        onExitFocusMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, onExitFocusMode]);

  if (!editor) return null;

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === 'IMG') {
      onSelectImage?.(target as HTMLImageElement);
    }
  };

  // Standard Word 365 1-inch margins
  let marginPadding = 'px-12 py-14 sm:px-16 sm:py-20'; // Normal 1"
  if (layoutSettings.marginPreset === 'narrow') {
    marginPadding = 'px-6 py-8 sm:px-8 sm:py-10'; // 0.5"
  } else if (layoutSettings.marginPreset === 'moderate') {
    marginPadding = 'px-8 py-10 sm:px-12 sm:py-14'; // 0.75"
  } else if (layoutSettings.marginPreset === 'wide') {
    marginPadding = 'px-14 py-16 sm:px-24 sm:py-24'; // 1.5"
  }

  // Exact Word 365 Page Dimensions: 816px width x 1056px height (standard 8.5x11 / A4 printable ratio)
  const paperDimensions = layoutSettings.isLandscape
    ? 'max-w-[1056px] min-h-[816px]'
    : 'max-w-[816px] min-h-[1056px]';

  // Multi-column styling
  const columnStyles: React.CSSProperties = {
    columnCount: layoutSettings.columns,
    columnGap: '2.5rem',
    columnRule: layoutSettings.columns > 1 ? '1px solid #D4D4D8' : 'none',
  };

  return (
    <main
      onClick={handleContainerClick}
      className={`flex-1 overflow-y-auto overflow-x-auto relative flex flex-col items-center py-6 px-2 sm:px-6 transition-colors ${
        viewMode === 'focus' ? 'bg-[#18181B] py-12' : 'bg-[#E4E4E7]'
      }`}
      style={{
        backgroundImage:
          viewMode === 'focus'
            ? 'none'
            : showGridlines
            ? 'linear-gradient(to right, #D4D4D8 1px, transparent 1px), linear-gradient(to bottom, #D4D4D8 1px, transparent 1px)'
            : 'none',
        backgroundSize: showGridlines ? '24px 24px' : 'auto',
      }}
    >
      {/* Floating Focus Mode Banner */}
      {viewMode === 'focus' && onExitFocusMode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-1.5 bg-zinc-900 text-white rounded-full shadow-2xl border border-zinc-700 text-xs font-semibold select-none animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>Focus Mode Active</span>
          <button
            type="button"
            onClick={onExitFocusMode}
            className="ml-2 px-2.5 py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold transition-colors border border-zinc-600"
          >
            Exit (Esc)
          </button>
        </div>
      )}

      {/* Word 365 Horizontal Top Ruler Bar */}
      {rulerVisible && viewMode !== 'focus' && (
        <div className="w-full max-w-[816px] mb-2 hidden md:block">
          <RulerBar marginPreset={layoutSettings.marginPreset} isLandscape={layoutSettings.isLandscape} />
        </div>
      )}

      {/* Read-Only Status Banner if active */}
      {isReadOnly && (
        <div className="mb-3 px-4 py-1.5 bg-[#18181B] text-white rounded text-xs font-semibold flex items-center gap-2 border border-neutral-700">
          <span>🔒 Viewing Mode: This document is read-only. Editing is restricted.</span>
        </div>
      )}

      {/* Scalable Paper Canvas Container */}
      <div
        className="w-full flex justify-center transition-transform origin-top pb-16"
        style={{
          transform: `scale(${zoomLevel / 100})`,
        }}
      >
        {/* Solid White A4 Sheet with shadow-md and #D4D4D8 borders */}
        <div
          className={`print-page w-full ${paperDimensions} text-[#09090B] bg-white shadow-md border border-[#D4D4D8] rounded-xs transition-all relative ${marginPadding} ${
            showFormattingMarks ? 'show-formatting-marks' : ''
          }`}
          style={{
            backgroundColor: layoutSettings.pageColor || '#ffffff',
            direction: layoutSettings.textDirection || 'ltr',
          }}
        >
          {/* Diagonal Watermark if active */}
          {layoutSettings.watermark && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
              aria-hidden="true"
            >
              <span className="text-neutral-200 font-black text-7xl md:text-8xl tracking-widest uppercase transform -rotate-45 opacity-60">
                {layoutSettings.watermark}
              </span>
            </div>
          )}

          {/* Word 365 Header Margin area */}
          {layoutSettings.headerText && (
            <div className="text-right text-[10px] text-neutral-400 border-b border-[#E4E4E7] pb-2 mb-6">
              {layoutSettings.headerText}
            </div>
          )}

          {/* ProseMirror Content Canvas */}
          <div style={columnStyles} className="relative z-10">
            <EditorContent editor={editor} />
          </div>

          {/* Word 365 Footer Margin area */}
          {(layoutSettings.footerText || layoutSettings.showPageNumbers) && (
            <div className="flex justify-between items-center text-[10px] text-neutral-400 border-t border-[#E4E4E7] pt-3 mt-10">
              <span>{layoutSettings.footerText}</span>
              {layoutSettings.showPageNumbers && <span>Page 1 of 1</span>}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
