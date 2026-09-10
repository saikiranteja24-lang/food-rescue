import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CalendarClock,
  Clock,
  User,
  Phone,
  FileText,
  Truck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const SchedulePickupModal = ({
  isOpen,
  onClose,
  onConfirm,
  donationTitle,
}) => {
  const [estimatedPickupTime, setEstimatedPickupTime] = useState('');
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onConfirm({
        status: 'pickup_scheduled',
        estimatedPickupTime: estimatedPickupTime ? new Date(estimatedPickupTime).toISOString() : new Date().toISOString(),
        volunteerName: volunteerName.trim(),
        volunteerPhone: volunteerPhone.trim(),
        note: note.trim() || undefined,
      });
      onClose();
    } catch (err) {
      console.error('Error confirming pickup schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  // Default to 1 hour from now for quick selection
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative bg-white dark:bg-slate-900"
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <CalendarClock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display">Schedule Food Pickup</h3>
                <p className="text-xs text-indigo-200 line-clamp-1 mt-0.5">
                  {donationTitle || 'Coordinate collection details'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Estimated Pickup Time */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Estimated Pickup Date & Time *</span>
            </label>
            <input
              type="datetime-local"
              required
              min={getMinDateTime()}
              value={estimatedPickupTime}
              onChange={(e) => setEstimatedPickupTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          {/* Volunteer / Driver Name & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span>Volunteer / Driver</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={volunteerName}
                onChange={(e) => setVolunteerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-500" />
                <span>Contact Phone</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={volunteerPhone}
                onChange={(e) => setVolunteerPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* Logistics / Dispatch Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>Logistics / Vehicle Notes (Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Arriving with insulated containers in a small van..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
            />
          </div>

          {/* Info Banner */}
          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-start gap-3">
            <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-900 dark:text-indigo-200">
              Scheduling pickup updates the real-time rescue tracker and notifies the donor to have the surplus packaged and ready.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !estimatedPickupTime}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Confirming...' : 'Confirm Schedule'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SchedulePickupModal;
