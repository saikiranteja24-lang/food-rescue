import React from 'react';
import { Plus, MessageSquare, Trash2, Bot, Sparkles, X } from 'lucide-react';

export const ChatSidebar = ({
  conversations,
  currentId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onClearAll,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 md:w-80 bg-white dark:bg-[#0c1322] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                Replate Advisor
              </h3>
              <p className="text-[10px] text-brand-500 font-medium">Groq Llama 3.1 Fast AI</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-accent-600 text-white font-bold text-xs shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Start New Consultation</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Recent Consultations
          </div>

          {conversations.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-500 dark:text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              No conversations yet. Ask Replate AI about food safety, recipes, or redistribution.
            </div>
          ) : (
            conversations.map((c) => {
              const isSelected = currentId === c._id;
              return (
                <div
                  key={c._id}
                  onClick={() => {
                    onSelectConversation(c._id);
                    if (onClose) onClose();
                  }}
                  className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer text-xs transition-all ${
                    isSelected
                      ? 'bg-brand-500/15 border border-brand-500/30 text-brand-600 dark:text-brand-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${isSelected ? 'text-brand-400' : 'text-slate-400'}`} />
                    <span className="truncate">{c.title || 'Food Rescue Discussion'}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(c._id);
                    }}
                    title="Delete discussion"
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Clear History */}
        {conversations.length > 0 && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onClearAll}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-slate-500 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
