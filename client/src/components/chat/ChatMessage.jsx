import React, { useState } from 'react';
import { Bot, User, Copy, Check, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    showToast('Copied to clipboard', 'info', 2000);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple Markdown Parser for clear rendering of headings, bold, bullet points, and tables
  const renderFormattedContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Heading 3 ###
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-base text-brand-400 mt-3 mb-1.5 font-display">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Heading 2 ##
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-extrabold text-lg text-white mt-4 mb-2 font-display">
            {line.replace('## ', '')}
          </h3>
        );
      }
      // Heading 1 #
      if (line.startsWith('# ')) {
        return (
          <h2 key={idx} className="font-black text-xl text-white mt-4 mb-2 font-display">
            {line.replace('# ', '')}
          </h2>
        );
      }
      // Horizontal rule
      if (line.trim() === '---') {
        return <hr key={idx} className="my-3 border-slate-700/60" />;
      }
      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletContent = line.trim().substring(2);
        return (
          <div key={idx} className="flex items-start gap-2 ml-2 my-1">
            <span className="text-brand-400 mt-1">•</span>
            <span
              dangerouslySetInnerHTML={{
                __html: bulletContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
              }}
            />
          </div>
        );
      }
      // Default line with bold formatting
      return (
        <p
          key={idx}
          className="my-1.5 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
          }}
        />
      );
    });
  };

  return (
    <div className={`flex gap-3.5 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-500/20 mt-1">
          <Bot className="w-5 h-5" />
        </div>
      )}

      <div
        className={`relative group max-w-2xl rounded-3xl p-5 text-sm transition-all ${
          isUser
            ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-lg shadow-brand-500/20 font-medium'
            : 'glass-card border border-slate-200 dark:border-slate-800/90 text-slate-800 dark:text-slate-200 shadow-md'
        }`}
      >
        {/* Header inside assistant message */}
        {!isUser && (
          <div className="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white font-display">
                Replate Food Intelligence
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30">
                {message.model || 'llama-3.1-8b-instant'}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-brand-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Message Body */}
        <div className="text-sm leading-relaxed overflow-x-auto">
          {isUser ? message.content : renderFormattedContent(message.content)}
        </div>

        {/* Meta / Timestamp */}
        <div
          className={`text-[10px] mt-2 text-right ${
            isUser ? 'text-white/70' : 'text-slate-400'
          }`}
        >
          {message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {isUser && (
        <div className="w-9 h-9 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-1">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
