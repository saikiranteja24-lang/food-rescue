import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  Sparkles,
  Bot,
  MapPin,
  Clock,
  ShieldCheck,
  Utensils,
  ArrowRight,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { donationAPI, chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FOOD_IMAGE_PRESETS, getFoodImageUrl } from '../utils/foodImages';

export const CreateDonationPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Helper for formatting local datetime-local string
  const toLocalISO = (date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  // Set default prep to 1 hour ago and expiry to 4 hours from now
  const defaultPrep = toLocalISO(new Date(Date.now() - 1 * 60 * 60 * 1000));
  const defaultExpiry = toLocalISO(new Date(Date.now() + 4 * 60 * 60 * 1000));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Cooked Meals',
    foodType: 'Veg',
    quantity: '',
    quantityUnit: 'servings',
    preparedTime: defaultPrep,
    expiryTime: defaultExpiry,
    storageCondition: 'Room Temperature',
    dietaryInfo: ['Vegetarian'],
    imageUrl: '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    instructions: '',
    contactPhone: user?.phone || '',
    contactPerson: user?.name || '',
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const foodTypeOptions = [
    {
      id: 'Veg',
      label: 'Pure Vegetarian',
      shortLabel: 'Veg',
      desc: '100% Meat & Egg-free',
      icon: '🟢',
      badgeColor: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      activeColor: 'bg-emerald-500 text-white shadow-emerald-500/25',
    },
    {
      id: 'Non-Veg',
      label: 'Non-Vegetarian',
      shortLabel: 'Non-Veg',
      desc: 'Chicken, Meat or Seafood',
      icon: '🔴',
      badgeColor: 'border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400',
      activeColor: 'bg-rose-600 text-white shadow-rose-500/25',
    },
    {
      id: 'Contains Egg',
      label: 'Contains Egg',
      shortLabel: 'Eggitarian',
      desc: 'Bakery or Egg Dishes',
      icon: '🟡',
      badgeColor: 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400',
      activeColor: 'bg-amber-500 text-white shadow-amber-500/25',
    },
    {
      id: 'Vegan',
      label: '100% Vegan',
      shortLabel: 'Plant-Based',
      desc: 'Zero Dairy, Honey, Animal Products',
      icon: '🌱',
      badgeColor: 'border-teal-500/50 bg-teal-500/10 text-teal-600 dark:text-teal-400',
      activeColor: 'bg-teal-600 text-white shadow-teal-500/25',
    },
  ];

  const categories = [
    'Cooked Meals',
    'Bakery & Bread',
    'Fresh Produce',
    'Packaged Goods',
    'Dairy & Refrigerated',
    'Buffet Surplus',
    'Other',
  ];

  const storageOptions = [
    'Room Temperature',
    'Refrigerated (0-4°C)',
    'Frozen (-18°C)',
    'Hot Insulated (>60°C)',
  ];

  const dietaryTags = [
    'Vegetarian',
    'Vegan',
    'Halal',
    'Kosher',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
  ];

  const handleDietaryToggle = (tag) => {
    setFormData((prev) => ({
      ...prev,
      dietaryInfo: prev.dietaryInfo.includes(tag)
        ? prev.dietaryInfo.filter((t) => t !== tag)
        : [...prev.dietaryInfo, tag],
    }));
  };

  const handlePrepQuickSet = (hoursAgo) => {
    const target = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    setFormData((prev) => ({
      ...prev,
      preparedTime: toLocalISO(target),
    }));
  };

  // Ask Replate AI for storage and shelf-life recommendation based on item title
  const handleAiShelfLifeCheck = async () => {
    if (!formData.title.trim()) {
      showToast('Please enter a food title first (e.g., Vegetable Biryani)', 'info');
      return;
    }

    setAiLoading(true);
    try {
      const prompt = `I am donating surplus ${formData.foodType} food: "${formData.title}" in category "${formData.category}". Briefly provide: 1) Recommended safe storage condition, 2) Safe consumption shelf life in hours from preparation, 3) Critical temperature or safety tip for ${formData.foodType}. Keep answer under 60 words.`;
      const res = await chatAPI.sendMessage({ message: prompt });
      if (res.data?.success && res.data.message) {
        setAiSuggestion(res.data.message.content);
        showToast('Replate AI safety guidelines generated!', 'success');
      }
    } catch (err) {
      showToast('Could not fetch AI advice at this time', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to list food donations', 'info');
      navigate('/login');
      return;
    }

    if (!formData.title || !formData.description || !formData.quantity || !formData.contactPhone) {
      showToast('Please complete all required fields', 'error');
      return;
    }

    setSubmitting(true);
    const resolvedImage = formData.imageUrl || getFoodImageUrl({ title: formData.title, category: formData.category, foodType: formData.foodType }) || '';

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        foodType: formData.foodType,
        quantity: Number(formData.quantity),
        quantityUnit: formData.quantityUnit,
        preparedTime: new Date(formData.preparedTime),
        expiryTime: new Date(formData.expiryTime),
        storageCondition: formData.storageCondition,
        dietaryInfo: formData.dietaryInfo,
        imageUrl: resolvedImage,
        image: resolvedImage,
        pickupLocation: {
          street: formData.street || 'Main Avenue',
          city: formData.city || 'Central District',
          state: formData.state,
          zipCode: formData.zipCode,
          instructions: formData.instructions,
        },
        contactPhone: formData.contactPhone,
        contactPerson: formData.contactPerson,
      };

      const res = await donationAPI.create(payload);
      if (res.data?.success) {
        showToast('Surplus food posted! Local shelters have been notified. 🌱', 'success');
        navigate('/donations');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to list donation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Surplus Food Dispatch</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          List Surplus Food for Donation
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
          Share surplus meals from restaurants, banquet halls, or catering events with verified community shelters before quality degrades.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8"
      >
        {/* Section 1: Food Details */}
        <div className="space-y-6">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Utensils className="w-4 h-4 text-brand-400" />
            <span>1. Food Classification & Details</span>
          </h3>

          {/* Food Type Selector (Veg / Non-Veg / Egg / Vegan) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
              <span>Food Dietary Type *</span>
              <span className="text-[11px] font-semibold text-brand-500 lowercase">
                Selected: <strong className="uppercase">{formData.foodType}</strong>
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {foodTypeOptions.map((opt) => {
                const isSelected = formData.foodType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        foodType: opt.id,
                        dietaryInfo:
                          opt.id === 'Veg'
                            ? Array.from(new Set([...prev.dietaryInfo.filter((t) => !['Contains Meat', 'Contains Poultry', 'Contains Seafood'].includes(t)), 'Vegetarian']))
                            : opt.id === 'Non-Veg'
                            ? Array.from(new Set([...prev.dietaryInfo.filter((t) => t !== 'Vegetarian'), 'Contains Poultry']))
                            : opt.id === 'Vegan'
                            ? Array.from(new Set([...prev.dietaryInfo, 'Vegan', 'Vegetarian']))
                            : prev.dietaryInfo,
                      }));
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group ${
                      isSelected
                        ? `${opt.activeColor} shadow-lg ring-2 ring-brand-500/50`
                        : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{opt.icon}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-black ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {opt.label}
                      </p>
                      <p className={`text-[10px] mt-0.5 leading-tight ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Food Title *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={formData.foodType === 'Non-Veg' ? 'e.g., Roasted Lemon Herb Chicken & Steamed Rice' : 'e.g., Fresh Vegetable Biryani with Paneer Makhani'}
                  className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Shelf-life Advisor Trigger Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleAiShelfLifeCheck}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-600 dark:text-brand-400 hover:bg-brand-500/25 transition-all shadow-sm"
            >
              <Bot className="w-4 h-4" />
              <span>{aiLoading ? 'Groq AI Evaluating...' : `✨ Ask Replate AI for ${formData.foodType} Safety & Shelf-Life Tips`}</span>
            </button>
          </div>

          {aiSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-brand-950/30 border border-brand-500/30 text-xs text-brand-200 leading-relaxed flex items-start gap-3"
            >
              <Sparkles className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-brand-400 mb-1">Replate AI Safety Insight:</strong>
                {aiSuggestion}
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Description & Packaging Info *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the items, ingredients, how they are packed (e.g., in insulated cambros, sealed food-grade containers), and storage state..."
              className="w-full text-sm p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Quantity & Units */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g. 50"
                  className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Unit *
                </label>
                <select
                  value={formData.quantityUnit}
                  onChange={(e) => setFormData({ ...formData, quantityUnit: e.target.value })}
                  className="w-full text-sm px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="servings">servings</option>
                  <option value="kg">kg</option>
                  <option value="boxes">boxes</option>
                  <option value="trays">trays</option>
                  <option value="packets">packets</option>
                </select>
              </div>
            </div>

            {/* Preparation Time & Expiry Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-400" />
                    <span>Prepared Time *</span>
                  </span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.preparedTime}
                  onChange={(e) => setFormData({ ...formData, preparedTime: e.target.value })}
                  className="w-full text-xs px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() => handlePrepQuickSet(0)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white transition-colors"
                  >
                    Just now
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrepQuickSet(1)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white transition-colors"
                  >
                    1h ago
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrepQuickSet(2)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white transition-colors"
                  >
                    2h ago
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrepQuickSet(4)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white transition-colors"
                  >
                    4h ago
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                    <span>Safe Until (Expiry) *</span>
                  </span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.expiryTime}
                  onChange={(e) => setFormData({ ...formData, expiryTime: e.target.value })}
                  className="w-full text-xs px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
                <p className="text-[10px] text-slate-400 mt-1.5">
                  Approx. safe consumption window for shelters
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Storage & Dietary */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span>2. Storage & Dietary Verification</span>
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Current Storage Condition
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {storageOptions.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setFormData({ ...formData, storageCondition: opt })}
                  className={`p-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    formData.storageCondition === opt
                      ? 'bg-brand-500/20 border-brand-500 text-brand-600 dark:text-brand-300 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Dietary Tags (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {dietaryTags.map((tag) => {
                const selected = formData.dietaryInfo.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleDietaryToggle(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-brand-500 text-white border-brand-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2.5: Food Photo */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <ImageIcon className="w-4 h-4 text-brand-400" />
            <span>3. Food Photo <span className="text-xs font-normal text-slate-400 ml-1">(Optional — auto-suggested if left blank)</span></span>
          </h3>

          {/* Preset image selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select a Preset Photo
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {FOOD_IMAGE_PRESETS.map((preset) => {
                const isSelected = formData.imageUrl === preset.url;
                return (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => setFormData({ ...formData, imageUrl: isSelected ? '' : preset.url })}
                    className={`relative rounded-xl overflow-hidden h-20 border-2 transition-all ${
                      isSelected ? 'border-brand-500 ring-2 ring-brand-500/50' : 'border-transparent hover:border-brand-500/40'
                    }`}
                  >
                    <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-end p-1">
                      <span className="text-[9px] text-white font-semibold leading-tight line-clamp-2">{preset.title}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-brand-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom URL input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Or Enter Custom Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/my-food-photo.jpg"
              className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Live preview */}
          {(formData.imageUrl || formData.title) && (
            <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <img
                src={formData.imageUrl || getFoodImageUrl({ title: formData.title, category: formData.category, foodType: formData.foodType })}
                alt="Food preview"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80'; }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Preview</p>
                <p className="text-sm font-bold">{formData.title || 'Your food listing'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Pickup Location */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>4. Pickup Location & Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="100 Grand Avenue, Back Kitchen Entrance"
                className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Downtown"
                className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+1 (555) 234-5678"
                className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Head Chef / Banquet Captain"
                className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white font-bold text-base shadow-xl shadow-brand-500/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{submitting ? 'Publishing Food Listing...' : 'Publish Food Donation Listing'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
