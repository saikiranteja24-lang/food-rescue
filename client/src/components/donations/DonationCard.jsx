import React, { useState } from 'react';
import { Clock, MapPin, Phone, ShieldCheck, HeartHandshake, AlertTriangle, CheckCircle, Flame, ImageOff } from 'lucide-react';
import { getFoodImageUrl } from '../../utils/foodImages';

export const DonationCard = ({ donation, onClaim, onViewDetails }) => {
  const [imgError, setImgError] = useState(false);
  const foodImageUrl = getFoodImageUrl(donation);
  const isAvailable = donation.status === 'available';
  const expiryDate = new Date(donation.expiryTime);
  const prepDate = donation.preparedTime ? new Date(donation.preparedTime) : new Date(donation.createdAt);
  const now = new Date();
  
  const diffHours = Math.round((expiryDate - now) / (1000 * 60 * 60));
  const isUrgent = diffHours <= 4 && diffHours > 0;
  const isExpired = now > expiryDate;

  // Calculate hours since preparation
  const hoursSincePrep = Math.max(0, Math.round((now - prepDate) / (1000 * 60 * 60)));
  const minsSincePrep = Math.max(0, Math.round((now - prepDate) / (1000 * 60)));

  const prepTimeFormatted = minsSincePrep < 60
    ? `${minsSincePrep} min(s) ago`
    : `${hoursSincePrep} hr(s) ago`;

  const categoryIcons = {
    'Cooked Meals': '🍲',
    'Bakery & Bread': '🥖',
    'Fresh Produce': '🥦',
    'Packaged Goods': '📦',
    'Dairy & Refrigerated': '🥛',
    'Beverages': '🧃',
    'Buffet Surplus': '🍽️',
    Other: '🥗',
  };

  // Food Type Badge config
  const foodType = donation.foodType || (donation.dietaryInfo?.some(t => t.includes('Meat') || t.includes('Poultry') || t.includes('Seafood')) ? 'Non-Veg' : 'Veg');

  const foodTypeStyles = {
    Veg: {
      label: 'Pure Veg',
      icon: '🟢',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      indicator: 'border-emerald-600 dark:border-emerald-400 text-emerald-600',
    },
    'Non-Veg': {
      label: 'Non-Veg',
      icon: '🔴',
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/10',
      text: 'text-rose-700 dark:text-rose-400',
      indicator: 'border-rose-600 dark:border-rose-400 text-rose-600',
    },
    'Contains Egg': {
      label: 'Egg',
      icon: '🟡',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-400',
      indicator: 'border-amber-600 dark:border-amber-400 text-amber-600',
    },
    Vegan: {
      label: 'Vegan',
      icon: '🌱',
      border: 'border-teal-500/30',
      bg: 'bg-teal-500/10',
      text: 'text-teal-700 dark:text-teal-400',
      indicator: 'border-teal-600 dark:border-teal-400 text-teal-600',
    },
  };

  const currentTypeStyle = foodTypeStyles[foodType] || foodTypeStyles.Veg;

  return (
    <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-xl relative overflow-hidden">
      {/* Food Image Banner */}
      <div className="relative h-44 w-full overflow-hidden rounded-t-3xl bg-slate-100 dark:bg-slate-800 shrink-0">
        {!imgError ? (
          <img
            src={foodImageUrl}
            alt={`${donation.title} – ${donation.quantity} ${donation.quantityUnit || 'servings'}`}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-2">
            <ImageOff className="w-8 h-8" />
            <span className="text-xs font-medium">No image available</span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status badge – top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {donation.status === 'available' && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-500 text-white shadow-md">
              Available
            </span>
          )}
          {donation.status === 'claimed' && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-md">
              Claimed
            </span>
          )}
          {donation.status === 'pickup_scheduled' && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500 text-white shadow-md">
              Pickup Scheduled
            </span>
          )}
          {donation.status === 'picked_up' && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500 text-white shadow-md">
              In Transit
            </span>
          )}
          {donation.status === 'delivered' && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-500 text-white shadow-md">
              Delivered
            </span>
          )}
          {donation.status === 'completed' && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-md">
              Completed
            </span>
          )}
          {donation.status === 'cancelled' && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500 text-white shadow-md">
              Cancelled
            </span>
          )}
        </div>


{/* Veg/Non-Veg badge – top left */}
<div className="absolute top-3 left-3 flex flex-col items-start space-y-1">
  {/* Urgent Redistribution badge */}
  {donation.needsRedistribution && (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-md">
      Urgent
    </span>
  )}
  {/* Veg/Non-Veg badge */}
  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-md backdrop-blur-sm bg-black/40 text-white border-white/20`}>
    <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-[8px] font-black ${currentTypeStyle.indicator}`}>
      {foodType === 'Veg' ? '●' : foodType === 'Non-Veg' ? '▲' : '●'}
    </span>
    <span>{currentTypeStyle.label}</span>
  </div>
</div>

        {/* Quantity badge – bottom right */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-black/50 text-white backdrop-blur-sm border border-white/10 shadow-md">
            {donation.quantity} {donation.quantityUnit}
          </span>
        </div>

        {/* Category icon – bottom left */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xl drop-shadow-lg">{categoryIcons[donation.category] || '🍱'}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
      <div>
        {/* Title & Description */}
        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">
          {donation.title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3.5 leading-relaxed">
          {donation.description}
        </p>

        {/* Dietary & Storage Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {donation.storageCondition && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
              ❄️ {donation.storageCondition}
            </span>
          )}
          {donation.dietaryInfo?.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Time Card: Preparation Time & Expiry Window */}
        <div className="space-y-2 mb-4">
          {/* Preparation Time Line */}
          <div className="flex items-center justify-between p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Prepared:</span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {prepDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({prepTimeFormatted})
            </span>
          </div>

          {/* Expiry / Safety Countdown */}
          <div
            className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
              isExpired
                ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20'
                : isUrgent
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse'
                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
            }`}
          >
            {isUrgent ? (
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
            ) : (
              <Clock className="w-4 h-4 shrink-0 text-brand-500" />
            )}
            <span className="truncate">
              {isExpired
                ? 'Expired'
                : isUrgent
                ? `Expiring soon: ~${diffHours} hour(s) left`
                : `Safe consumption until: ${expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${expiryDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}`}
            </span>
          </div>
        </div>

        {/* Pickup Location & Donor details */}
        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {donation.pickupLocation?.street}, {donation.pickupLocation?.city}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span className="truncate font-medium text-slate-700 dark:text-slate-300">
              {donation.donor?.organizationName || donation.donor?.name || 'Verified Donor'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        {isAvailable ? (
          <button
            onClick={() => onClaim(donation)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/20 hover:scale-[1.02] transition-all"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Claim for Shelter / NGO</span>
          </button>
        ) : (
          <div className="w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            {donation.claimedBy?.organizationName
              ? `Reserved by ${donation.claimedBy.organizationName}`
              : 'Already Claimed'}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
