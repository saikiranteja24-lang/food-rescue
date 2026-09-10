import React, { useState, useEffect, useRef } from 'react';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Bot, Sparkles, Menu, Trash2, ShieldCheck, ArrowDownCircle } from 'lucide-react';

export const ChatPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionId] = useState(() => {
    let s = localStorage.getItem('replate_chat_session');
    if (!s) {
      s = 'sess_' + Math.random().toString(36).substring(2, 12);
      localStorage.setItem('replate_chat_session', s);
    }
    return s;
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [isAuthenticated]);

  const loadConversations = async () => {
    try {
      const res = await chatAPI.getConversations({ sessionId });
      if (res.data?.success) {
        setConversations(res.data.conversations || []);
        if (res.data.conversations.length > 0 && !currentConversationId) {
          loadConversationMessages(res.data.conversations[0]._id);
        }
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  };

  const loadConversationMessages = async (convId) => {
    setCurrentConversationId(convId);
    try {
      const res = await chatAPI.getMessages(convId);
      if (res.data?.success) {
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      showToast('Could not load messages for this conversation', 'error');
    }
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([
      {
        role: 'assistant',
        content:
          "👋 Hello! I am **Replate AI**, your dedicated surplus food safety, shelf-life, and redistribution consultant.\n\nAsk me about:\n- 🛡️ Safe holding temperatures & maximum safe delay before donation\n- ⏱️ Expiration timelines for specific cooked foods\n- 🍲 Creative recipes to repurpose surplus ingredients\n- 📦 Best packaging practices for local shelter deliveries",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  // Initial welcome message if brand new session
  useEffect(() => {
    if (!currentConversationId && messages.length === 0) {
      handleNewChat();
    }
  }, []);

  const handleSendMessage = async (text) => {
    if (!text || loading) return;

    const optimisticUserMsg = {
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMsg]);
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage({
        message: text,
        conversationId: currentConversationId,
        sessionId,
      });

      if (res.data?.success) {
        if (!currentConversationId && res.data.conversationId) {
          setCurrentConversationId(res.data.conversationId);
          loadConversations();
        }
        if (res.data.message) {
          setMessages((prev) => [...prev, res.data.message]);
        }
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "⚠️ Notice: We encountered a temporary delay connecting to Groq. In the meantime, remember the general food safety benchmark: *Keep cold perishable items below 4°C (40°F) and hot food above 60°C (140°F).* Please try asking your question again!",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (convId) => {
    try {
      await chatAPI.deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c._id !== convId));
      if (currentConversationId === convId) {
        handleNewChat();
      }
      showToast('Conversation deleted', 'info');
    } catch (err) {
      showToast('Failed to delete conversation', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all conversation histories?')) return;
    try {
      if (isAuthenticated) {
        await chatAPI.clearHistory();
      }
      setConversations([]);
      handleNewChat();
      showToast('Chat history cleared', 'info');
    } catch (err) {
      showToast('Failed to clear history', 'error');
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden bg-slate-50 dark:bg-[#070b14]">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        currentId={currentConversationId}
        onSelectConversation={loadConversationMessages}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onClearAll={handleClearAll}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Chat Bar */}
        <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-[#0b1120]/70 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  Replate AI Food Rescue Advisor
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                    llama-3.1-8b-instant
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instant guidance on shelf life, food safety & redistribution
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleNewChat}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}

            {loading && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input Bar */}
        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
};
