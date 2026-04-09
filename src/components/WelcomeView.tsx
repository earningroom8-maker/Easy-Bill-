import React, { useState } from 'react';
import { Settings, Currency } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Building2, Phone, MapPin, Globe, Mail, Save } from 'lucide-react';

interface WelcomeViewProps {
  onComplete: (settings: Settings) => void;
  initialSettings: Settings;
}

const countries = [
  'Pakistan', 'India', 'United States', 'United Kingdom', 'UAE', 'Saudi Arabia', 'Bangladesh', 
  'Canada', 'Australia', 'Germany', 'France', 'Italy', 'Spain', 'Turkey', 'China', 'Japan',
  'Kuwait', 'Oman', 'Qatar', 'Bahrain', 'Malaysia', 'Singapore', 'South Africa', 'Other'
];

const countryToCurrency: Record<string, Currency> = {
  'Pakistan': 'Rs',
  'India': 'Rs',
  'United States': '$',
  'United Kingdom': '£',
  'UAE': 'AED',
  'Saudi Arabia': 'SR',
  'Bangladesh': '৳',
  'Canada': '$',
  'Australia': '$',
  'Germany': '€',
  'France': '€',
  'Italy': '€',
  'Spain': '€',
  'Turkey': '₺',
  'China': '¥',
  'Japan': '¥',
  'Kuwait': 'KD',
  'Oman': 'RO',
  'Qatar': 'QR',
  'Bahrain': 'BD',
  'Malaysia': 'RM',
  'Singapore': '$',
  'South Africa': 'R',
};

const currencies: { label: string; value: Currency; symbol: string }[] = [
  { label: 'Pakistani Rupee (Rs)', value: 'Rs', symbol: 'Rs' },
  { label: 'Indian Rupee (₹)', value: 'Rs', symbol: '₹' },
  { label: 'US Dollar ($)', value: '$', symbol: '$' },
  { label: 'Euro (€)', value: '€', symbol: '€' },
  { label: 'British Pound (£)', value: '£', symbol: '£' },
  { label: 'UAE Dirham (AED)', value: 'AED', symbol: 'AED' },
  { label: 'Saudi Riyal (SR)', value: 'SR', symbol: 'SR' },
  { label: 'Bangladeshi Taka (৳)', value: '৳', symbol: '৳' },
  { label: 'Turkish Lira (₺)', value: '₺', symbol: '₺' },
  { label: 'Chinese Yuan (¥)', value: '¥', symbol: '¥' },
  { label: 'Japanese Yen (¥)', value: '¥', symbol: '¥' },
  { label: 'Kuwaiti Dinar (KD)', value: 'KD', symbol: 'KD' },
  { label: 'Omani Rial (RO)', value: 'RO', symbol: 'RO' },
  { label: 'Qatari Rial (QR)', value: 'QR', symbol: 'QR' },
  { label: 'Bahraini Dinar (BD)', value: 'BD', symbol: 'BD' },
  { label: 'Malaysian Ringgit (RM)', value: 'RM', symbol: 'RM' },
  { label: 'South African Rand (R)', value: 'R', symbol: 'R' },
];

export default function WelcomeView({ onComplete, initialSettings }: WelcomeViewProps) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!settings.businessProfile.name) {
      setError('Please enter business name');
      return;
    }
    if (!settings.businessProfile.phone) {
      setError('Please enter phone number');
      return;
    }
    onComplete(settings);
  };

  return (
    <div className={cn("min-h-screen flex flex-col p-6", settings.darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900")}>
      <div className="max-w-md mx-auto w-full space-y-8 py-12">
        <div className="text-center space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black tracking-tight text-orange-500"
          >
            Welcome
          </motion.h1>
          <p className="text-slate-500 text-sm">Setup your business profile to get started</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={cn("p-6 rounded-[32px] space-y-6", settings.darkMode ? "bg-slate-900" : "bg-white shadow-xl shadow-orange-500/5")}
        >
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Profile</label>
            
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}
            
            {/* Business Name */}
            <div className="space-y-1">
              <div className={cn("flex items-center gap-3 p-4 rounded-2xl border transition-all", settings.darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100 focus-within:border-orange-500")}>
                <Building2 size={20} className="text-orange-500" />
                <input 
                  type="text"
                  placeholder="Business Name"
                  value={settings.businessProfile.name}
                  onChange={(e) => setSettings({ ...settings, businessProfile: { ...settings.businessProfile, name: e.target.value } })}
                  className="bg-transparent w-full focus:outline-none font-bold"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <div className={cn("flex items-center gap-3 p-4 rounded-2xl border transition-all", settings.darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100 focus-within:border-orange-500")}>
                <Phone size={20} className="text-orange-500" />
                <input 
                  type="tel"
                  placeholder="Phone Number (03...)"
                  value={settings.businessProfile.phone}
                  onChange={(e) => setSettings({ ...settings, businessProfile: { ...settings.businessProfile, phone: e.target.value } })}
                  className="bg-transparent w-full focus:outline-none font-bold"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <div className={cn("flex items-center gap-3 p-4 rounded-2xl border transition-all", settings.darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100 focus-within:border-orange-500")}>
                <MapPin size={20} className="text-orange-500" />
                <input 
                  type="text"
                  placeholder="Address"
                  value={settings.businessProfile.address}
                  onChange={(e) => setSettings({ ...settings, businessProfile: { ...settings.businessProfile, address: e.target.value } })}
                  className="bg-transparent w-full focus:outline-none font-bold"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <div className={cn("flex items-center gap-3 p-4 rounded-2xl border transition-all", settings.darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100 focus-within:border-orange-500")}>
                <Mail size={20} className="text-orange-500" />
                <input 
                  type="email"
                  placeholder="Email (Optional)"
                  value={settings.businessProfile.email || ''}
                  onChange={(e) => setSettings({ ...settings, businessProfile: { ...settings.businessProfile, email: e.target.value } })}
                  className="bg-transparent w-full focus:outline-none font-bold"
                />
              </div>
            </div>

            {/* Country Select */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Globe size={12} /> Country select
              </div>
              <select 
                value={settings.businessProfile.country || ''}
                onChange={(e) => {
                  const country = e.target.value;
                  const currency = countryToCurrency[country] || settings.currency;
                  setSettings({ 
                    ...settings, 
                    businessProfile: { ...settings.businessProfile, country },
                    currency: currency
                  });
                }}
                className={cn("w-full p-4 rounded-2xl border appearance-none focus:outline-none font-bold", settings.darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100")}
              >
                <option value="">Select Country</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Currency Select */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="w-3 h-3 flex items-center justify-center font-black">?</span> Currency select
              </div>
              <select 
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value as Currency })}
                className={cn("w-full p-4 rounded-2xl border appearance-none focus:outline-none font-bold", settings.darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100")}
              >
                {currencies.map(c => <option key={c.label} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-orange-500 text-white py-5 rounded-[24px] font-black text-lg shadow-lg shadow-orange-500/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <Save size={24} /> Save
          </button>
        </motion.div>
      </div>
    </div>
  );
}
