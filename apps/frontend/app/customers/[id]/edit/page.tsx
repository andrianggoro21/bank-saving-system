'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import { CustomerForm } from '@/components/forms/CustomerForm';
import { customerService } from '@/lib/services';
import { Customer, UpdateCustomerDTO } from '@/lib/types';

export default function EditCustomerPage() {
  const params = useParams();
  const id = params.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const response = await customerService.getById(id);
      setCustomer(response.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch customer';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const handleSubmit = async (data: UpdateCustomerDTO): Promise<void> => {
    await customerService.update(id, data);
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Container>
    );
  }

  if (error || !customer) {
    return (
      <Container>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error || 'Customer not found'}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
        <p className="mt-2 text-gray-600">Update customer information</p>
      </div>

      <Card>
        <CardBody>
          <CustomerForm customer={customer} onSubmit={handleSubmit} isEdit />
        </CardBody>
      </Card>
    </Container>
  );
}
