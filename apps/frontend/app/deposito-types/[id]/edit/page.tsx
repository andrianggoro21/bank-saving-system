'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import { DepositoTypeForm } from '@/components/forms/DepositoTypeForm';
import { depositoService } from '@/lib/services';
import { DepositoType, UpdateDepositoTypeDTO } from '@/lib/types';

export default function EditDepositoTypePage() {
  const params = useParams();
  const id = params.id as string;
  const [depositoType, setDepositoType] = useState<DepositoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepositoType = useCallback(async () => {
    try {
      setLoading(true);
      const response = await depositoService.getById(id);
      setDepositoType(response.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch deposito type';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDepositoType();
  }, [fetchDepositoType]);

  const handleSubmit = async (data: UpdateDepositoTypeDTO): Promise<void> => {
    await depositoService.update(id, data);
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

  if (error || !depositoType) {
    return (
      <Container>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error || 'Deposito type not found'}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Deposito Type</h1>
        <p className="mt-2 text-gray-600">Update deposito type information</p>
      </div>

      <Card>
        <CardBody>
          <DepositoTypeForm depositoType={depositoType} onSubmit={handleSubmit} isEdit />
        </CardBody>
      </Card>
    </Container>
  );
}
