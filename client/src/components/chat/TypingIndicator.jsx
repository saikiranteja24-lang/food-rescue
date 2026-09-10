import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3.5 my-3 items-center">
      <div className="w-9 h-9 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 shadow-md">
        <Bot className="w-5 h-5 animate-pulse" />
      </div>

      <div className="glass-card px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.15s]" />
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.3s]" />
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">
          Replate AI is preparing safety guidelines...
        </span>
      </div>
    </div>
  );
};
