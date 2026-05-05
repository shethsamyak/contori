// Seed default categories for a company
import { query } from './db';

const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Sales Revenue', icon: '', color: '#10b981' },
  { name: 'Service Income', icon: '', color: '#3b82f6' },
  { name: 'Interest Income', icon: '', color: '#8b5cf6' },
  { name: 'Rental Income', icon: '', color: '#f59e0b' },
  { name: 'Commission', icon: '', color: '#ec4899' },
  { name: 'Other Income', icon: '', color: '#6b7280' },
];

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Rent & Lease', icon: '', color: '#ef4444' },
  { name: 'Salaries & Wages', icon: '', color: '#f97316' },
  { name: 'Utilities', icon: '', color: '#eab308' },
  { name: 'Office Supplies', icon: '', color: '#84cc16' },
  { name: 'Travel & Transport', icon: '', color: '#06b6d4' },
  { name: 'Marketing', icon: '', color: '#8b5cf6' },
  { name: 'Insurance', icon: '', color: '#ec4899' },
  { name: 'Software & Subscriptions', icon: '', color: '#6366f1' },
  { name: 'Professional Fees', icon: '', color: '#14b8a6' },
  { name: 'Repairs & Maintenance', icon: '', color: '#f43f5e' },
  { name: 'Telephone & Internet', icon: '', color: '#0ea5e9' },
  { name: 'Bank Charges', icon: '', color: '#a855f7' },
  { name: 'Taxes & Duties', icon: '', color: '#d946ef' },
  { name: 'Miscellaneous', icon: '', color: '#6b7280' },
];

export async function seedDefaultCategories(companyId: string) {
  for (const cat of DEFAULT_INCOME_CATEGORIES) {
    await query(
      'INSERT INTO categories (company_id, name, type, icon, color, is_default) VALUES ($1, $2, $3, $4, $5, true) ON CONFLICT DO NOTHING',
      [companyId, cat.name, 'income', cat.icon, cat.color]
    );
  }
  for (const cat of DEFAULT_EXPENSE_CATEGORIES) {
    await query(
      'INSERT INTO categories (company_id, name, type, icon, color, is_default) VALUES ($1, $2, $3, $4, $5, true) ON CONFLICT DO NOTHING',
      [companyId, cat.name, 'expense', cat.icon, cat.color]
    );
  }
}

export async function seedDefaultAccount(companyId: string) {
  await query(
    `INSERT INTO accounts (company_id, name, type, opening_balance, current_balance, currency)
     VALUES ($1, 'Cash', 'cash', 0, 0, 'INR')
     ON CONFLICT DO NOTHING`,
    [companyId]
  );
}
