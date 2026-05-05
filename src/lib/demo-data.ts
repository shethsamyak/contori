// ============================================================
// COUNTORI — In-Memory Demo Data Store
// Allows the app to function without PostgreSQL for demo
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  User, Company, Category, Account, Transaction,
  Client, Vendor, Invoice, InvoiceItem, Payment
} from './types';

// ---- Demo user & company ----
const DEMO_USER_ID = 'demo-user-001';
const DEMO_COMPANY_ID = 'demo-company-001';

const demoUser: User & { password_hash: string } = {
  id: DEMO_USER_ID,
  email: 'demo@countori.com',
  full_name: 'Arjun Kapoor',
  role: 'admin',
  password_hash: '$2a$12$dummyhashnotreal', // not used in demo mode
  created_at: '2025-01-01T00:00:00Z',
};

const demoCompany: Company = {
  id: DEMO_COMPANY_ID,
  name: 'Kapoor Enterprises',
  legal_name: 'Kapoor Enterprises Pvt Ltd',
  gstin: '29ABCDE1234F1Z5',
  pan: 'ABCDE1234F',
  address: '42, MG Road',
  city: 'Bengaluru',
  state: 'Karnataka',
  country: 'India',
  postal_code: '560001',
  phone: '+91 9876543210',
  email: 'accounts@kapoorenterprises.in',
  financial_year_start: 4,
  currency: 'INR',
  created_at: '2025-01-01T00:00:00Z',
};

// ---- Categories ----
const incomeCategories: Category[] = [
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Sales Revenue', type: 'income', icon: '', color: '#10b981', is_default: true },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Service Income', type: 'income', icon: '', color: '#3b82f6', is_default: true },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Interest Income', type: 'income', icon: '', color: '#8b5cf6', is_default: true },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Rental Income', type: 'income', icon: '', color: '#f59e0b', is_default: true },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Commission', type: 'income', icon: '', color: '#ec4899', is_default: true },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Other Income', type: 'income', icon: '', color: '#6b7280', is_default: true },
];

const expenseCategories: Category[] = [
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Rent & Lease', type: 'expense', icon: '', color: '#ef4444', is_default: true },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Salaries & Wages', type: 'expense', icon: '', color: '#f97316', is_default: true },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Utilities', type: 'expense', icon: '', color: '#eab308', is_default: true },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Office Supplies', type: 'expense', icon: '', color: '#84cc16', is_default: true },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Travel & Transport', type: 'expense', icon: '', color: '#06b6d4', is_default: true },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Marketing', type: 'expense', icon: '', color: '#8b5cf6', is_default: true },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Software & Subscriptions', type: 'expense', icon: '', color: '#6366f1', is_default: true },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Professional Fees', type: 'expense', icon: '', color: '#14b8a6', is_default: true },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Miscellaneous', type: 'expense', icon: '', color: '#6b7280', is_default: true },
];

const allCategories = [...incomeCategories, ...expenseCategories];

// ---- Accounts ----
const accounts: Account[] = [
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'HDFC Business Account', type: 'bank', account_number: 'XXXX4521', bank_name: 'HDFC Bank', ifsc_code: 'HDFC0001234', opening_balance: 500000, current_balance: 847250, currency: 'INR', is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Petty Cash', type: 'cash', opening_balance: 50000, current_balance: 32400, currency: 'INR', is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'ICICI Credit Card', type: 'credit_card', account_number: 'XXXX9087', bank_name: 'ICICI Bank', opening_balance: 0, current_balance: -45600, currency: 'INR', is_active: true, created_at: '2025-01-05T00:00:00Z' },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Paytm Wallet', type: 'wallet', opening_balance: 10000, current_balance: 8500, currency: 'INR', is_active: true, created_at: '2025-02-01T00:00:00Z' },
];

// ---- Clients ----
const clients: Client[] = [
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'TechNova Solutions', email: 'accounts@technova.in', phone: '+91 9876500001', gstin: '29AABCT1234F1Z5', billing_address: '100 Tech Park, Whitefield', city: 'Bengaluru', state: 'Karnataka', postal_code: '560066', outstanding_amount: 125000, created_at: '2025-01-10T00:00:00Z' },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'GreenLeaf Organics', email: 'finance@greenleaf.co.in', phone: '+91 9876500002', gstin: '27AABCG5678H2Z3', billing_address: '22 Farm Road, Andheri', city: 'Mumbai', state: 'Maharashtra', postal_code: '400058', outstanding_amount: 67500, created_at: '2025-01-15T00:00:00Z' },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'MetroBuild Infra', email: 'billing@metrobuild.in', phone: '+91 9876500003', billing_address: '5 Industrial Area, Phase 2', city: 'Gurugram', state: 'Haryana', postal_code: '122001', outstanding_amount: 250000, created_at: '2025-02-01T00:00:00Z' },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Pinnacle Education', email: 'admin@pinnacle.edu.in', phone: '+91 9876500004', billing_address: '78 University Road', city: 'Pune', state: 'Maharashtra', postal_code: '411007', outstanding_amount: 0, created_at: '2025-02-10T00:00:00Z' },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'CloudSpire Technologies', email: 'ap@cloudspire.io', phone: '+91 9876500005', billing_address: '12 IT Corridor, OMR', city: 'Chennai', state: 'Tamil Nadu', postal_code: '600119', outstanding_amount: 180000, created_at: '2025-03-01T00:00:00Z' },
];

// ---- Vendors ----
const vendors: Vendor[] = [
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'OfficeMax Supplies', email: 'sales@officemax.in', phone: '+91 9800000001', address: '15 Commercial Street', city: 'Bengaluru', state: 'Karnataka', postal_code: '560001', outstanding_amount: 12500, created_at: '2025-01-05T00:00:00Z' },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'AWS India', email: 'billing@aws.amazon.com', phone: '+91 1800000000', address: 'World Trade Center', city: 'Bengaluru', state: 'Karnataka', postal_code: '560001', outstanding_amount: 35000, created_at: '2025-01-05T00:00:00Z' },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Prestige Properties', email: 'leasing@prestige.in', phone: '+91 9800000003', address: '1 Prestige Tower, MG Road', city: 'Bengaluru', state: 'Karnataka', postal_code: '560001', outstanding_amount: 0, created_at: '2025-01-05T00:00:00Z' },
  { id: uuidv4(), company_id: DEMO_COMPANY_ID, name: 'Dazzle Digital Marketing', email: 'hello@dazzle.in', phone: '+91 9800000004', address: '44 Koramangala', city: 'Bengaluru', state: 'Karnataka', postal_code: '560034', outstanding_amount: 25000, created_at: '2025-02-01T00:00:00Z' },
];

// ---- Transactions (last 12 months of realistic data) ----
function generateTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  const months = ['2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03'];

  const incomeAmounts = [420000, 385000, 510000, 475000, 395000, 530000, 490000, 445000, 620000, 550000, 480000, 575000];
  const expenseAmounts = [285000, 310000, 295000, 340000, 275000, 320000, 305000, 290000, 350000, 315000, 280000, 325000];

  months.forEach((month, idx) => {
    // Income transactions
    const incomeTotal = incomeAmounts[idx];
    const salesPortion = Math.round(incomeTotal * 0.65);
    const servicePortion = Math.round(incomeTotal * 0.25);
    const otherPortion = incomeTotal - salesPortion - servicePortion;

    txns.push({
      id: uuidv4(), company_id: DEMO_COMPANY_ID, account_id: accounts[0].id,
      category_id: incomeCategories[0].id, client_id: clients[idx % clients.length].id,
      type: 'income', amount: salesPortion, tax_amount: Math.round(salesPortion * 0.18),
      description: `Sales revenue - ${month}`, date: `${month}-05`,
      status: 'completed', payment_method: 'bank_transfer',
      category_name: 'Sales Revenue', account_name: accounts[0].name,
      client_name: clients[idx % clients.length].name,
      is_recurring: false, created_at: `${month}-05T10:00:00Z`,
    });

    txns.push({
      id: uuidv4(), company_id: DEMO_COMPANY_ID, account_id: accounts[0].id,
      category_id: incomeCategories[1].id, client_id: clients[(idx + 1) % clients.length].id,
      type: 'income', amount: servicePortion, tax_amount: Math.round(servicePortion * 0.18),
      description: `Consulting & services - ${month}`, date: `${month}-12`,
      status: 'completed', payment_method: 'bank_transfer',
      category_name: 'Service Income', account_name: accounts[0].name,
      client_name: clients[(idx + 1) % clients.length].name,
      is_recurring: false, created_at: `${month}-12T10:00:00Z`,
    });

    txns.push({
      id: uuidv4(), company_id: DEMO_COMPANY_ID, account_id: accounts[0].id,
      category_id: incomeCategories[5].id,
      type: 'income', amount: otherPortion, tax_amount: 0,
      description: `Interest & other income - ${month}`, date: `${month}-20`,
      status: 'completed', payment_method: 'bank_transfer',
      category_name: 'Other Income', account_name: accounts[0].name,
      is_recurring: false, created_at: `${month}-20T10:00:00Z`,
    });

    // Expense transactions
    const expTotal = expenseAmounts[idx];
    const rentAmount = 85000;
    const salaryAmount = Math.round(expTotal * 0.45);
    const utilitiesAmount = 15000;
    const marketingAmount = Math.round(expTotal * 0.12);
    const miscAmount = expTotal - rentAmount - salaryAmount - utilitiesAmount - marketingAmount;

    txns.push({
      id: uuidv4(), company_id: DEMO_COMPANY_ID, account_id: accounts[0].id,
      category_id: expenseCategories[0].id, vendor_id: vendors[2].id,
      type: 'expense', amount: rentAmount, tax_amount: Math.round(rentAmount * 0.18),
      description: `Office rent - ${month}`, date: `${month}-01`,
      status: 'completed', payment_method: 'bank_transfer',
      category_name: 'Rent & Lease', account_name: accounts[0].name,
      vendor_name: vendors[2].name,
      is_recurring: true, created_at: `${month}-01T10:00:00Z`,
    });

    txns.push({
      id: uuidv4(), company_id: DEMO_COMPANY_ID, account_id: accounts[0].id,
      category_id: expenseCategories[1].id,
      type: 'expense', amount: salaryAmount, tax_amount: 0,
      description: `Staff salaries - ${month}`, date: `${month}-28`,
      status: 'completed', payment_method: 'bank_transfer',
      category_name: 'Salaries & Wages', account_name: accounts[0].name,
      is_recurring: true, created_at: `${month}-28T10:00:00Z`,
    });

    txns.push({
      id: uuidv4(), company_id: DEMO_COMPANY_ID, account_id: accounts[0].id,
      category_id: expenseCategories[2].id,
      type: 'expense', amount: utilitiesAmount, tax_amount: Math.round(utilitiesAmount * 0.18),
      description: `Electricity & water - ${month}`, date: `${month}-15`,
      status: 'completed', payment_method: 'bank_transfer',
      category_name: 'Utilities', account_name: accounts[0].name,
      is_recurring: false, created_at: `${month}-15T10:00:00Z`,
    });

    txns.push({
      id: uuidv4(), company_id: DEMO_COMPANY_ID, account_id: accounts[2].id,
      category_id: expenseCategories[5].id, vendor_id: vendors[3].id,
      type: 'expense', amount: marketingAmount, tax_amount: Math.round(marketingAmount * 0.18),
      description: `Digital marketing - ${month}`, date: `${month}-10`,
      status: 'completed', payment_method: 'card',
      category_name: 'Marketing', account_name: accounts[2].name,
      vendor_name: vendors[3].name,
      is_recurring: false, created_at: `${month}-10T10:00:00Z`,
    });

    txns.push({
      id: uuidv4(), company_id: DEMO_COMPANY_ID, account_id: accounts[1].id,
      category_id: expenseCategories[8].id,
      type: 'expense', amount: miscAmount, tax_amount: 0,
      description: `Office & misc expenses - ${month}`, date: `${month}-18`,
      status: 'completed', payment_method: 'cash',
      category_name: 'Miscellaneous', account_name: accounts[1].name,
      is_recurring: false, created_at: `${month}-18T10:00:00Z`,
    });
  });

  return txns;
}

// ---- Invoices ----
function generateInvoices(): Invoice[] {
  return [
    {
      id: uuidv4(), company_id: DEMO_COMPANY_ID, client_id: clients[0].id,
      invoice_number: 'INV-2026-001', status: 'paid',
      issue_date: '2026-01-05', due_date: '2026-02-04',
      subtotal: 150000, tax_rate: 18, tax_amount: 27000, discount_amount: 0,
      total: 177000, amount_paid: 177000, client_name: clients[0].name,
      notes: 'Software development services', terms: 'Net 30',
      is_recurring: false, created_at: '2026-01-05T10:00:00Z',
    },
    {
      id: uuidv4(), company_id: DEMO_COMPANY_ID, client_id: clients[1].id,
      invoice_number: 'INV-2026-002', status: 'paid',
      issue_date: '2026-01-15', due_date: '2026-02-14',
      subtotal: 85000, tax_rate: 18, tax_amount: 15300, discount_amount: 5000,
      total: 95300, amount_paid: 95300, client_name: clients[1].name,
      notes: 'Website redesign project', terms: 'Net 30',
      is_recurring: false, created_at: '2026-01-15T10:00:00Z',
    },
    {
      id: uuidv4(), company_id: DEMO_COMPANY_ID, client_id: clients[2].id,
      invoice_number: 'INV-2026-003', status: 'overdue',
      issue_date: '2026-02-01', due_date: '2026-03-03',
      subtotal: 250000, tax_rate: 18, tax_amount: 45000, discount_amount: 0,
      total: 295000, amount_paid: 0, client_name: clients[2].name,
      notes: 'ERP implementation - Phase 1', terms: 'Net 30',
      is_recurring: false, created_at: '2026-02-01T10:00:00Z',
    },
    {
      id: uuidv4(), company_id: DEMO_COMPANY_ID, client_id: clients[4].id,
      invoice_number: 'INV-2026-004', status: 'sent',
      issue_date: '2026-03-01', due_date: '2026-03-31',
      subtotal: 180000, tax_rate: 18, tax_amount: 32400, discount_amount: 10000,
      total: 202400, amount_paid: 0, client_name: clients[4].name,
      notes: 'Cloud migration services', terms: 'Net 30',
      is_recurring: false, created_at: '2026-03-01T10:00:00Z',
    },
    {
      id: uuidv4(), company_id: DEMO_COMPANY_ID, client_id: clients[0].id,
      invoice_number: 'INV-2026-005', status: 'partially_paid',
      issue_date: '2026-03-10', due_date: '2026-04-09',
      subtotal: 125000, tax_rate: 18, tax_amount: 22500, discount_amount: 0,
      total: 147500, amount_paid: 75000, client_name: clients[0].name,
      notes: 'Monthly retainer - March 2026', terms: 'Net 30',
      is_recurring: true, created_at: '2026-03-10T10:00:00Z',
    },
    {
      id: uuidv4(), company_id: DEMO_COMPANY_ID, client_id: clients[3].id,
      invoice_number: 'INV-2026-006', status: 'draft',
      issue_date: '2026-03-25', due_date: '2026-04-24',
      subtotal: 95000, tax_rate: 18, tax_amount: 17100, discount_amount: 0,
      total: 112100, amount_paid: 0, client_name: clients[3].name,
      notes: 'Training platform development', terms: 'Net 30',
      is_recurring: false, created_at: '2026-03-25T10:00:00Z',
    },
  ];
}

// ---- Data store (singleton) ----
class DemoStore {
  users: (User & { password_hash: string })[];
  companies: Company[];
  categories: Category[];
  accounts: Account[];
  transactions: Transaction[];
  clients: Client[];
  vendors: Vendor[];
  invoices: Invoice[];
  invoiceItems: InvoiceItem[];
  payments: Payment[];

  constructor() {
    this.users = [demoUser];
    this.companies = [demoCompany];
    this.categories = allCategories;
    this.accounts = accounts;
    this.transactions = generateTransactions();
    this.clients = clients;
    this.vendors = vendors;
    this.invoices = generateInvoices();
    this.invoiceItems = [];
    this.payments = [];
  }

  // --- Users ---
  getUserByEmail(email: string) {
    return this.users.find(u => u.email === email) || null;
  }
  getUserById(id: string) {
    return this.users.find(u => u.id === id) || null;
  }
  createUser(data: { email: string; password_hash: string; full_name: string }) {
    const user: User & { password_hash: string } = {
      id: uuidv4(), ...data, role: 'admin', created_at: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  // --- Companies ---
  getCompany(id: string) { return this.companies.find(c => c.id === id) || null; }
  createCompany(data: Partial<Company>) {
    const company: Company = {
      id: uuidv4(), name: data.name || 'New Company',
      country: 'India', financial_year_start: 4, currency: 'INR',
      ...data, created_at: new Date().toISOString(),
    } as Company;
    this.companies.push(company);
    return company;
  }

  // --- Categories ---
  getCategories(companyId: string) { return this.categories.filter(c => c.company_id === companyId); }
  getCategoryById(id: string) { return this.categories.find(c => c.id === id) || null; }
  createCategory(data: Partial<Category>) {
    const cat = { id: uuidv4(), is_default: false, ...data } as Category;
    this.categories.push(cat);
    return cat;
  }
  updateCategory(id: string, data: Partial<Category>) {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.categories[idx] = { ...this.categories[idx], ...data };
    return this.categories[idx];
  }
  deleteCategory(id: string) {
    this.categories = this.categories.filter(c => c.id !== id);
  }

  // --- Accounts ---
  getAccounts(companyId: string) { return this.accounts.filter(a => a.company_id === companyId); }
  getAccountById(id: string) { return this.accounts.find(a => a.id === id) || null; }
  createAccount(data: Partial<Account>) {
    const acc = { id: uuidv4(), is_active: true, currency: 'INR', opening_balance: 0, current_balance: 0, created_at: new Date().toISOString(), ...data } as Account;
    this.accounts.push(acc);
    return acc;
  }
  updateAccount(id: string, data: Partial<Account>) {
    const idx = this.accounts.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.accounts[idx] = { ...this.accounts[idx], ...data };
    return this.accounts[idx];
  }
  deleteAccount(id: string) { this.accounts = this.accounts.filter(a => a.id !== id); }

  // --- Transactions ---
  getTransactions(companyId: string, filters?: { type?: string; category_id?: string; status?: string; search?: string; date_from?: string; date_to?: string }) {
    let txns = this.transactions.filter(t => t.company_id === companyId);
    if (filters?.type) txns = txns.filter(t => t.type === filters.type);
    if (filters?.category_id) txns = txns.filter(t => t.category_id === filters.category_id);
    if (filters?.status) txns = txns.filter(t => t.status === filters.status);
    if (filters?.date_from) txns = txns.filter(t => t.date >= filters.date_from!);
    if (filters?.date_to) txns = txns.filter(t => t.date <= filters.date_to!);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      txns = txns.filter(t => t.description?.toLowerCase().includes(s) || t.category_name?.toLowerCase().includes(s));
    }
    return txns.sort((a, b) => b.date.localeCompare(a.date));
  }
  getTransactionById(id: string) { return this.transactions.find(t => t.id === id) || null; }
  createTransaction(data: Partial<Transaction>) {
    const txn = { id: uuidv4(), status: 'completed' as const, is_recurring: false, tax_amount: 0, created_at: new Date().toISOString(), ...data } as Transaction;
    // Enrich with names
    if (txn.category_id) { const cat = this.getCategoryById(txn.category_id); if (cat) txn.category_name = cat.name; }
    if (txn.account_id) { const acc = this.getAccountById(txn.account_id); if (acc) txn.account_name = acc.name; }
    if (txn.client_id) { const cli = this.clients.find(c => c.id === txn.client_id); if (cli) txn.client_name = cli.name; }
    if (txn.vendor_id) { const ven = this.vendors.find(v => v.id === txn.vendor_id); if (ven) txn.vendor_name = ven.name; }
    this.transactions.push(txn);
    // Update account balance
    if (txn.account_id) {
      const accIdx = this.accounts.findIndex(a => a.id === txn.account_id);
      if (accIdx !== -1) {
        if (txn.type === 'income') this.accounts[accIdx].current_balance += txn.amount;
        else if (txn.type === 'expense') this.accounts[accIdx].current_balance -= txn.amount;
      }
    }
    return txn;
  }
  updateTransaction(id: string, data: Partial<Transaction>) {
    const idx = this.transactions.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.transactions[idx] = { ...this.transactions[idx], ...data };
    return this.transactions[idx];
  }
  deleteTransaction(id: string) { this.transactions = this.transactions.filter(t => t.id !== id); }

  // --- Clients ---
  getClients(companyId: string, search?: string) {
    let cls = this.clients.filter(c => c.company_id === companyId);
    if (search) { const s = search.toLowerCase(); cls = cls.filter(c => c.name.toLowerCase().includes(s) || c.email?.toLowerCase().includes(s)); }
    return cls;
  }
  getClientById(id: string) { return this.clients.find(c => c.id === id) || null; }
  createClient(data: Partial<Client>) {
    const cli = { id: uuidv4(), outstanding_amount: 0, created_at: new Date().toISOString(), ...data } as Client;
    this.clients.push(cli);
    return cli;
  }
  updateClient(id: string, data: Partial<Client>) {
    const idx = this.clients.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.clients[idx] = { ...this.clients[idx], ...data };
    return this.clients[idx];
  }
  deleteClient(id: string) { this.clients = this.clients.filter(c => c.id !== id); }

  // --- Vendors ---
  getVendors(companyId: string, search?: string) {
    let vns = this.vendors.filter(v => v.company_id === companyId);
    if (search) { const s = search.toLowerCase(); vns = vns.filter(v => v.name.toLowerCase().includes(s) || v.email?.toLowerCase().includes(s)); }
    return vns;
  }
  getVendorById(id: string) { return this.vendors.find(v => v.id === id) || null; }
  createVendor(data: Partial<Vendor>) {
    const ven = { id: uuidv4(), outstanding_amount: 0, created_at: new Date().toISOString(), ...data } as Vendor;
    this.vendors.push(ven);
    return ven;
  }
  updateVendor(id: string, data: Partial<Vendor>) {
    const idx = this.vendors.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.vendors[idx] = { ...this.vendors[idx], ...data };
    return this.vendors[idx];
  }
  deleteVendor(id: string) { this.vendors = this.vendors.filter(v => v.id !== id); }

  // --- Invoices ---
  getInvoices(companyId: string, filters?: { status?: string; client_id?: string; search?: string }) {
    let invs = this.invoices.filter(i => i.company_id === companyId);
    if (filters?.status) invs = invs.filter(i => i.status === filters.status);
    if (filters?.client_id) invs = invs.filter(i => i.client_id === filters.client_id);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      invs = invs.filter(i => i.invoice_number.toLowerCase().includes(s) || i.client_name?.toLowerCase().includes(s));
    }
    return invs.sort((a, b) => b.issue_date.localeCompare(a.issue_date));
  }
  getInvoiceById(id: string) { return this.invoices.find(i => i.id === id) || null; }
  createInvoice(data: Partial<Invoice>) {
    const inv = { id: uuidv4(), status: 'draft' as const, amount_paid: 0, is_recurring: false, created_at: new Date().toISOString(), ...data } as Invoice;
    if (inv.client_id) { const cli = this.getClientById(inv.client_id); if (cli) inv.client_name = cli.name; }
    this.invoices.push(inv);
    return inv;
  }
  updateInvoice(id: string, data: Partial<Invoice>) {
    const idx = this.invoices.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.invoices[idx] = { ...this.invoices[idx], ...data };
    return this.invoices[idx];
  }
  deleteInvoice(id: string) { this.invoices = this.invoices.filter(i => i.id !== id); }

  // --- Dashboard stats ---
  getDashboardStats(companyId: string) {
    const txns = this.transactions.filter(t => t.company_id === companyId);
    const invs = this.invoices.filter(i => i.company_id === companyId);
    const accs = this.accounts.filter(a => a.company_id === companyId);

    // Use trailing 12 months for dashboard (ensures demo data is always visible)
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    const fyStart = twelveMonthsAgo.toISOString().slice(0, 10);

    const fyTxns = txns.filter(t => t.date >= fyStart);
    const totalIncome = fyTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = fyTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const pendingInvoices = invs.filter(i => ['sent', 'partially_paid'].includes(i.status)).length;
    const overdueInvoices = invs.filter(i => i.status === 'overdue').length;
    const totalReceivables = invs.filter(i => ['sent', 'partially_paid', 'overdue'].includes(i.status)).reduce((s, i) => s + (i.total - i.amount_paid), 0);
    const cashBalance = accs.reduce((s, a) => s + a.current_balance, 0);

    return {
      totalIncome, totalExpenses, netProfit: totalIncome - totalExpenses,
      pendingInvoices, overdueInvoices, totalReceivables,
      totalPayables: this.vendors.reduce((s, v) => s + v.outstanding_amount, 0),
      cashBalance,
    };
  }

  getMonthlyData(companyId: string): { month: string; income: number; expenses: number; profit: number }[] {
    const txns = this.transactions.filter(t => t.company_id === companyId);
    const monthMap: Record<string, { income: number; expenses: number }> = {};

    txns.forEach(t => {
      const month = t.date.slice(0, 7);
      if (!monthMap[month]) monthMap[month] = { income: 0, expenses: 0 };
      if (t.type === 'income') monthMap[month].income += t.amount;
      else if (t.type === 'expense') monthMap[month].expenses += t.amount;
    });

    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        profit: data.income - data.expenses,
      }));
  }

  getCategoryBreakdown(companyId: string, type: 'income' | 'expense') {
    const txns = this.transactions.filter(t => t.company_id === companyId && t.type === type);
    const catMap: Record<string, { name: string; amount: number; color: string }> = {};
    txns.forEach(t => {
      const catName = t.category_name || 'Uncategorized';
      const cat = this.categories.find(c => c.id === t.category_id);
      if (!catMap[catName]) catMap[catName] = { name: catName, amount: 0, color: cat?.color || '#6b7280' };
      catMap[catName].amount += t.amount;
    });
    const total = Object.values(catMap).reduce((s, c) => s + c.amount, 0);
    return Object.values(catMap).map(c => ({ ...c, percentage: total ? Math.round((c.amount / total) * 100) : 0 }))
      .sort((a, b) => b.amount - a.amount);
  }

  getRecentTransactions(companyId: string, limit = 10) {
    return this.getTransactions(companyId).slice(0, limit);
  }
}

// Singleton
let store: DemoStore | null = null;
export function getDemoStore(): DemoStore {
  if (!store) store = new DemoStore();
  return store;
}
