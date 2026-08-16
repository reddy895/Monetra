import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { useGetCategoriesQuery } from '../../../store/apiSlice';
import { Input } from '../../../components/UI/Input';
import { Select } from '../../../components/UI/Select';
import { Button } from '../../../components/UI/Button';

interface ExpenseFiltersProps {
  filters: {
    search: string;
    categoryId: string;
    paymentMethod: string;
    startDate: string;
    endDate: string;
    sortBy: string;
    sortOrder: string;
  };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((c) => ({ value: c._id, label: `${c.icon || '🏷️'} ${c.name}` })),
  ];

  const paymentOptions = [
    { value: '', label: 'All Payment Modes' },
    { value: 'UPI', label: 'UPI' },
    { value: 'Card', label: 'Card' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Cash', label: 'Cash' },
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Date: Newest First' },
    { value: 'date-asc', label: 'Date: Oldest First' },
    { value: 'amount-desc', label: 'Amount: Highest First' },
    { value: 'amount-asc', label: 'Amount: Lowest First' },
  ];

  const handleSortChange = (val: string) => {
    const [sortBy, sortOrder] = val.split('-');
    onFilterChange({ ...filters, sortBy, sortOrder });
  };

  return (
    <div className="bg-surface rounded-card border border-border p-4 mb-6 shadow-subtle">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search */}
        <Input
          placeholder="Search descriptions..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          leftIcon={<Search className="w-4 h-4" />}
        />

        {/* Category */}
        <Select
          options={categoryOptions}
          value={filters.categoryId}
          onChange={(e) => onFilterChange({ ...filters, categoryId: e.target.value })}
        />

        {/* Payment mode */}
        <Select
          options={paymentOptions}
          value={filters.paymentMethod}
          onChange={(e) => onFilterChange({ ...filters, paymentMethod: e.target.value })}
        />

        {/* Sort */}
        <Select
          options={sortOptions}
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => handleSortChange(e.target.value)}
        />
      </div>

      {/* Date range row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-border">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-charcoal-muted font-medium">Date Range:</span>
          <input
            type="date"
            className="rounded-card border border-border bg-background px-2.5 py-1 text-xs text-charcoal"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
          />
          <span className="text-charcoal-light">to</span>
          <input
            type="date"
            className="rounded-card border border-border bg-background px-2.5 py-1 text-xs text-charcoal"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
