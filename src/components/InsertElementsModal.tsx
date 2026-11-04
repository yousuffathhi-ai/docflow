import React, { useState } from 'react';
import {
  X,
  Shapes,
  Image as ImageIcon,
  BarChart3,
  Network,
  Sigma,
  Pi,
  Check,
  Type,
  FileSignature,
} from 'lucide-react';
import { Editor } from '@tiptap/react';

interface InsertElementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  defaultTab?: 'shapes' | 'charts' | 'smartart' | 'equations' | 'symbols' | 'wordart' | 'signature';
}

export const InsertElementsModal: React.FC<InsertElementsModalProps> = ({
  isOpen,
  onClose,
  editor,
  defaultTab = 'shapes',
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  if (!isOpen || !editor) return null;

  const insertContent = (htmlSnippet: string) => {
    editor.chain().focus().insertContent(htmlSnippet).run();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-black border border-neutral-700 text-white rounded-lg shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Shapes className="w-5 h-5 text-white stroke-[2.2]" />
            <h3 className="font-bold text-base">Insert Visuals & Elements</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-neutral-800 text-xs font-bold text-neutral-400 bg-neutral-950 overflow-x-auto p-1 rounded">
          {[
            { id: 'shapes', label: 'Shapes' },
            { id: 'charts', label: 'Charts' },
            { id: 'smartart', label: 'SmartArt' },
            { id: 'equations', label: 'Math Equations' },
            { id: 'symbols', label: 'Symbols' },
            { id: 'wordart', label: 'WordArt' },
            { id: 'signature', label: 'Signature Line' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded transition-all shrink-0 ${
                activeTab === tab.id ? 'bg-white text-black shadow-xs font-extrabold' : 'hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-2 text-xs">
          {/* ================= 1. SHAPES ================= */}
          {activeTab === 'shapes' && (
            <div className="space-y-3">
              <span className="text-neutral-400 font-semibold text-xs block">
                Select a basic shape to insert directly into your document canvas (resizable & movable):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* 1. Rectangle */}
                <button
                  type="button"
                  onClick={() =>
                    insertContent(
                      `<div class="doc-shape-element" contenteditable="false" style="display: inline-block; resize: both; overflow: hidden; min-width: 60px; min-height: 40px; width: 220px; height: 110px; margin: 10px 12px; padding: 4px; border: 1.5px dashed #71717a; border-radius: 4px; background-color: #fafafa; vertical-align: middle; cursor: grab;" title="Rectangle - drag corner to resize"><svg width="100%" height="100%" viewBox="0 0 220 110" preserveAspectRatio="none" style="display: block; pointer-events: none;"><rect x="2" y="2" width="216" height="106" rx="4" fill="#f4f4f5" stroke="#000000" stroke-width="2.5" /></svg></div><p></p>`
                    )
                  }
                  className="p-3 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-center space-y-2 group transition-all"
                >
                  <div className="w-16 h-10 border-2 border-white mx-auto rounded-xs bg-neutral-800 group-hover:bg-white group-hover:border-black transition-colors" />
                  <span className="font-bold text-white block">Rectangle</span>
                </button>

                {/* 2. Circle */}
                <button
                  type="button"
                  onClick={() =>
                    insertContent(
                      `<div class="doc-shape-element" contenteditable="false" style="display: inline-block; resize: both; overflow: hidden; min-width: 60px; min-height: 60px; width: 130px; height: 130px; margin: 10px 12px; padding: 4px; border: 1.5px dashed #71717a; border-radius: 4px; background-color: #fafafa; vertical-align: middle; cursor: grab;" title="Circle - drag corner to resize"><svg width="100%" height="100%" viewBox="0 0 130 130" preserveAspectRatio="none" style="display: block; pointer-events: none;"><ellipse cx="65" cy="65" rx="60" ry="60" fill="#f4f4f5" stroke="#000000" stroke-width="2.5" /></svg></div><p></p>`
                    )
                  }
                  className="p-3 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-center space-y-2 group transition-all"
                >
                  <div className="w-12 h-12 border-2 border-white mx-auto rounded-full bg-neutral-800 group-hover:bg-white group-hover:border-black transition-colors" />
                  <span className="font-bold text-white block">Circle</span>
                </button>

                {/* 3. Line */}
                <button
                  type="button"
                  onClick={() =>
                    insertContent(
                      `<div class="doc-shape-element" contenteditable="false" style="display: inline-block; resize: horizontal; overflow: hidden; min-width: 60px; min-height: 24px; width: 240px; height: 26px; margin: 10px 12px; padding: 2px 4px; border: 1.5px dashed #71717a; border-radius: 2px; background-color: #fafafa; vertical-align: middle; cursor: grab;" title="Line - drag right edge to resize"><svg width="100%" height="100%" viewBox="0 0 240 26" preserveAspectRatio="none" style="display: block; pointer-events: none;"><line x1="4" y1="13" x2="236" y2="13" stroke="#000000" stroke-width="4" stroke-linecap="round" /></svg></div><p></p>`
                    )
                  }
                  className="p-3 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-center space-y-2 group transition-all"
                >
                  <div className="w-16 h-1 bg-white mx-auto my-4.5 rounded-full" />
                  <span className="font-bold text-white block">Line</span>
                </button>

                {/* 4. Star */}
                <button
                  type="button"
                  onClick={() =>
                    insertContent(
                      `<div class="doc-shape-element" contenteditable="false" style="display: inline-block; resize: both; overflow: hidden; min-width: 60px; min-height: 60px; width: 130px; height: 130px; margin: 10px 12px; padding: 4px; border: 1.5px dashed #71717a; border-radius: 4px; background-color: #fafafa; vertical-align: middle; cursor: grab;" title="Star - drag corner to resize"><svg width="100%" height="100%" viewBox="0 0 140 140" preserveAspectRatio="none" style="display: block; pointer-events: none;"><polygon points="70,8 88,48 132,48 96,74 110,116 70,90 30,116 44,74 8,48 52,48" fill="#f4f4f5" stroke="#000000" stroke-width="2.5" stroke-linejoin="round" /></svg></div><p></p>`
                    )
                  }
                  className="p-3 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-center space-y-2 group transition-all"
                >
                  <div className="w-12 h-12 mx-auto flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white stroke-black stroke-1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <span className="font-bold text-white block">Star</span>
                </button>

                {/* 5. Arrow */}
                <button
                  type="button"
                  onClick={() =>
                    insertContent(
                      `<div class="doc-shape-element" contenteditable="false" style="display: inline-block; resize: both; overflow: hidden; min-width: 60px; min-height: 35px; width: 190px; height: 80px; margin: 10px 12px; padding: 4px; border: 1.5px dashed #71717a; border-radius: 4px; background-color: #fafafa; vertical-align: middle; cursor: grab;" title="Arrow - drag corner to resize"><svg width="100%" height="100%" viewBox="0 0 190 80" preserveAspectRatio="none" style="display: block; pointer-events: none;"><polygon points="8,26 105,26 105,8 180,40 105,72 105,54 8,54" fill="#f4f4f5" stroke="#000000" stroke-width="2.5" stroke-linejoin="round" /></svg></div><p></p>`
                    )
                  }
                  className="p-3 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-center space-y-2 group transition-all"
                >
                  <div className="w-16 h-8 mx-auto flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-10 h-6 fill-white stroke-black stroke-1">
                      <polygon points="2 9 14 9 14 5 22 12 14 19 14 15 2 15" />
                    </svg>
                  </div>
                  <span className="font-bold text-white block">Arrow</span>
                </button>

                {/* Rounded Box */}
                <button
                  type="button"
                  onClick={() =>
                    insertContent(
                      `<div class="doc-shape-element" contenteditable="false" style="display: inline-block; resize: both; overflow: hidden; min-width: 60px; min-height: 40px; width: 220px; height: 110px; background-color: #fafafa; border: 1.5px dashed #71717a; border-radius: 18px; padding: 4px; vertical-align: middle; cursor: grab;"><svg width="100%" height="100%" viewBox="0 0 220 110" preserveAspectRatio="none" style="display: block; pointer-events: none;"><rect x="2" y="2" width="216" height="106" rx="20" fill="#f4f4f5" stroke="#000000" stroke-width="2.5" /></svg></div><p></p>`
                    )
                  }
                  className="p-3 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-center space-y-2 group transition-all"
                >
                  <div className="w-16 h-10 border-2 border-white mx-auto rounded-xl bg-neutral-800 group-hover:bg-white group-hover:border-black transition-colors" />
                  <span className="font-bold text-white block">Rounded Box</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= 2. CHARTS ================= */}
          {activeTab === 'charts' && (
            <div className="space-y-4">
              <span className="text-neutral-400 font-semibold text-xs block">
                Insert responsive SVG statistical charts directly into the document:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    insertContent(`
                    <div style="border: 1px solid #d4d4d8; padding: 16px; border-radius: 6px; margin: 16px 0; background: #fafafa; text-align: center;">
                      <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #000;">Quarterly Performance (Bar Chart)</h4>
                      <svg width="100%" height="160" viewBox="0 0 320 160" style="max-width: 380px; margin: auto; display: block;">
                        <rect x="20" y="30" width="45" height="110" fill="#000000" rx="2" />
                        <rect x="95" y="60" width="45" height="80" fill="#404040" rx="2" />
                        <rect x="170" y="20" width="45" height="120" fill="#737373" rx="2" />
                        <rect x="245" y="45" width="45" height="95" fill="#a3a3a3" rx="2" />
                        <text x="42" y="155" font-size="10" font-family="sans-serif" text-anchor="middle">Q1</text>
                        <text x="117" y="155" font-size="10" font-family="sans-serif" text-anchor="middle">Q2</text>
                        <text x="192" y="155" font-size="10" font-family="sans-serif" text-anchor="middle">Q3</text>
                        <text x="267" y="155" font-size="10" font-family="sans-serif" text-anchor="middle">Q4</text>
                      </svg>
                    </div><p></p>
                  `)
                  }
                  className="p-4 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-center space-y-2 group transition-all"
                >
                  <BarChart3 className="w-8 h-8 mx-auto text-white stroke-[2.2]" />
                  <span className="font-bold text-white block">Column / Bar Chart</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertContent(`
                    <div style="border: 1px solid #d4d4d8; padding: 16px; border-radius: 6px; margin: 16px 0; background: #fafafa; text-align: center;">
                      <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #000;">Annual Trajectory (Line Trend)</h4>
                      <svg width="100%" height="140" viewBox="0 0 300 140" style="max-width: 360px; margin: auto; display: block;">
                        <polyline fill="none" stroke="#000000" stroke-width="3" points="20,110 80,70 150,85 220,35 280,20" />
                        <circle cx="20" cy="110" r="4" fill="#000" />
                        <circle cx="80" cy="70" r="4" fill="#000" />
                        <circle cx="150" cy="85" r="4" fill="#000" />
                        <circle cx="220" cy="35" r="4" fill="#000" />
                        <circle cx="280" cy="20" r="4" fill="#000" />
                      </svg>
                    </div><p></p>
                  `)
                  }
                  className="p-4 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-center space-y-2 group transition-all"
                >
                  <div className="w-8 h-8 mx-auto flex items-center justify-center font-bold text-white text-lg">📈</div>
                  <span className="font-bold text-white block">Line Trend Chart</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertContent(`
                    <div style="border: 1px solid #d4d4d8; padding: 16px; border-radius: 6px; margin: 16px 0; background: #fafafa; text-align: center;">
                      <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #000;">Market Distribution (Pie Chart)</h4>
                      <svg width="120" height="120" viewBox="0 0 32 32" style="margin: auto; display: block; transform: rotate(-90deg);">
                        <circle r="16" cx="16" cy="16" fill="#e5e5e5" />
                        <circle r="8" cx="16" cy="16" fill="transparent" stroke="#000000" stroke-width="16" stroke-dasharray="60 100" />
                        <circle r="8" cx="16" cy="16" fill="transparent" stroke="#737373" stroke-width="16" stroke-dasharray="25 100" stroke-dashoffset="-60" />
                      </svg>
                    </div><p></p>
                  `)
                  }
                  className="p-4 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-center space-y-2 group transition-all"
                >
                  <div className="w-8 h-8 mx-auto flex items-center justify-center font-bold text-white text-lg">🥧</div>
                  <span className="font-bold text-white block">Pie Distribution</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= 3. SMARTART ================= */}
          {activeTab === 'smartart' && (
            <div className="space-y-3">
              <span className="text-neutral-400 font-semibold text-xs block">
                Insert structured workflow diagrams:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    insertContent(`
                    <div style="display: flex; gap: 8px; margin: 20px 0; align-items: center; justify-content: center; flex-wrap: wrap;">
                      <div style="background: #000; color: #fff; padding: 10px 18px; border-radius: 4px; font-weight: bold; text-align: center;">Step 1: Discover</div>
                      <div style="font-weight: bold; font-size: 16px;">➔</div>
                      <div style="background: #404040; color: #fff; padding: 10px 18px; border-radius: 4px; font-weight: bold; text-align: center;">Step 2: Prototype</div>
                      <div style="font-weight: bold; font-size: 16px;">➔</div>
                      <div style="background: #737373; color: #fff; padding: 10px 18px; border-radius: 4px; font-weight: bold; text-align: center;">Step 3: Deploy</div>
                    </div><p></p>
                  `)
                  }
                  className="p-4 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-left space-y-1.5 transition-all"
                >
                  <span className="font-bold text-white block">Sequential Process Flow</span>
                  <p className="text-neutral-400 text-[11px]">3-step horizontal chevron pipeline.</p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertContent(`
                    <div style="border: 2px solid #000; border-radius: 8px; padding: 16px; margin: 20px 0; background: #fff;">
                      <div style="font-weight: bold; font-size: 14px; text-align: center; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; margin-bottom: 12px;">Executive Leadership</div>
                      <div style="display: flex; gap: 12px; justify-content: space-around;">
                        <div style="border: 1px solid #000; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">VP Engineering</div>
                        <div style="border: 1px solid #000; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">VP Product</div>
                        <div style="border: 1px solid #000; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">VP Operations</div>
                      </div>
                    </div><p></p>
                  `)
                  }
                  className="p-4 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-left space-y-1.5 transition-all"
                >
                  <span className="font-bold text-white block">Hierarchy Org Chart</span>
                  <p className="text-neutral-400 text-[11px]">Tree-structured organizational block diagram.</p>
                </button>
              </div>
            </div>
          )}

          {/* ================= 4. EQUATIONS ================= */}
          {activeTab === 'equations' && (
            <div className="space-y-3">
              <span className="text-neutral-400 font-semibold text-xs block">
                Mathematical Equations & Scientific Formulas:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Quadratic Formula', code: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', rendered: 'x = (-b ± √(b² - 4ac)) / 2a' },
                  { title: 'Pythagorean Theorem', code: 'a^2 + b^2 = c^2', rendered: 'a² + b² = c²' },
                  { title: 'Calculus Definite Integral', code: '\\int_{a}^{b} f(x) dx = F(b) - F(a)', rendered: '∫ [a to b] f(x)dx = F(b) - F(a)' },
                  { title: 'Standard Deviation Formula', code: '\\sigma = \\sqrt{\\frac{\\sum (x_i - \\mu)^2}{N}}', rendered: 'σ = √( ∑(x - μ)² / N )' },
                  { title: 'Einstein Mass-Energy', code: 'E = mc^2', rendered: 'E = mc²' },
                  { title: 'Euler Identity', code: 'e^{i\\pi} + 1 = 0', rendered: 'e^(iπ) + 1 = 0' },
                ].map((eq, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      insertContent(
                        `<div style="font-family: 'JetBrains Mono', monospace; background: #f4f4f5; border: 1px solid #d4d4d8; padding: 12px 18px; border-radius: 6px; margin: 12px 0; font-size: 14px; font-weight: bold; text-align: center;">${eq.rendered}</div><p></p>`
                      )
                    }
                    className="p-3 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-left space-y-1 transition-all"
                  >
                    <span className="font-bold text-white block">{eq.title}</span>
                    <span className="font-mono text-neutral-300 text-xs block bg-black p-1.5 rounded">{eq.rendered}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= 5. SYMBOLS ================= */}
          {activeTab === 'symbols' && (
            <div className="space-y-3">
              <span className="text-neutral-400 font-semibold text-xs block">
                Click any symbol to insert at current cursor:
              </span>
              <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
                {[
                  '©', '®', '™', '§', '¶', '•', '—', '–', '…', '‰', '€', '£', '¥', '₹', '¢', '$',
                  '±', '≠', '≤', '≥', '≈', '÷', '×', '√', '∞', '∑', '∏', 'π', 'Ω', 'μ', 'λ', 'θ',
                  '←', '↑', '→', '↓', '↔', '↕', '⇄', '⇒', '✓', '✗', '★', '◆', '▲', '▼', '♥', '♦'
                ].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => insertContent(sym)}
                    className="w-10 h-10 bg-neutral-900 hover:bg-white hover:text-black border border-neutral-800 rounded flex items-center justify-center font-bold text-base transition-colors"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= 6. WORDART ================= */}
          {activeTab === 'wordart' && (
            <div className="space-y-3">
              <span className="text-neutral-400 font-semibold text-xs block">
                Stylized typographic banners:
              </span>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    insertContent(
                      `<h1 style="font-size: 2.8rem; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; color: #000; text-shadow: 2px 2px 0px #d4d4d8; margin: 24px 0;">SPECTACULAR HEADLINE</h1><p></p>`
                    )
                  }
                  className="w-full p-4 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-left font-black tracking-tight text-xl text-white uppercase"
                >
                  Solid 3D Drop Shadow
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertContent(
                      `<h1 style="font-size: 2.5rem; font-weight: 800; -webkit-text-stroke: 1.5px #000000; color: transparent; letter-spacing: 2px; margin: 24px 0;">OUTLINED BOLD TEXT</h1><p></p>`
                    )
                  }
                  className="w-full p-4 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-left font-extrabold text-xl text-white tracking-widest"
                >
                  Hollow Outlined Banner
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertContent(
                      `<p><span style="float: left; font-size: 3.8rem; line-height: 0.8; padding-top: 4px; padding-right: 8px; padding-bottom: 2px; font-weight: bold; color: #000000; font-family: serif;">T</span>his opening paragraph features an editorial drop cap formatting. The initial letter spans multiple lines to create a distinguished literary aesthetic.</p>`
                    )
                  }
                  className="w-full p-4 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-left font-semibold text-sm text-white"
                >
                  Editorial Drop Cap Paragraph
                </button>
              </div>
            </div>
          )}

          {/* ================= 7. SIGNATURE LINE ================= */}
          {activeTab === 'signature' && (
            <div className="space-y-3">
              <span className="text-neutral-400 font-semibold text-xs block">
                Insert a formal signature block:
              </span>
              <button
                type="button"
                onClick={() =>
                  insertContent(`
                  <div style="margin-top: 40px; margin-bottom: 20px; width: 280px;">
                    <div style="border-bottom: 1.5px solid #000000; width: 100%; height: 50px;"></div>
                    <div style="font-weight: bold; font-size: 13px; margin-top: 6px;">Authorized Signatory</div>
                    <div style="font-size: 11px; color: #737373;">Date: ________________________</div>
                  </div><p></p>
                `)
                }
                className="w-full p-4 bg-neutral-900 border border-neutral-800 rounded hover:border-white text-left space-y-2 group transition-all"
              >
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <FileSignature className="w-5 h-5 stroke-[2.2]" />
                  <span>Standard Legal Signature Line</span>
                </div>
                <div className="w-48 border-b-2 border-white pt-6" />
                <span className="text-xs text-neutral-400 block">Authorized Representative Signature & Date</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
