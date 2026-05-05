// Utility to format currency
export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export function getMonthName(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const d = new Date(parseInt(year), parseInt(month) - 1);
  return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    paid: 'badge-success',
    completed: 'badge-success',
    reconciled: 'badge-info',
    sent: 'badge-info',
    partially_paid: 'badge-warning',
    pending: 'badge-warning',
    overdue: 'badge-danger',
    void: 'badge-neutral',
    cancelled: 'badge-neutral',
    draft: 'badge-neutral',
  };
  return colors[status] || 'badge-neutral';
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const num = Math.floor(Math.random() * 900) + 100;
  return `INV-${y}-${num}`;
}
