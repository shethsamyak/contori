// ============================================================
// COUNTORI — Core Type Definitions
// ============================================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'accountant' | 'client';
  avatar_url?: string;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  legal_name?: string;
  gstin?: string;
  pan?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  financial_year_start: number;
  currency: string;
  logo_url?: string;
  created_at: string;
}

export interface UserCompany {
  id: string;
  user_id: string;
  company_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  is_default: boolean;
  company?: Company;
}

export interface Category {
  id: string;
  company_id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  is_default: boolean;
  parent_id?: string;
}

export interface Account {
  id: string;
  company_id: string;
  name: string;
  type: 'bank' | 'cash' | 'credit_card' | 'wallet' | 'other';
  account_number?: string;
  bank_name?: string;
  ifsc_code?: string;
  opening_balance: number;
  current_balance: number;
  currency: string;
  is_active: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  company_id: string;
  account_id?: string;
  category_id?: string;
  client_id?: string;
  vendor_id?: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  tax_amount: number;
  description?: string;
  reference_number?: string;
  date: string;
  status: 'pending' | 'completed' | 'reconciled' | 'void';
  payment_method?: string;
  notes?: string;
  receipt_url?: string;
  is_recurring: boolean;
  category_name?: string;
  account_name?: string;
  client_name?: string;
  vendor_name?: string;
  created_at: string;
}

export interface Client {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  gstin?: string;
  pan?: string;
  billing_address?: string;
  shipping_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  notes?: string;
  outstanding_amount: number;
  created_at: string;
}

export interface Vendor {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  gstin?: string;
  pan?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  notes?: string;
  outstanding_amount: number;
  created_at: string;
}

export interface Invoice {
  id: string;
  company_id: string;
  client_id?: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  amount_paid: number;
  notes?: string;
  terms?: string;
  is_recurring: boolean;
  client_name?: string;
  items?: InvoiceItem[];
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  hsn_code?: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  sort_order: number;
}

export interface Payment {
  id: string;
  company_id: string;
  invoice_id?: string;
  client_id?: string;
  account_id?: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  reference_number?: string;
  notes?: string;
}

// Dashboard types
export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalReceivables: number;
  totalPayables: number;
  cashBalance: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

export interface CategoryBreakdown {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth types
export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
  companyId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  company_name: string;
}

// Filter types
export interface TransactionFilters {
  type?: string;
  category_id?: string;
  account_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface InvoiceFilters {
  status?: string;
  client_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  limit?: number;
}
