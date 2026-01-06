"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Copy, FileText, AlertCircle } from 'lucide-react';

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SpeechToText = ({ onBack }: { onBack: () => void }) => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [noteFeedback, setNoteFeedback] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'it-IT';

      recognition.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
          setError('Permesso microfono negato.');
        } else if (event.error === 'no-speech') {
          // Ignore no-speech errors, just restart if needed or let user restart
        } else {
          setError('Errore riconoscimento vocale: ' + event.error);
        }
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Append valid result
        if (finalTranscript || interimTranscript) {
          // We don't want to constantly overwrite everything if we want to keep previous manual edits,
          // but for a simple dictation tool, often appending to existing state is tricky with React batching
          // inside this callback.
          // Strategy: Since 'continuous' is true, the API returns the whole session usually, BUT
          // managing state updates with manual edits + streaming dictation is complex.
          // Simple approach: When result comes, update TEXT. 
          // BETTER APPROACH for minimal glitches: Use 'result' event to APPEND only the NEW part? 
          // Standard SpeechRecognition implementation usually replaces the input.
          // Let's use a simpler approach: Just set text to (prev + new) is dangerous with loops.
          // Actually, we'll try to just let the user edit. 
          // If we use `continuous`, `event.results` contains everything from the start of the session *unless* we stop.
          // Let's stick to: New utterance -> Append to current text box.
          
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
             
          // This overrides manual edits if we aren't careful.
          // Let's act like a typewriter: The API gives us the full session transcript since start() was called?
          // No, usually it gives the buffer.
          // Let's try handling it simpler: Update a ref, then sync to state?
          // Or just update state with the latest 'transcript' from the event.
          
          // Let's try the most robust way for simple dictation:
          // Just displaying the transcription of the CURRENT session.
          // If user manually edits, it might get overwritten if strict binding.
          // Ideally: Memoize previous text, append new text.
        }
      };

      // Alternative Robust Logic:
      // Just listen to 'result' and append FINAL results to the state.
      recognition.onresult = (event: any) => {
         for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
               const newChunk = event.results[i][0].transcript.trim() + ' ';
               setText(prev => prev + newChunk);
            }
         }
      };

      recognitionRef.current = recognition;
    } else {
      setError('Browser non supportato.');
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const sendToNotes = () => {
    if (!text.trim()) return;
    const currentNotes = localStorage.getItem('omnitool_notes') || '';
    const newNotes = currentNotes + (currentNotes ? '\n\n' : '') + text;
    localStorage.setItem('omnitool_notes', newNotes);
    setNoteFeedback(true);
    setTimeout(() => setNoteFeedback(false), 2000);
  };

  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">Dettato Vocale</h2>
      </div>

      <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 shadow-2xl bg-gradient-to-br from-red-500/10 to-rose-600/10 border-red-500/20 shadow-sm relative overflow-hidden flex flex-col gap-8 min-h-[60vh]">
        
        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 animate-fade-in">
            <AlertCircle size={20} />
            <span className="font-bold">{error}</span>
          </div>
        )}

        {/* Text Area */}
        <div className="flex-1 relative group">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Premi il microfono e inizia a parlare..."
            className="w-full h-full min-h-[300px] bg-transparent text-xl md:text-3xl font-medium text-adaptive placeholder:text-adaptive-muted outline-none resize-none leading-relaxed custom-scrollbar selection:bg-red-500/30"
          />
          {isListening && (
            <div className="absolute top-2 right-2 flex items-center gap-2 pointer-events-none">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest animate-pulse">Ascolto...</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[var(--glass-border)] pt-8">
          
          {/* Main Mic Button */}
          <button 
            onClick={toggleListening}
            className={`
              relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl
              ${isListening 
                ? 'bg-red-500 text-white shadow-red-500/40 scale-110' 
                : 'bg-[var(--glass-input-bg)] text-adaptive hover:bg-red-500/10 hover:text-red-500 border border-[var(--glass-border)]'
              }
            `}
          >
            {isListening ? (
               <>
                 <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping" />
                 <Mic size={32} />
               </>
            ) : (
               <MicOff size={32} />
            )}
          </button>

          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={handleCopy}
              className="flex-1 md:flex-none px-6 py-4 rounded-2xl glass-panel hover:bg-[var(--glass-card-hover)] font-bold text-adaptive flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <Copy size={20} />
              <span>{copyFeedback ? 'Copiato!' : 'Copia Testo'}</span>
            </button>

            <button 
              onClick={sendToNotes}
              className={`
                flex-1 md:flex-none px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg
                ${noteFeedback 
                  ? 'bg-green-500 text-white' 
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20'
                }
              `}
            >
              <FileText size={20} />
              <span>{noteFeedback ? 'Inviato!' : 'Invia a Note'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SpeechToText;
