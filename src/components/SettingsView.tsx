import React, { useState } from 'react';
import { ArrowLeft, Save, Moon, Sun, Globe, Percent, FileText, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { Settings, Currency } from '../types';
import { cn } from '../lib/utils';

interface SettingsViewProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onBack: () => void;
}

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

export default function SettingsView({ settings: initialSettings, onSave, onBack }: SettingsViewProps) {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div className={cn("min-h-screen flex flex-col", settings.darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900")}>
      {/* Header */}
      <header className={cn("p-4 flex items-center justify-between border-b", settings.darkMode ? "border-slate-800" : "border-slate-200")}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-black/5">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg">Settings</h1>
        </div>
        <button onClick={handleSave} className="bg-orange-500 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm text-sm">
          <Save size={16} /> Save Settings
        </button>
      </header>

      <div className="flex-1 overflow-auto p-6 space-y-8">
        {/* Appearance */}
        <section>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Appearance</label>
          <div className={cn("p-4 rounded-2xl flex items-center justify-between", settings.darkMode ? "bg-slate-900" : "bg-white shadow-sm")}>
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", settings.darkMode ? "bg-slate-800 text-amber-400" : "bg-amber-50 text-amber-600")}>
                {settings.darkMode ? <Moon size={24} /> : <Sun size={24} />}
              </div>
              <div>
                <p className="font-bold">Dark Mode</p>
                <p className="text-xs opacity-50">Switch to dark theme</p>
              </div>
            </div>
            <button 
              onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
              className={cn("w-12 h-6 rounded-full relative transition-colors", settings.darkMode ? "bg-orange-500" : "bg-slate-200")}
            >
              <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", settings.darkMode ? "right-1" : "left-1")} />
            </button>
          </div>
        </section>

        {/* Currency */}
        <section>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Currency</label>
          <div className={cn("p-4 rounded-2xl border", settings.darkMode ? "bg-slate-900 border-slate-800" : "bg-white shadow-sm border-slate-100")}>
            <select 
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value as Currency })}
              className="w-full bg-transparent font-bold focus:outline-none appearance-none"
            >
              {currencies.map(c => <option key={c.label} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </section>

        {/* Bill Options */}
        <section>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Bill Options</label>
          <div className={cn("rounded-2xl divide-y", settings.darkMode ? "bg-slate-900 divide-slate-800" : "bg-white shadow-sm divide-slate-100")}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", settings.darkMode ? "bg-slate-800 text-orange-400" : "bg-orange-50 text-orange-600")}>
                  <Percent size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Show Discount</p>
                  <p className="text-xs opacity-50">Discount % field on bills</p>
                </div>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, billOptions: { ...settings.billOptions, showDiscount: !settings.billOptions.showDiscount } })}
                className={cn("w-12 h-6 rounded-full relative transition-colors", settings.billOptions.showDiscount ? "bg-orange-500" : "bg-slate-200")}
              >
                <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", settings.billOptions.showDiscount ? "right-1" : "left-1")} />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", settings.darkMode ? "bg-slate-800 text-blue-400" : "bg-blue-50 text-blue-600")}>
                  <Percent size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Show GST</p>
                  <p className="text-xs opacity-50">GST % field on bills</p>
                </div>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, billOptions: { ...settings.billOptions, showGST: !settings.billOptions.showGST } })}
                className={cn("w-12 h-6 rounded-full relative transition-colors", settings.billOptions.showGST ? "bg-orange-500" : "bg-slate-200")}
              >
                <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", settings.billOptions.showGST ? "right-1" : "left-1")} />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", settings.darkMode ? "bg-slate-800 text-green-400" : "bg-green-50 text-green-600")}>
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Show Email</p>
                  <p className="text-xs opacity-50">Show business email on bills</p>
                </div>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, billOptions: { ...settings.billOptions, showEmail: !settings.billOptions.showEmail } })}
                className={cn("w-12 h-6 rounded-full relative transition-colors", settings.billOptions.showEmail ? "bg-orange-500" : "bg-slate-200")}
              >
                <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", settings.billOptions.showEmail ? "right-1" : "left-1")} />
              </button>
            </div>
          </div>
        </section>

        {/* Default Terms */}
        <section>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Default Terms & Conditions</label>
          <div className={cn("p-4 rounded-2xl space-y-4", settings.darkMode ? "bg-slate-900" : "bg-white shadow-sm")}>
            <div className="flex items-center gap-2 text-sm font-bold opacity-60">
              <FileText size={16} />
              Auto-filled on every new bill
            </div>
            <textarea 
              value={settings.defaultTerms}
              onChange={(e) => setSettings({ ...settings, defaultTerms: e.target.value })}
              className={cn("w-full h-24 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20",
                settings.darkMode ? "bg-slate-800" : "bg-slate-50")}
              placeholder="e.g. Thank you for your business!"
            />
          </div>
        </section>

        {/* Business Profile */}
        <section>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Business Profile</label>
          <div className={cn("rounded-2xl divide-y", settings.darkMode ? "bg-slate-900 divide-slate-800" : "bg-white shadow-sm divide-slate-100")}>
            <div className="p-4 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", settings.darkMode ? "bg-slate-800" : "bg-slate-50")}>
                <Building2 size={20} className="text-slate-400" />
              </div>
              <input 
                type="text"
                value={settings.businessProfile.name}
                onChange={(e) => setSettings({ ...settings, businessProfile: { ...settings.businessProfile, name: e.target.value } })}
                placeholder="Business Name"
                className="flex-1 bg-transparent font-bold focus:outline-none"
              />
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", settings.darkMode ? "bg-slate-800" : "bg-slate-50")}>
                <MapPin size={20} className="text-slate-400" />
              </div>
              <input 
                type="text"
                value={settings.businessProfile.address}
                onChange={(e) => setSettings({ ...settings, businessProfile: { ...settings.businessProfile, address: e.target.value } })}
                placeholder="Address"
                className="flex-1 bg-transparent font-bold focus:outline-none"
              />
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", settings.darkMode ? "bg-slate-800" : "bg-slate-50")}>
                <Phone size={20} className="text-slate-400" />
              </div>
              <input 
                type="tel"
                value={settings.businessProfile.phone}
                onChange={(e) => setSettings({ ...settings, businessProfile: { ...settings.businessProfile, phone: e.target.value } })}
                placeholder="Phone Number"
                className="flex-1 bg-transparent font-bold focus:outline-none"
              />
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", settings.darkMode ? "bg-slate-800" : "bg-slate-50")}>
                <Mail size={20} className="text-slate-400" />
              </div>
              <input 
                type="email"
                value={settings.businessProfile.email || ''}
                onChange={(e) => setSettings({ ...settings, businessProfile: { ...settings.businessProfile, email: e.target.value } })}
                placeholder="Email Address"
                className="flex-1 bg-transparent font-bold focus:outline-none"
              />
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", settings.darkMode ? "bg-slate-800" : "bg-slate-50")}>
                <Globe size={20} className="text-slate-400" />
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
                className="flex-1 bg-transparent font-bold focus:outline-none appearance-none"
              >
                <option value="">Select Country</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
