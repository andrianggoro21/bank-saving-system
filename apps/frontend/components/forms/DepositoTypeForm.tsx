'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DepositoType, CreateDepositoTypeDTO, UpdateDepositoTypeDTO } from '@/lib/types';

interface DepositoTypeFormProps {
  depositoType?: DepositoType;
  onSubmit: (data: CreateDepositoTypeDTO | UpdateDepositoTypeDTO) => Promise<void>;
  isEdit?: boolean;
}

export const DepositoTypeForm: React.FC<DepositoTypeFormProps> = ({ depositoType, onSubmit, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: depositoType?.name || '',
    yearlyReturn: depositoType?.yearlyReturn?.toString() || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.yearlyReturn) {
      newErrors.yearlyReturn = 'Yearly return is required';
    } else if (isNaN(Number(formData.yearlyReturn)) || Number(formData.yearlyReturn) < 0) {
      newErrors.yearlyReturn = 'Yearly return must be a non-negative number';
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
        name: formData.name,
        yearlyReturn: Number(formData.yearlyReturn),
      };
      await onSubmit(submitData);
      router.push('/deposito-types');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="e.g., Deposito 3 Bulan"
        disabled={loading}
        required
      />

      <Input
        label="Yearly Return (%)"
        name="yearlyReturn"
        type="number"
        step="0.01"
        value={formData.yearlyReturn}
        onChange={handleChange}
        error={errors.yearlyReturn}
        placeholder="e.g., 5.5"
        helperText="Enter annual return percentage"
        disabled={loading}
        required
      />

      <div className="flex gap-3">
        <Button type="submit" isLoading={loading}>
          {isEdit ? 'Update Deposito Type' : 'Create Deposito Type'}
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
