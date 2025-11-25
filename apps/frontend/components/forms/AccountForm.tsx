'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Account, CreateAccountDTO, UpdateAccountDTO, Customer, DepositoType } from '@/lib/types';
import { customerService, depositoService } from '@/lib/services';

interface AccountFormProps {
  account?: Account;
  onSubmit: (data: CreateAccountDTO | UpdateAccountDTO) => Promise<void>;
  isEdit?: boolean;
}

export const AccountForm: React.FC<AccountFormProps> = ({ account, onSubmit, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [depositoTypes, setDepositoTypes] = useState<DepositoType[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState({
    customerId: account?.customerId || '',
    depositoTypeId: account?.depositoTypeId || '',
    balance: account?.balance?.toString() || '0',
  });

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);
      const [customersRes, depositoTypesRes] = await Promise.all([
        customerService.getAll({ page: 1, limit: 100 }),
        depositoService.getAll({ page: 1, limit: 100 }),
      ]);
      setCustomers(customersRes.data);
      setDepositoTypes(depositoTypesRes.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load options';
      window.alert(errorMessage);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }

    if (!formData.depositoTypeId) {
      newErrors.depositoTypeId = 'Deposito type is required';
    }

    if (!formData.balance) {
      newErrors.balance = 'Balance is required';
    } else if (isNaN(Number(formData.balance)) || Number(formData.balance) < 0) {
      newErrors.balance = 'Balance must be a non-negative number';
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
      const submitData = {
        customerId: Number(formData.customerId),
        depositoTypeId: Number(formData.depositoTypeId),
        balance: Number(formData.balance),
      };
      await onSubmit(submitData);
      router.push('/accounts');
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

  if (loadingOptions) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">
          Customer <span className="text-red-500">*</span>
        </label>
        <select
          id="customerId"
          name="customerId"
          value={formData.customerId}
          onChange={handleChange}
          disabled={loading || isEdit}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.customerId ? 'border-red-500' : 'border-gray-300'
          } ${isEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          required
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - {customer.email}
            </option>
          ))}
        </select>
        {errors.customerId && <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>}
        {isEdit && <p className="mt-1 text-sm text-gray-500">Customer cannot be changed</p>}
      </div>

      <div>
        <label htmlFor="depositoTypeId" className="block text-sm font-medium text-gray-700 mb-1">
          Deposito Type <span className="text-red-500">*</span>
        </label>
        <select
          id="depositoTypeId"
          name="depositoTypeId"
          value={formData.depositoTypeId}
          onChange={handleChange}
          disabled={loading || isEdit}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.depositoTypeId ? 'border-red-500' : 'border-gray-300'
          } ${isEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          required
        >
          <option value="">Select a deposito type</option>
          {depositoTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name} - {type.yearlyReturn}% p.a.
            </option>
          ))}
        </select>
        {errors.depositoTypeId && <p className="mt-1 text-sm text-red-600">{errors.depositoTypeId}</p>}
        {isEdit && <p className="mt-1 text-sm text-gray-500">Deposito type cannot be changed</p>}
      </div>

      <Input
        label="Initial Balance (IDR)"
        name="balance"
        type="number"
        step="0.01"
        value={formData.balance}
        onChange={handleChange}
        error={errors.balance}
        placeholder="e.g., 10000000"
        helperText="Enter amount in Rupiah"
        disabled={loading}
        required
      />

      <div className="flex gap-3">
        <Button type="submit" isLoading={loading}>
          {isEdit ? 'Update Account' : 'Create Account'}
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
