import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, Check, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { chatAPI } from '../../services/api';

export const AiDemoSection = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([
    {
      role: 'assistant',
      content:
        "👋 Welcome! I am **Replate AI**, powered by Groq's ultra-low latency Llama 3.1 model. Ask me anything about leftover food safety, safe holding temps, recipes from excess ingredients, or how to donate surplus meals!",
    },
  ]);

  const samplePrompts = [
    'How long can cooked rice stay at room temp?',
    'What recipes can I make from leftover ripe bananas & milk?',
    'What temperature must hot banquet food be kept at for donation?',
    'How do I label allergens when donating to a shelter?',
  ];

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: 'user', content: textToSend };
    setConversation((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage({ message: textToSend });
      if (res.data?.success && res.data.message) {
        setConversation((prev) => [...prev, res.data.message]);
      } else {
        setConversation((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              '⚠️ Hot food holding rule: Keep food above 60°C (140°F) or chill rapidly to below 4°C (40°F) within 2 hours to avoid microbial proliferation.',
          },
        ]);
      }
    } catch (err) {
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '🛡️ **Food Safety First**: Keep perishable foods out of the danger zone (4°C–60°C / 40°F–140°F). For hot donations, transport in insulated Cambro food carriers.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
      <div className="ambient-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Interactive Demo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Test Replate AI with Real Food Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Witness the sub-second response speeds of Groq Llama 3.1 tailored for food rescue operations.
          </p>
        </div>

        {/* Demo Chat Widget Box */}
        <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-slate-50 dark:bg-slate-800/90 px-6 py-4 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-500 dark:text-brand-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Replate Food Intelligence
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30">
                    llama-3.1-8b-instant
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Low-latency food safety assistant</p>
              </div>
            </div>

            <Link
              to="/chat"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 flex items-center gap-1 transition-colors"
            >
              <span>Full Screen Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-4 bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/80 transition-all text-left truncate max-w-xs hover:border-brand-500 shadow-sm"
              >
                💡 {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto bg-slate-50/40 dark:bg-slate-950/40">
            {conversation.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-500 dark:text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white shadow-md font-medium'
                      : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 whitespace-pre-line shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-slate-500 dark:text-slate-400 text-xs py-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-500 dark:text-brand-400 flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="ml-2 font-mono text-[11px] text-brand-600 dark:text-brand-400">Groq analyzing food safety guidelines...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about leftover safety, storage, or shelf-life..."
              className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-brand-500/25 transition-all"
            >
              <span>Ask AI</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
