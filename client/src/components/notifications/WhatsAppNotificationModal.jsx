import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  Copy,
  X,
  ShieldCheck,
  Smartphone,
  Send,
} from 'lucide-react';

export const WhatsAppNotificationModal = ({
  isOpen,
  onClose,
  notification,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !notification) return null;

  const handleCopy = () => {
    if (notification.message) {
      navigator.clipboard.writeText(notification.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleOpenWhatsApp = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#0c1322] rounded-3xl shadow-2xl border border-emerald-500/30 overflow-hidden"
        >
          {/* Top WhatsApp Branded Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                  <MessageSquare className="w-6 h-6 text-white fill-white/20" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base font-display leading-tight">
                      Replate Food Rescue AI
                    </h3>
                    <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-900 flex items-center justify-center text-[10px] font-black" title="Verified Website Profile">
                      ✓
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100 opacity-90 flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                    <span>Official Receiver WhatsApp Alert</span>
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-4">
            {/* Status Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-800 dark:text-emerald-200">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-emerald-900 dark:text-emerald-300">
                  Receiver WhatsApp Notification Ready
                </strong>
                <span>
                  A login alert has been formatted for your registered phone{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                    {notification.recipient?.phone ? `+${notification.recipient.phone}` : '(Registered Phone)'}
                  </strong>
                  .
                </span>
              </div>
            </div>

            {/* WhatsApp Message Preview Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  WhatsApp Message Preview
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(notification.sentAt || Date.now()).toLocaleTimeString()}
                </span>
              </div>

              <div className="relative rounded-2xl bg-slate-50 dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 max-h-52 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                {notification.message}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => handleOpenWhatsApp(notification.whatsappDeepLink)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02]"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open in WhatsApp App</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>

              <button
                onClick={() => handleOpenWhatsApp(notification.whatsappWebLink)}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-emerald-500" />
                <span>WhatsApp Web</span>
              </button>

              <button
                onClick={handleCopy}
                className="w-full sm:w-auto p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all"
                title="Copy notification text"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-500 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
