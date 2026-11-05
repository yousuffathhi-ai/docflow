import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  FileText,
  CheckCircle2,
  BookOpen,
  Layout,
  Globe,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { DocumentStats, ViewMode } from '../types/document';

interface StatusBarProps {
  stats: DocumentStats;
  zoomLevel: number;
  onZoomChange: (newZoom: number) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  rulerVisible: boolean;
  onToggleRuler: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  accessibilityIssuesCount?: number;
  onOpenWordCountModal?: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  stats,
  zoomLevel,
  onZoomChange,
  viewMode,
  onChangeViewMode,
  isFullscreen,
  onToggleFullscreen,
  accessibilityIssuesCount = 0,
  onOpenWordCountModal,
}) => {
  const handleZoomIn = () => {
    onZoomChange(Math.min(150, zoomLevel + 10));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(50, zoomLevel - 10));
  };

  const handleResetZoom = () => {
    onZoomChange(100);
  };

  return (
    <footer className="no-print bg-[#F4F4F5] border-t border-[#D4D4D8] text-[#3F3F46] text-xs px-3 py-1 flex items-center justify-between gap-3 select-none h-6 shrink-0 z-20 font-medium">
      {/* ================= LEFT SECTION ================= */}
      <div className="flex items-center gap-3 overflow-x-auto py-0.5">
        {/* Page Number */}
        <span className="hover:bg-[#E4E4E7] px-1.5 py-0.5 rounded cursor-pointer whitespace-nowrap">
          Page 1 of {stats.estimatedPages}
        </span>

        {/* Word Count with modal trigger */}
        <button
          type="button"
          onClick={onOpenWordCountModal}
          className="hover:bg-[#E4E4E7] active:bg-[#D4D4D8] px-1.5 py-0.5 rounded cursor-pointer whitespace-nowrap tabular-nums font-semibold text-[#09090B] flex items-center gap-1 transition-colors"
          title="Click to view detailed Word Count and Section Breakdown"
        >
          <span>{stats.words.toLocaleString()} words</span>
        </button>

        {/* Accessibility Status Check */}
        <div className="hidden sm:flex items-center gap-1 hover:bg-[#E4E4E7] px-1.5 py-0.5 rounded cursor-pointer whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-black stroke-[2.2]" />
          <span>
            {accessibilityIssuesCount === 0 ? 'Accessibility: Good to go' : `Accessibility: ${accessibilityIssuesCount} check(s)`}
          </span>
        </div>
      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Focus Mode */}
        <button
          type="button"
          onClick={() => onChangeViewMode(viewMode === 'focus' ? 'page' : 'focus')}
          className={`px-1.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
            viewMode === 'focus' ? 'bg-black text-white' : 'hover:bg-[#E4E4E7]'
          }`}
          title="Focus Mode"
        >
          <Maximize2 className="w-3 h-3 stroke-[2.2]" />
          <span className="hidden md:inline">Focus</span>
        </button>

        {/* View Shortcuts Icons (Read Mode, Print Layout, Web Layout) */}
        <div className="flex items-center bg-[#E4E4E7] p-0.5 rounded border border-[#D4D4D8]">
          <button
            type="button"
            onClick={() => onChangeViewMode('read')}
            className={`p-1 rounded transition-colors ${
              viewMode === 'read' ? 'bg-white text-black shadow-xs font-bold' : 'text-neutral-600 hover:text-black'
            }`}
            title="Read Mode"
          >
            <BookOpen className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('page')}
            className={`p-1 rounded transition-colors ${
              viewMode === 'page' ? 'bg-white text-black shadow-xs font-bold' : 'text-neutral-600 hover:text-black'
            }`}
            title="Print Layout (Word 365 default)"
          >
            <Layout className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('continuous')}
            className={`p-1 rounded transition-colors ${
              viewMode === 'continuous' ? 'bg-white text-black shadow-xs font-bold' : 'text-neutral-600 hover:text-black'
            }`}
            title="Web Layout"
          >
            <Globe className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        </div>

        {/* Zoom Slider (50% to 150%) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 50}
            className="p-0.5 hover:bg-[#E4E4E7] disabled:opacity-30 rounded text-black font-bold"
            title="Zoom Out (-10%)"
          >
            <ZoomOut className="w-3 h-3 stroke-[2.2]" />
          </button>

          <input
            type="range"
            min="50"
            max="150"
            step="5"
            value={zoomLevel}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="w-16 sm:w-20 h-1 bg-[#D4D4D8] rounded-lg appearance-none cursor-pointer accent-black"
            title={`Zoom: ${zoomLevel}%`}
          />

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 150}
            className="p-0.5 hover:bg-[#E4E4E7] disabled:opacity-30 rounded text-black font-bold"
            title="Zoom In (+10%)"
          >
            <ZoomIn className="w-3 h-3 stroke-[2.2]" />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="w-9 text-right font-mono text-[11px] font-bold text-black hover:underline"
            title="Reset Zoom to 100%"
          >
            {zoomLevel}%
          </button>
        </div>
      </div>
    </footer>
  );
};
