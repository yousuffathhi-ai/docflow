import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  MoreHorizontal,
  X,
  Quote,
  Minus,
  Table as TableIcon,
  Undo2,
  Redo2,
} from 'lucide-react';
import { DocumentMargin } from '../types/document';

interface MobileToolbarProps {
  editor: Editor | null;
  marginPreset: DocumentMargin;
  onChangeMarginPreset: (margin: DocumentMargin) => void;
  onInsertTableModal: () => void;
}

const TEXT_COLORS = [
  { name: 'Pure Black', value: '#000000' },
  { name: 'Dark Gray', value: '#404040' },
  { name: 'Neutral Gray', value: '#737373' },
  { name: 'Light Gray', value: '#a3a3a3' },
  { name: 'Off White', value: '#f4f4f5' },
];

const HIGHLIGHT_COLORS = [
  { name: 'None', value: '' },
  { name: 'Light', value: '#f4f4f5' },
  { name: 'Gray', value: '#e4e4e7' },
  { name: 'Medium', value: '#d4d4d8' },
];

export const MobileToolbar: React.FC<MobileToolbarProps> = ({
  editor,
  marginPreset,
  onChangeMarginPreset,
  onInsertTableModal,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (!editor) return null;

  const isBold = editor.isActive('bold');
  const isItalic = editor.isActive('italic');
  const isUnderline = editor.isActive('underline');
  const isBulletList = editor.isActive('bulletList');
  const isOrderedList = editor.isActive('orderedList');

  return (
    <>
      {/* Pinned Bottom Mobile Bar */}
      <div className="no-print md:hidden fixed bottom-8 left-0 right-0 z-30 bg-black border-t border-neutral-800 px-3 py-1.5 flex items-center justify-around shadow-2xl">
        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="min-w-[42px] min-h-[42px] flex items-center justify-center rounded text-white disabled:opacity-30 active:bg-neutral-800"
          title="Undo"
        >
          <Undo2 className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`min-w-[42px] min-h-[42px] flex items-center justify-center rounded transition-all ${
            isBold ? 'bg-white text-black' : 'text-white active:bg-neutral-800'
          }`}
          title="Bold"
        >
          <Bold className="w-5 h-5 stroke-[2.4]" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`min-w-[42px] min-h-[42px] flex items-center justify-center rounded transition-all ${
            isItalic ? 'bg-white text-black' : 'text-white active:bg-neutral-800'
          }`}
          title="Italic"
        >
          <Italic className="w-5 h-5 stroke-[2.4]" />
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`min-w-[42px] min-h-[42px] flex items-center justify-center rounded transition-all ${
            isUnderline ? 'bg-white text-black' : 'text-white active:bg-neutral-800'
          }`}
          title="Underline"
        >
          <UnderlineIcon className="w-5 h-5 stroke-[2.4]" />
        </button>

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`min-w-[42px] min-h-[42px] flex items-center justify-center rounded transition-all ${
            isBulletList ? 'bg-white text-black' : 'text-white active:bg-neutral-800'
          }`}
          title="Bullet List"
        >
          <List className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* More Tools Drawer Button */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="min-w-[42px] min-h-[42px] flex items-center justify-center rounded bg-neutral-900 text-white border border-neutral-700 active:bg-neutral-800"
          title="More Tools"
        >
          <MoreHorizontal className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>

      {/* Expandable "More Tools" Bottom Drawer */}
      {isDrawerOpen && (
        <div className="no-print md:hidden fixed inset-0 z-50 bg-black/75 flex flex-col justify-end">
          <div
            className="fixed inset-0"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative bg-black border-t border-neutral-800 rounded-t-xl p-4 max-h-[80vh] overflow-y-auto space-y-4 shadow-2xl text-white">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="font-bold text-sm text-white">Formatting Options</span>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* Headings */}
            <div>
              <div className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">
                Paragraph Style
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setParagraph().run();
                    setIsDrawerOpen(false);
                  }}
                  className="py-2.5 px-2 bg-neutral-900 border border-neutral-800 rounded text-xs font-bold text-center hover:bg-neutral-800"
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                    setIsDrawerOpen(false);
                  }}
                  className="py-2.5 px-2 bg-neutral-900 border border-neutral-800 rounded text-xs font-bold text-center hover:bg-neutral-800"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                    setIsDrawerOpen(false);
                  }}
                  className="py-2.5 px-2 bg-neutral-900 border border-neutral-800 rounded text-xs font-bold text-center hover:bg-neutral-800"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 3 }).run();
                    setIsDrawerOpen(false);
                  }}
                  className="py-2.5 px-2 bg-neutral-900 border border-neutral-800 rounded text-xs font-bold text-center hover:bg-neutral-800"
                >
                  H3
                </button>
              </div>
            </div>

            {/* Alignment */}
            <div>
              <div className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">
                Text Alignment
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  className={`min-h-[44px] flex items-center justify-center rounded border border-neutral-800 ${
                    editor.isActive({ textAlign: 'left' }) ? 'bg-white text-black' : 'bg-neutral-900 text-white'
                  }`}
                >
                  <AlignLeft className="w-5 h-5 stroke-[2.2]" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  className={`min-h-[44px] flex items-center justify-center rounded border border-neutral-800 ${
                    editor.isActive({ textAlign: 'center' }) ? 'bg-white text-black' : 'bg-neutral-900 text-white'
                  }`}
                >
                  <AlignCenter className="w-5 h-5 stroke-[2.2]" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  className={`min-h-[44px] flex items-center justify-center rounded border border-neutral-800 ${
                    editor.isActive({ textAlign: 'right' }) ? 'bg-white text-black' : 'bg-neutral-900 text-white'
                  }`}
                >
                  <AlignRight className="w-5 h-5 stroke-[2.2]" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`min-h-[44px] flex items-center justify-center rounded border border-neutral-800 ${
                    isOrderedList ? 'bg-white text-black' : 'bg-neutral-900 text-white'
                  }`}
                >
                  <ListOrdered className="w-5 h-5 stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* Colors */}
            <div>
              <div className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">
                Text Shades
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      editor.chain().focus().setColor(c.value).run();
                      setIsDrawerOpen(false);
                    }}
                    className="w-10 h-10 rounded-full border-2 border-neutral-600 shrink-0"
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <div className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">
                Highlight Tint
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
                      setIsDrawerOpen(false);
                    }}
                    className="w-10 h-10 rounded-full border-2 border-neutral-600 shrink-0 flex items-center justify-center text-xs font-bold text-black"
                    style={{ backgroundColor: c.value || '#000000' }}
                  >
                    {!c.value && <span className="text-white">None</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Insert Elements */}
            <div>
              <div className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">
                Insert Elements
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onInsertTableModal();
                  }}
                  className="min-h-[44px] flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 rounded text-xs font-bold"
                >
                  <TableIcon className="w-4.5 h-4.5 stroke-[2.2]" />
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleBlockquote().run();
                    setIsDrawerOpen(false);
                  }}
                  className="min-h-[44px] flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 rounded text-xs font-bold"
                >
                  <Quote className="w-4.5 h-4.5 stroke-[2.2]" />
                  <span>Quote</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setHorizontalRule().run();
                    setIsDrawerOpen(false);
                  }}
                  className="min-h-[44px] flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 rounded text-xs font-bold"
                >
                  <Minus className="w-4.5 h-4.5 stroke-[2.2]" />
                  <span>Divider</span>
                </button>
              </div>
            </div>

            {/* Margin Options */}
            <div>
              <div className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">
                Page Margins
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'narrow', 'wide'] as DocumentMargin[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      onChangeMarginPreset(m);
                      setIsDrawerOpen(false);
                    }}
                    className={`py-2 px-3 rounded text-xs capitalize font-bold border border-neutral-800 ${
                      marginPreset === m ? 'bg-white text-black' : 'bg-neutral-900 text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
