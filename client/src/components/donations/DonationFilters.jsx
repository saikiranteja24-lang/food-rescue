import React from 'react';
import { Search, Filter, Utensils, Sparkles, Check } from 'lucide-react';

export const DonationFilters = ({
  search,
  setSearch,
  selectedFoodType = 'All',
  setSelectedFoodType,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedDietary,
  setSelectedDietary,
}) => {
  const foodTypeTabs = [
    { id: 'All', label: 'All Food', icon: '✨', badge: 'All Batches' },
    { id: 'Veg', label: 'Pure Veg Section', icon: '🟢', badge: '100% Vegetarian' },
    { id: 'Non-Veg', label: 'Non-Veg Section', icon: '🔴', badge: 'Poultry & Meat' },
    { id: 'Vegan', label: 'Vegan Section', icon: '🌱', badge: 'Plant-based' },
    { id: 'Contains Egg', label: 'Egg Section', icon: '🟡', badge: 'Eggitarian' },
  ];

  const categories = [
    'All',
    'Cooked Meals',
    'Bakery & Bread',
    'Fresh Produce',
    'Packaged Goods',
    'Dairy & Refrigerated',
    'Buffet Surplus',
  ];

  const dietaryOptions = [
    'All',
    'Vegetarian',
    'Vegan',
    'Halal',
    'Kosher',
    'Gluten-Free',
    'Dairy-Free',
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* Dedicated Veg vs Non-Veg Section Bar */}
      <div className="p-1.5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200/60 dark:border-slate-800/60 mb-1.5">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Browse by Food Type & Section
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {selectedFoodType === 'All' ? 'Showing all categories' : `Filtered by: ${selectedFoodType}`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {foodTypeTabs.map((tab) => {
            const isSelected = selectedFoodType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedFoodType(tab.id)}
                className={`py-3 px-3.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border text-center relative ${
                  isSelected
                    ? tab.id === 'Veg'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/25 ring-2 ring-emerald-500/30'
                      : tab.id === 'Non-Veg'
                      ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/25 ring-2 ring-rose-500/30'
                      : tab.id === 'Vegan'
                      ? 'bg-teal-600 text-white border-teal-500 shadow-lg shadow-teal-600/25 ring-2 ring-teal-500/30'
                      : tab.id === 'Contains Egg'
                      ? 'bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/25 ring-2 ring-amber-500/30'
                      : 'bg-brand-500 text-white border-brand-400 shadow-lg shadow-brand-500/25 ring-2 ring-brand-500/30'
                    : 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{tab.icon}</span>
                  <span className="font-extrabold">{tab.label}</span>
                </div>
                <span className={`text-[10px] font-medium ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Top Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search surplus meals (e.g., biryani, paneer, chicken, bread)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors shadow-sm"
          />
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setSelectedStatus('available')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === 'available'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            Available Now
          </button>
          <button
            onClick={() => setSelectedStatus('all')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === 'all'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            All Listings
          </button>
        </div>

        {/* Dietary Dropdown */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedDietary}
            onChange={(e) => setSelectedDietary(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            {dietaryOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-slate-900 text-white">
                Dietary: {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40 shadow-sm'
                : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
