import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PackageCheck,
  HandHeart,
  CalendarClock,
  Truck,
  Building2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Phone,
  FileText,
} from 'lucide-react';

const STAGES = [
  { key: 'available', label: 'Surplus Listed', icon: PackageCheck, desc: 'Food logged and available' },
  { key: 'claimed', label: 'Claimed', icon: HandHeart, desc: 'NGO/Shelter reserved listing' },
  { key: 'pickup_scheduled', label: 'Pickup Scheduled', icon: CalendarClock, desc: 'Logistics arranged' },
  { key: 'picked_up', label: 'In Transit', icon: Truck, desc: 'Picked up by volunteer/team' },
  { key: 'delivered', label: 'Delivered', icon: Building2, desc: 'Reached community destination' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, desc: 'Meals served & impact recorded' },
];

const STAGE_ORDER = ['available', 'claimed', 'pickup_scheduled', 'picked_up', 'delivered', 'completed'];

export const RescueTracker = ({ donation, onRefresh }) => {
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const currentStatus = donation?.status || 'available';
  const isCancelled = currentStatus === 'cancelled';

  const getCurrentStepIndex = () => {
    if (isCancelled) return -1;
    const index = STAGE_ORDER.indexOf(currentStatus);
    return index >= 0 ? index : 0;
  };

  const currentStepIdx = getCurrentStepIndex();

  return (
    <div className="w-full bg-slate-900/60 dark:bg-slate-950/60 rounded-2xl border border-slate-800/80 p-4 backdrop-blur-md">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            Live Rescue Pipeline
          </span>
        </div>

        {isCancelled ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            Rescue Cancelled
          </span>
        ) : (
          <span className="text-xs font-semibold text-brand-400">
            Stage {currentStepIdx + 1} of {STAGES.length}
          </span>
        )}
      </div>

      {/* Pipeline Steps Flow */}
      {!isCancelled ? (
        <div className="relative my-2">
          {/* Progress Connecting Line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800 -z-0" />
          <div
            className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-brand-500 via-teal-400 to-emerald-400 -z-0 transition-all duration-700"
            style={{
              width: `${(Math.max(0, currentStepIdx) / (STAGES.length - 1)) * 90}%`,
            }}
          />

          {/* Stepper Dots */}
          <div className="grid grid-cols-6 gap-1 relative z-10">
            {STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const isUpcoming = idx > currentStepIdx;

              return (
                <div key={stage.key} className="flex flex-col items-center text-center group">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isPast
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : isCurrent
                        ? 'bg-brand-500 text-white ring-4 ring-brand-500/20 shadow-lg shadow-brand-500/30 scale-110'
                        : 'bg-slate-800/80 text-slate-500 border border-slate-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`mt-2 text-[10px] font-bold tracking-tight line-clamp-1 ${
                      isPast
                        ? 'text-emerald-400'
                        : isCurrent
                        ? 'text-brand-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>Listing was cancelled. {donation?.cancelReason ? `Reason: ${donation.cancelReason}` : ''}</span>
        </div>
      )}

      {/* Volunteer / Logistics Info Banner if scheduled */}
      {donation?.volunteerName && (
        <div className="mt-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>Driver / Volunteer: <strong>{donation.volunteerName}</strong></span>
            {donation.volunteerPhone && (
              <span className="text-slate-400">({donation.volunteerPhone})</span>
            )}
          </div>
          {donation.estimatedPickupTime && (
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>ETA: {new Date(donation.estimatedPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>
      )}

      {/* Timeline Toggle Button */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowTimelineModal(!showTimelineModal)}
          className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <FileText className="w-3 h-3 text-brand-400" />
          <span>Audit Log ({donation?.rescueTimeline?.length || 1} events)</span>
          {showTimelineModal ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>

        <span className="text-[10px] text-slate-500">
          Last updated: {new Date(donation?.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Expandable Audit Log Details */}
      <AnimatePresence>
        {showTimelineModal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {(donation?.rescueTimeline || []).map((event, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs flex items-start justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="capitalize font-bold text-brand-400 text-[11px]">
                        {event.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(event.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        • {new Date(event.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{event.note || 'Status updated'}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 shrink-0 bg-slate-800/80 px-2 py-0.5 rounded-md">
                    {event.actor || 'System'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
