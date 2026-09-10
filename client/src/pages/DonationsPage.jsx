import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DonationCard } from '../components/donations/DonationCard';
import { DonationFilters } from '../components/donations/DonationFilters';
import { ClaimModal } from '../components/donations/ClaimModal';
import { donationAPI } from '../services/api';
import { PlusCircle, Utensils, RefreshCw, AlertCircle, HeartHandshake } from 'lucide-react';

export const DonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFoodType, setSelectedFoodType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('available');
  const [selectedDietary, setSelectedDietary] = useState('All');
  const [selectedForClaim, setSelectedForClaim] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, [selectedFoodType, selectedCategory, selectedStatus, selectedDietary]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDonations();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedFoodType && selectedFoodType !== 'All') params.foodType = selectedFoodType;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedDietary && selectedDietary !== 'All') params.dietary = selectedDietary;
      if (search.trim()) params.search = search.trim();

      const res = await donationAPI.getAll(params);
      if (res.data?.success) {
        setDonations(res.data.donations || []);
      }
    } catch (err) {
      console.error('Failed to fetch food listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSuccess = (updatedDonation) => {
    setDonations((prev) =>
      prev.map((d) => (d._id === updatedDonation._id ? updatedDonation : d))
    );
  };

  // Section metric counts
  const vegCount = donations.filter((d) => (d.foodType || 'Veg') === 'Veg' || d.foodType === 'Vegan').length;
  const nonVegCount = donations.filter((d) => d.foodType === 'Non-Veg').length;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Utensils className="w-3.5 h-3.5" />
            <span>Surplus Redistribution Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Available Leftover Food
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Browse verified surplus meals with exact preparation timestamps from hotels, caterers, and food donors.
          </p>
        </div>

        <Link
          to="/donate"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-600 text-white font-bold text-sm shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List Surplus Food</span>
        </Link>
      </div>

      {/* Filter Bar with Veg / Non-Veg Sections */}
      <DonationFilters
        search={search}
        setSearch={setSearch}
        selectedFoodType={selectedFoodType}
        setSelectedFoodType={setSelectedFoodType}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedDietary={selectedDietary}
        setSelectedDietary={setSelectedDietary}
      />

      {/* Section Summary Header */}
      <div className="flex items-center justify-between px-2 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {selectedFoodType === 'All' ? 'All Live Listings' : `${selectedFoodType} Listings`}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-500 font-extrabold text-[11px]">
            {donations.length} available
          </span>
        </div>

        {selectedFoodType === 'All' && (
          <div className="hidden sm:flex items-center gap-3 text-slate-400 font-semibold text-[11px]">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{vegCount} Pure Veg</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{nonVegCount} Non-Veg</span>
            </span>
          </div>
        )}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="glass-card rounded-3xl p-6 h-72 animate-pulse flex flex-col justify-between border border-slate-200 dark:border-slate-800"
            >
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
                <div className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="w-full h-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>
              <div className="w-full h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      ) : donations.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            No Surplus Food Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No food donations currently match your selected section and filters. Try clearing your section or category filter.
          </p>
          <button
            onClick={() => {
              setSelectedFoodType('All');
              setSelectedCategory('All');
              setSelectedDietary('All');
              setSelectedStatus('all');
              setSearch('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-md"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <DonationCard
              key={donation._id}
              donation={donation}
              onClaim={(d) => setSelectedForClaim(d)}
            />
          ))}
        </div>
      )}

      {/* Claim Modal */}
      <ClaimModal
        donation={selectedForClaim}
        isOpen={!!selectedForClaim}
        onClose={() => setSelectedForClaim(null)}
        onSuccess={handleClaimSuccess}
      />
    </div>
  );
};
