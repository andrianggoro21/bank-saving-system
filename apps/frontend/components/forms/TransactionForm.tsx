'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CreateTransactionDTO, Account } from '@/lib/types';
import { accountService } from '@/lib/services';

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionDTO) => Promise<void>;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountIdParam = searchParams.get('accountId');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const [formData, setFormData] = useState({
    accountId: accountIdParam || '',
    type: 'deposit',
    amount: '',
    transactionDate: new Date().toISOString().split('T')[0],
    monthsDuration: '',
    notes: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (formData.accountId) {
      const account = accounts.find(a => a.id === formData.accountId);
      setSelectedAccount(account || null);
    }
  }, [formData.accountId, accounts]);

  const fetchAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const response = await accountService.getAll({ page: 1, limit: 100 });
      setAccounts(response.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load accounts';
      window.alert(errorMessage);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.accountId) {
      newErrors.accountId = 'Account is required';
    }

    if (!formData.type) {
      newErrors.type = 'Transaction type is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = 'Transaction date is required';
    }

    if (formData.type === 'interest') {
      if (!formData.monthsDuration) {
        newErrors.monthsDuration = 'Months duration is required for interest transactions';
      } else if (isNaN(Number(formData.monthsDuration)) || Number(formData.monthsDuration) <= 0) {
        newErrors.monthsDuration = 'Months duration must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const submitData: CreateTransactionDTO = {
        accountId: formData.accountId,
        type: formData.type as 'deposit' | 'withdraw' | 'interest',
        amount: Number(formData.amount),
        transactionDate: formData.transactionDate,
        monthsDuration: formData.monthsDuration ? Number(formData.monthsDuration) : undefined,
        notes: formData.notes || undefined,
      };
      await onSubmit(submitData);
      router.push('/transactions');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err && Array.isArray(err.errors)) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error: { field: string; message: string }) => {
          fieldErrors[error.field] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        window.alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  if (loadingAccounts) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 mb-1">
          Account <span className="text-red-500">*</span>
        </label>
        <select
          id="accountId"
          name="accountId"
          value={formData.accountId}
          onChange={handleChange}
          disabled={loading}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.accountId ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select an account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              Account #{account.id} - {account.customer?.name || `Customer #${account.customerId}`}
              - Balance: {formatCurrency(account.balance)}
            </option>
          ))}
        </select>
        {errors.accountId && <p className="mt-1 text-sm text-red-600">{errors.accountId}</p>}
      </div>

      {selectedAccount && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Account Information</h4>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-blue-700">Customer:</dt>
            <dd className="text-blue-900 font-medium">{selectedAccount.customer?.name}</dd>
            <dt className="text-blue-700">Current Balance:</dt>
            <dd className="text-blue-900 font-medium">{formatCurrency(selectedAccount.balance)}</dd>
            <dt className="text-blue-700">Deposito Type:</dt>
            <dd className="text-blue-900 font-medium">
              {selectedAccount.depositoType?.name} ({selectedAccount.depositoType?.yearlyReturn}% p.a.)
            </dd>
          </dl>
        </div>
      )}

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Transaction Type <span className="text-red-500">*</span>
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          disabled={loading}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.type ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
          <option value="interest">Interest</option>
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
      </div>

      <Input
        label="Amount (IDR)"
        name="amount"
        type="number"
        step="0.01"
        value={formData.amount}
        onChange={handleChange}
        error={errors.amount}
        placeholder="e.g., 5000000"
        helperText="Enter transaction amount in Rupiah"
        disabled={loading}
        required
      />

      <Input
        label="Transaction Date"
        name="transactionDate"
        type="date"
        value={formData.transactionDate}
        onChange={handleChange}
        error={errors.transactionDate}
        disabled={loading}
        required
      />

      {formData.type === 'interest' && (
        <Input
          label="Months Duration"
          name="monthsDuration"
          type="number"
          step="0.01"
          value={formData.monthsDuration}
          onChange={handleChange}
          error={errors.monthsDuration}
          placeholder="e.g., 3"
          helperText="Number of months for interest calculation"
          disabled={loading}
          required
        />
      )}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Optional notes about this transaction"
          disabled={loading}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" isLoading={loading}>
          Create Transaction
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
