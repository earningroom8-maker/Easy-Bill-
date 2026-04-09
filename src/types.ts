export type Currency = 'Rs' | '$' | '€' | '£' | 'AED' | 'SR' | '৳' | '₺' | '¥' | 'KD' | 'RO' | 'QR' | 'BD' | 'RM' | 'R';

export interface BusinessProfile {
  name: string;
  address: string;
  phone: string;
  email?: string;
  country?: string;
}

export interface BillOptions {
  showDiscount: boolean;
  showGST: boolean;
  showEmail: boolean;
}

export interface Settings {
  darkMode: boolean;
  currency: Currency;
  billOptions: BillOptions;
  defaultTerms: string;
  businessProfile: BusinessProfile;
}

export interface Note {
  id: string;
  customerName: string;
  contactNo: string;
  date: string;
  content: string;
  createdAt: number;
}

export interface BillItem {
  id: string;
  name: string;
  qty: number;
  rate: number;
}

export interface Bill {
  id: string;
  billNo: string;
  customerName: string;
  date: string;
  items: BillItem[];
  received: number;
  createdAt: number;
  isCleared?: boolean;
}

export interface Quotation {
  id: string;
  quotationNo: string;
  customerName: string;
  date: string;
  items: BillItem[];
  createdAt: number;
  validUntil: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  lastUpdated: number;
}
