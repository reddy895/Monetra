import React, { useState } from 'react';
import {
  Plus,
  Receipt,
  Download,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  Tag
} from 'lucide-react';
import {
  useGetExpensesQuery,
  useGetExpenseSummaryQuery,
  useDeleteExpenseMutation
} from '../../store/apiSlice';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { StatCard } from '../../components/UI/StatCard';
import { Badge } from '../../components/UI/Badge';
import { ExpenseFormModal } from './components/ExpenseFormModal';
import { ExpenseFilters } from './components/ExpenseFilters';
import { formatINR, formatDate } from '../../utils/formatters';
import { Expense } from '../../types';
import { AppIcon } from '../../components/UI/AppIcon';

export const ExpensesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 50,
  });

  const { data: expensesData, isLoading } = useGetExpensesQuery(filters);
  const { data: summaryData } = useGetExpenseSummaryQuery();
  const [deleteExpense] = useDeleteExpenseMutation();

  const expenses = expensesData?.data || [];
  const summary = summaryData?.data;

  const handleResetFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      paymentMethod: '',
      startDate: '',
      endDate: '',
      sortBy: 'date',
      sortOrder: 'desc',
      page: 1,
      limit: 50,
    });
  };

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        await deleteExpense(id).unwrap();
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) return;
    const headers = ['Date', 'Category', 'Description', 'Amount (INR)', 'Payment Mode', 'Tags'];
    const rows = expenses.map((e) => [
      formatDate(e.date),
      e.categoryId?.name || 'Uncategorized',
      `"${(e.description || '').replace(/"/g, '""')}"`,
      e.amount,
      e.paymentMethod,
      `"${(e.tags || []).join(', ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Expenses_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal tracking-tight">Expense Tracker</h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Log, categorize, and control your day-to-day spending against your salary budget.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedExpense(null);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Spent This Month"
          value={formatINR(summary?.totalSpent || 0)}
          subtitle={`${summary?.savingsRate || 0}% saved`}
          icon={<Receipt className="w-5 h-5" />}
        />
        <StatCard
          title="Needs (50%)"
          value={formatINR(summary?.needsSpent || 0)}
          subtitle={`Limit: ${formatINR(summary?.idealNeeds || 0)}`}
          iconBgColor="bg-slate-subtle text-slate-warm"
          icon={<Tag className="w-5 h-5" />}
        />
        <StatCard
          title="Wants (30%)"
          value={formatINR(summary?.wantsSpent || 0)}
          subtitle={`Limit: ${formatINR(summary?.idealWants || 0)}`}
          iconBgColor="bg-amber-subtle text-amber-soft"
          icon={<CreditCard className="w-5 h-5" />}
        />
        <StatCard
          title="Transactions"
          value={expenses.length}
          subtitle={`In active view`}
          iconBgColor="bg-teal-subtle text-teal-muted"
          icon={<Calendar className="w-5 h-5" />}
        />
      </div>

      {/* Filter Component */}
      <ExpenseFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Transactions Container */}
      <Card className="p-0 overflow-hidden shadow-subtle">
        <div className="px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-charcoal">Transaction History</h3>
          <span className="text-xs text-charcoal-muted tabular-nums">
            {expenses.length} records
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-charcoal-light">
            Loading expense records...
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-subtle text-charcoal-muted flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-6 h-6 text-charcoal-muted" />
            </div>
            <h4 className="text-sm font-semibold text-charcoal">No expenses found</h4>
            <p className="text-xs text-charcoal-muted mt-1 max-w-xs mx-auto">
              Add your first transaction or clear filters to view records.
            </p>
            <Button
              size="sm"
              className="mt-4"
              onClick={() => {
                setSelectedExpense(null);
                setIsModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Expense
            </Button>
          </div>
        ) : (
          <>
            {/* Mobile App Cards View (Visible on Mobile Screens) */}
            <div className="divide-y divide-border block sm:hidden">
              {expenses.map((expense) => (
                <div key={expense._id} className="p-3.5 hover:bg-background/80 transition-colors flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-card bg-slate-subtle text-slate-warm flex items-center justify-center shrink-0">
                      <AppIcon name={expense.categoryId?.name} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-charcoal truncate">
                        {expense.description || expense.categoryId?.name || 'Expense'}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-charcoal-muted mt-0.5">
                        <span>{formatDate(expense.date)}</span>
                        <span>•</span>
                        <span className="font-medium">{expense.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-right">
                    <div>
                      <p className="font-bold text-xs text-charcoal tabular-nums">
                        {formatINR(expense.amount)}
                      </p>
                      <span className="text-[10px] text-charcoal-light block">
                        {expense.categoryId?.name || 'Other'}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-1 text-charcoal-muted hover:text-teal-muted rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="p-1 text-charcoal-muted hover:text-danger rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Visible on sm: screens and up) */}
            <div className="overflow-x-auto hidden sm:block">
              <table className="w-full text-left text-xs">
                <thead className="bg-background text-charcoal-muted uppercase text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Date</th>
                    <th className="px-6 py-3 font-semibold">Category</th>
                    <th className="px-6 py-3 font-semibold">Description</th>
                    <th className="px-6 py-3 font-semibold">Payment Mode</th>
                    <th className="px-6 py-3 font-semibold text-right">Amount</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {expenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-background/80 transition-colors">
                      <td className="px-6 py-3.5 text-charcoal-muted whitespace-nowrap">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2 font-medium text-charcoal">
                          <div className="w-6 h-6 rounded bg-slate-subtle text-slate-warm flex items-center justify-center shrink-0">
                            <AppIcon name={expense.categoryId?.name} className="w-3.5 h-3.5" />
                          </div>
                          <span>{expense.categoryId?.name || 'Other'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-charcoal font-medium">
                        <div>
                          <span>{expense.description || '—'}</span>
                          {expense.tags && expense.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {expense.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-slate-subtle text-charcoal-muted px-1.5 py-0.2 rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <Badge variant="neutral" size="sm">
                          {expense.paymentMethod}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold text-charcoal tabular-nums whitespace-nowrap">
                        {formatINR(expense.amount)}
                      </td>
                      <td className="px-6 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="p-1.5 text-charcoal-muted hover:text-teal-muted hover:bg-slate-subtle rounded transition-colors"
                            title="Edit transaction"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="p-1.5 text-charcoal-muted hover:text-danger hover:bg-danger-subtle rounded transition-colors"
                            title="Delete transaction"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {/* Modal */}
      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExpense(null);
        }}
        expenseToEdit={selectedExpense}
      />
    </div>
  );
};
