import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Volume2 } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface VoiceTypingWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

export const VoiceTypingWidget: React.FC<VoiceTypingWidgetProps> = ({
  isOpen,
  onClose,
  editor,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    // Check browser SpeechRecognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg('Speech recognition is not supported in this browser. Try Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            editor?.chain().focus().insertContent(trans + ' ').run();
          } else {
            currentTranscript += trans;
          }
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (err: any) => {
        if (err.error !== 'no-speech') {
          setErrorMsg(`Microphone error: ${err.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      setErrorMsg(e.message || 'Could not start microphone.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isOpen, editor]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // already started
      }
    }
  };

  return (
    <div className="fixed bottom-14 right-6 z-40 bg-black text-white border border-neutral-700 rounded-lg shadow-2xl p-4 w-72 select-none animate-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-white animate-ping' : 'bg-neutral-600'}`} />
          <span className="font-bold text-xs uppercase tracking-wide">
            {isListening ? 'Listening...' : 'Dictation Paused'}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-neutral-400 hover:text-white p-0.5 rounded"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      <div className="py-3 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isListening ? 'bg-white text-black shadow-lg scale-105' : 'bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800'
          }`}
          title={isListening ? 'Pause Dictation' : 'Start Dictation'}
        >
          {isListening ? <Mic className="w-6 h-6 stroke-[2.4]" /> : <MicOff className="w-6 h-6 stroke-[2.2]" />}
        </button>

        {transcript && (
          <p className="text-xs text-neutral-300 italic text-center truncate max-w-full px-2">
            "{transcript}"
          </p>
        )}

        {errorMsg && (
          <p className="text-[11px] text-neutral-400 text-center px-1">
            {errorMsg}
          </p>
        )}
      </div>

      <div className="text-[10px] text-neutral-500 text-center border-t border-neutral-800 pt-1.5">
        Speak clearly into microphone. Speech is transcribed directly into document.
      </div>
    </div>
  );
};
