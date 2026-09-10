import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

export const ChatInput = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const quickPrompts = [
    '🍚 Safe holding temp for cooked rice',
    '🥖 Creative recipes from leftover bread',
    '📋 Checklist for catering donation',
    '❄️ How to freeze surplus dairy products',
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChipClick = (prompt) => {
    // Strip emoji
    const clean = prompt.replace(/^[^\w\s]+/, '').trim();
    onSendMessage(clean);
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0b1120]/90 backdrop-blur-md p-4 transition-colors">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Quick prompt chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleChipClick(p)}
              disabled={disabled}
              className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-all hover:border-brand-500 shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <div className="flex-1 relative glass-card rounded-2xl border border-slate-300 dark:border-slate-700/80 focus-within:border-brand-500 overflow-hidden transition-colors">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Replate AI about food safety, shelf life, or redistribution..."
              disabled={disabled}
              className="w-full bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-none max-h-36 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="h-11 w-11 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white disabled:opacity-40 flex items-center justify-center shadow-lg shadow-brand-500/25 transition-all hover:scale-105 shrink-0"
          >
            {disabled ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-400">
          Powered by <strong>Groq Llama 3.1</strong>. Always follow certified HACCP and local health authority food safety regulations.
        </p>
      </div>
    </div>
  );
};
