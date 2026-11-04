import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Volume2, X, FastForward } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface ReadAloudWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

export const ReadAloudWidget: React.FC<ReadAloudWidgetProps> = ({
  isOpen,
  onClose,
  editor,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0);

  useEffect(() => {
    if (!isOpen) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [isOpen]);

  if (!isOpen || !editor) return null;

  const handlePlay = () => {
    if (!window.speechSynthesis) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    // Check if user has text selected
    let textToSpeak = '';
    const selection = editor.state.selection;
    if (selection && !selection.empty) {
      textToSpeak = editor.state.doc.textBetween(selection.from, selection.to);
    } else {
      textToSpeak = editor.getText();
    }

    if (!textToSpeak.trim()) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (window.speechSynthesis && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="fixed bottom-14 right-6 z-40 bg-black text-white border border-neutral-700 rounded-lg shadow-2xl p-4 w-72 select-none animate-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-white stroke-[2.2]" />
          <span className="font-bold text-xs uppercase tracking-wide">
            Read Aloud & Immersive Audio
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            handleStop();
            onClose();
          }}
          className="text-neutral-400 hover:text-white p-0.5 rounded"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      <div className="py-3 flex items-center justify-center gap-3">
        {isPlaying ? (
          <button
            type="button"
            onClick={handlePause}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold hover:bg-neutral-200 transition-colors"
            title="Pause Reading"
          >
            <Pause className="w-5 h-5 stroke-[2.4]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold hover:bg-neutral-200 transition-colors"
            title="Play / Resume Reading"
          >
            <Play className="w-5 h-5 ml-0.5 stroke-[2.4]" />
          </button>
        )}

        <button
          type="button"
          onClick={handleStop}
          className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded border border-neutral-700"
          title="Stop Reading"
        >
          <Square className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* Speed Rate */}
        <select
          value={rate}
          onChange={(e) => {
            const newRate = parseFloat(e.target.value);
            setRate(newRate);
            if (isPlaying) {
              handleStop();
            }
          }}
          className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-white font-bold"
          title="Speech Speed Rate"
        >
          <option value="0.75">0.75x</option>
          <option value="1.0">1.0x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2.0">2.0x</option>
        </select>
      </div>

      <div className="text-[10px] text-neutral-500 text-center border-t border-neutral-800 pt-1.5">
        Natural text-to-speech audio reader. Select any paragraph or listen to the full document.
      </div>
    </div>
  );
};
