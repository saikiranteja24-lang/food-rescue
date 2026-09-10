import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HeartHandshake, Phone, MapPin, Clock, CheckCircle2, AlertCircle, ImageOff } from 'lucide-react';
import confetti from 'canvas-confetti';
import { donationAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getFoodImageUrl } from '../../utils/foodImages';

export const ClaimModal = ({ donation, isOpen, onClose, onSuccess }) => {
  const [claimNotes, setClaimNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { user, isAuthenticated, triggerWhatsAppAlert } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!isOpen || !donation) return null;

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in or register to claim food donations', 'info');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await donationAPI.claim(donation._id, { claimNotes });
      if (res.data?.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#14b8a6', '#f59e0b', '#3b82f6'],
        });

        showToast('Donation claimed! Please coordinate pickup with donor. 🌱', 'success');
        if (onSuccess) onSuccess(res.data.donation);
        onClose();

        if (res.data.whatsappNotification) {
          triggerWhatsAppAlert(res.data.whatsappNotification);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to claim donation', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative"
      >
        {/* Food Image Header */}
        <div className="relative h-40 w-full overflow-hidden rounded-t-3xl bg-slate-800 shrink-0">
          {!imgError ? (
            <img
              src={getFoodImageUrl(donation)}
              alt={`${donation.title} – ${donation.quantity} ${donation.quantityUnit || 'servings'}`}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
              <ImageOff className="w-8 h-8" />
              <span className="text-xs">No image available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Food type & title overlay */}
          <div className="absolute bottom-3 left-4 right-14 text-white">
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
              (donation.foodType || 'Veg') === 'Veg'
                ? 'bg-emerald-500/80 text-white'
                : donation.foodType === 'Non-Veg'
                ? 'bg-rose-500/80 text-white'
                : 'bg-amber-500/80 text-white'
            }`}>
              {(donation.foodType || 'Veg') === 'Veg' ? '🟢 Pure Veg' : donation.foodType === 'Non-Veg' ? '🔴 Non-Veg' : donation.foodType}
            </span>
            <h3 className="font-bold text-base drop-shadow-sm leading-tight line-clamp-1">{donation.title}</h3>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Claim Food Donation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Confirm pickup details for this surplus batch
            </p>
          </div>
        </div>

        {/* Item Summary Card */}
        <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-4 mb-6 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  (donation.foodType || 'Veg') === 'Veg'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : donation.foodType === 'Non-Veg'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                }`}
              >
                {(donation.foodType || 'Veg') === 'Veg' ? '🟢 Pure Veg' : donation.foodType === 'Non-Veg' ? '🔴 Non-Veg' : donation.foodType}
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {donation.title}
              </h4>
            </div>
            <span className="text-xs font-black text-brand-500">
              {donation.quantity} {donation.quantityUnit}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="flex items-center gap-1 font-medium">
              <span>🍳 Prepared:</span>
              <strong className="text-slate-900 dark:text-white">
                {new Date(donation.preparedTime || donation.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <span>🛡️ Safe Until:</span>
              <strong className="text-amber-500">
                {new Date(donation.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </strong>
            </span>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {donation.pickupLocation?.street}, {donation.pickupLocation?.city}
            </span>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Contact: {donation.contactPhone} ({donation.contactPerson || 'Donor'})</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleClaim} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Pickup Notes / Estimated Arrival
            </label>
            <textarea
              rows={3}
              value={claimNotes}
              onChange={(e) => setClaimNotes(e.target.value)}
              placeholder="e.g., 'Arriving in 30 mins with insulated thermal boxes from Hope Shelter van #2'..."
              className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-[11px] text-brand-600 dark:text-brand-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              By claiming, you confirm that your organization has safe transport arrangements to maintain temperature integrity.
            </span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white text-xs font-bold shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>{loading ? 'Claiming...' : 'Confirm Claim'}</span>
            </button>
          </div>
        </form>
        </div>
      </motion.div>
    </div>
  );
};
