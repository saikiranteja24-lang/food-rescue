import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { donationAPI, authAPI } from '../services/api';
import { getFoodImageUrl } from '../utils/foodImages';
import { RescueTracker } from '../components/donations/RescueTracker';
import { SchedulePickupModal } from '../components/donations/SchedulePickupModal';
import {
  Heart,
  TrendingDown,
  Package,
  CheckCircle,
  PlusCircle,
  Clock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Building,
  Send,
  CalendarClock,
  Truck,
  Building2,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, refreshProfile, triggerWhatsAppAlert } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('donations');
  const [filterStatus, setFilterStatus] = useState('all');
  const [myDonations, setMyDonations] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

  // Modal State for scheduling pickup
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedDonationForSchedule, setSelectedDonationForSchedule] = useState(null);

  const handleSendTestWhatsApp = async () => {
    setSendingWhatsApp(true);
    try {
      const res = await authAPI.sendWhatsAppTest({
        phone: user?.whatsappPhone || user?.phone,
        type: 'login',
      });
      if (res.data?.success && res.data.notification) {
        showToast('WhatsApp notification generated! 💬', 'success');
        triggerWhatsAppAlert(res.data.notification);
      } else {
        showToast(res.data?.message || 'Failed to send WhatsApp alert', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error triggering WhatsApp alert', 'error');
    } finally {
      setSendingWhatsApp(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      await refreshProfile();
      const [donationsRes, claimsRes] = await Promise.all([
        donationAPI.getMyDonations(),
        donationAPI.getMyClaims(),
      ]);

      if (donationsRes.data?.success) {
        setMyDonations(donationsRes.data.donations || []);
      }
      if (claimsRes.data?.success) {
        setMyClaims(claimsRes.data.claims || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, statusPayload) => {
    try {
      const payload = typeof statusPayload === 'string' ? { status: statusPayload } : statusPayload;
      const res = await donationAPI.updateStatus(id, payload);
      if (res.data?.success) {
        showToast(`Rescue stage updated: ${payload.status.replace('_', ' ')}! 🎉`, 'success');
        fetchUserData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update rescue stage', 'error');
    }
  };

  const openSchedulePickup = (donation) => {
    setSelectedDonationForSchedule(donation);
    setScheduleModalOpen(true);
  };

  const filterItems = (list) => {
    if (filterStatus === 'all') return list;
    if (filterStatus === 'active') return list.filter((i) => ['available', 'claimed', 'pickup_scheduled', 'picked_up'].includes(i.status));
    if (filterStatus === 'completed') return list.filter((i) => ['delivered', 'completed'].includes(i.status));
    if (filterStatus === 'cancelled') return list.filter((i) => i.status === 'cancelled');
    return list;
  };

  const displayedDonations = filterItems(myDonations);
  const displayedClaims = filterItems(myClaims);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white flex items-center gap-3">
            <span>Welcome back, {user?.name}</span>
            <span className="text-xs px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 font-bold uppercase tracking-wider">
              {user?.role}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-2">
            <span>{user?.organizationName || user?.organizationType || 'Community Member'}</span>
            <span>•</span>
            <span className="font-mono text-xs">{user?.email}</span>
          </p>
        </div>

        <Link
          to="/donate"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-600 text-white font-bold text-sm shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List Surplus Food</span>
        </Link>
      </div>

      {/* Stats Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/15 text-brand-500 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Meals Rescued</p>
            <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white">
              {user?.stats?.mealsRescued || 0}
            </h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/15 text-brand-500 flex items-center justify-center shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">CO2 Prevented</p>
            <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white">
              {user?.stats?.co2OffsetKg || 0} <span className="text-xs font-normal text-slate-400">kg</span>
            </h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Active Listings</p>
            <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white">
              {myDonations.filter((d) => d.status === 'available').length}
            </h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Total Claims</p>
            <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white">
              {myClaims.length}
            </h3>
          </div>
        </div>
      </div>

      {/* WhatsApp Receiver Alert Center */}
      <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
                  WhatsApp Notification Service
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Automated Rescue Alerts
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Active Alert Number: <strong className="text-slate-900 dark:text-white font-mono">{user?.whatsappPhone || user?.phone || 'Not registered'}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={handleSendTestWhatsApp}
              disabled={sendingWhatsApp}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sendingWhatsApp ? 'Sending Alert...' : 'Send WhatsApp Test Alert'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Tab Bar & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('donations')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'donations'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-white bg-slate-100 dark:bg-slate-800/60'
            }`}
          >
            My Listed Food ({myDonations.length})
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'claims'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-white bg-slate-100 dark:bg-slate-800/60'
            }`}
          >
            My Claimed Pickups ({myClaims.length})
          </button>
        </div>

        {/* Status Sub-Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'all', label: 'All' },
            { key: 'active', label: 'Active / In Transit' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                filterStatus === f.key
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Listed Food (Donor View) */}
      {activeTab === 'donations' && (
        <div className="space-y-4">
          {displayedDonations.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Package className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">No food donations in this view</h3>
              <p className="text-xs text-slate-500">Have leftover banquet food, produce, or bakery items?</p>
              <Link
                to="/donate"
                className="inline-block mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 text-white"
              >
                Post Surplus Food
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedDonations.map((item) => {
                const prepDate = item.preparedTime ? new Date(item.preparedTime) : new Date(item.createdAt);
                const expiryDate = new Date(item.expiryTime);
                const foodType = item.foodType || 'Veg';

                return (
                  <div
                    key={item._id}
                    className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-lg overflow-hidden space-y-4 p-5"
                  >
                    {/* Header Image + Basic Info Row */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="relative h-28 w-full sm:w-36 rounded-2xl overflow-hidden bg-slate-800 shrink-0">
                        <img
                          src={getFoodImageUrl(item)}
                          alt={`${item.title} – ${item.quantity} ${item.quantityUnit || 'servings'}`}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80'; }}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              foodType === 'Veg'
                                ? 'bg-emerald-500/90 text-white'
                                : foodType === 'Non-Veg'
                                ? 'bg-rose-500/90 text-white'
                                : 'bg-amber-500/90 text-white'
                            }`}
                          >
                            {foodType}
                          </span>
                        </div>
                        <div className="absolute bottom-1.5 right-2 text-white text-[11px] font-black bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                          {item.quantity} {item.quantityUnit}
                        </div>
                      </div>

                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            {item.category}
                          </span>
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                              item.status === 'available'
                                ? 'bg-brand-500/20 text-brand-400'
                                : item.status === 'claimed'
                                ? 'bg-amber-500/20 text-amber-400'
                                : item.status === 'pickup_scheduled'
                                ? 'bg-indigo-500/20 text-indigo-400'
                                : item.status === 'picked_up'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : item.status === 'delivered'
                                ? 'bg-teal-500/20 text-teal-400'
                                : item.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {item.status.replace('_', ' ')}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-500" />
                            Safe Until: <strong className="text-amber-500">{expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-brand-400" />
                            {item.pickupLocation?.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Claimer Information if Claimed */}
                    {item.claimedBy && (
                      <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-bold text-amber-400 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>Claimed by: {item.claimedBy.name}</span>
                          </p>
                          <p className="text-slate-400 text-[11px]">
                            {item.claimedBy.organizationName || 'Community Shelter'} • {item.claimedBy.phone}
                          </p>
                        </div>
                        {item.claimNotes && (
                          <span className="text-slate-300 italic text-[11px] bg-slate-800/80 px-2 py-1 rounded-lg">
                            "{item.claimNotes}"
                          </span>
                        )}
                      </div>
                    )}

                    {/* Embedded Live Rescue Tracker */}
                    <RescueTracker donation={item} onRefresh={fetchUserData} />

                    {/* Stage Action Workflow Buttons */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
                      {item.status === 'claimed' && (
                        <>
                          <button
                            onClick={() => openSchedulePickup(item)}
                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                          >
                            <CalendarClock className="w-3.5 h-3.5" />
                            <span>Schedule Pickup</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item._id, 'picked_up')}
                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Mark Picked Up</span>
                          </button>
                        </>
                      )}

                      {item.status === 'pickup_scheduled' && (
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'picked_up')}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Confirm Picked Up (In Transit)</span>
                        </button>
                      )}

                      {item.status === 'picked_up' && (
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'delivered')}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/20"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Mark Delivered to Shelter</span>
                        </button>
                      )}

                      {item.status === 'delivered' && (
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'completed')}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete & Record Impact</span>
                        </button>
                      )}

                      {item.status === 'available' && (
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'cancelled')}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-700 dark:text-slate-300 hover:text-rose-400 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Listing</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Claimed Pickups (Recipient / NGO View) */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          {displayedClaims.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <CheckCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">No food claimed in this view</h3>
              <p className="text-xs text-slate-500">Need surplus food for your community kitchen or shelter?</p>
              <Link
                to="/donations"
                className="inline-block mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 text-white"
              >
                Browse Surplus Feed
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedClaims.map((claim) => {
                const prepDate = claim.preparedTime ? new Date(claim.preparedTime) : new Date(claim.createdAt);
                const expiryDate = new Date(claim.expiryTime);
                const foodType = claim.foodType || 'Veg';

                return (
                  <div
                    key={claim._id}
                    className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-lg overflow-hidden space-y-4 p-5"
                  >
                    {/* Header Image + Basic Info Row */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="relative h-28 w-full sm:w-36 rounded-2xl overflow-hidden bg-slate-800 shrink-0">
                        <img
                          src={getFoodImageUrl(claim)}
                          alt={`${claim.title} – ${claim.quantity} ${claim.quantityUnit || 'servings'}`}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80'; }}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              foodType === 'Veg'
                                ? 'bg-emerald-500/90 text-white'
                                : foodType === 'Non-Veg'
                                ? 'bg-rose-500/90 text-white'
                                : 'bg-amber-500/90 text-white'
                            }`}
                          >
                            {foodType}
                          </span>
                        </div>
                        <div className="absolute bottom-1.5 right-2 text-white text-[11px] font-black bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                          {claim.quantity} {claim.quantityUnit}
                        </div>
                      </div>

                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            {claim.category}
                          </span>
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                              claim.status === 'claimed'
                                ? 'bg-amber-500/20 text-amber-400'
                                : claim.status === 'pickup_scheduled'
                                ? 'bg-indigo-500/20 text-indigo-400'
                                : claim.status === 'picked_up'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : claim.status === 'delivered'
                                ? 'bg-teal-500/20 text-teal-400'
                                : claim.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-500/20 text-slate-400'
                            }`}
                          >
                            {claim.status.replace('_', ' ')}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                          {claim.title}
                        </h3>

                        <div className="space-y-1 text-xs text-slate-400 pt-1">
                          <p className="flex items-center gap-1.5 text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                            <span className="truncate">Pickup: {claim.pickupLocation?.street}, {claim.pickupLocation?.city}</span>
                          </p>
                          <p className="flex items-center gap-1.5 text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                            <span className="truncate">Donor: {claim.donor?.name || 'Partner Donor'} ({claim.contactPhone})</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Embedded Live Rescue Tracker */}
                    <RescueTracker donation={claim} onRefresh={fetchUserData} />

                    {/* Recipient Action Workflow Buttons */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
                      {claim.status === 'claimed' && (
                        <>
                          <button
                            onClick={() => openSchedulePickup(claim)}
                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                          >
                            <CalendarClock className="w-3.5 h-3.5" />
                            <span>Schedule Pickup</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(claim._id, 'picked_up')}
                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Confirm Picked Up</span>
                          </button>
                        </>
                      )}

                      {claim.status === 'pickup_scheduled' && (
                        <button
                          onClick={() => handleUpdateStatus(claim._id, 'picked_up')}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Confirm Food Picked Up (In Transit)</span>
                        </button>
                      )}

                      {claim.status === 'picked_up' && (
                        <button
                          onClick={() => handleUpdateStatus(claim._id, 'delivered')}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/20"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Confirm Delivery Received at Shelter</span>
                        </button>
                      )}

                      {claim.status === 'delivered' && (
                        <button
                          onClick={() => handleUpdateStatus(claim._id, 'completed')}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Meals Distributed & Complete</span>
                        </button>
                      )}

                      {claim.status === 'completed' && (
                        <div className="w-full p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Rescue Completed & Impact Recorded</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Schedule Pickup Modal */}
      {selectedDonationForSchedule && (
        <SchedulePickupModal
          isOpen={scheduleModalOpen}
          onClose={() => {
            setScheduleModalOpen(false);
            setSelectedDonationForSchedule(null);
          }}
          onConfirm={(payload) => handleUpdateStatus(selectedDonationForSchedule._id, payload)}
          donationTitle={selectedDonationForSchedule.title}
        />
      )}
    </div>
  );
};
