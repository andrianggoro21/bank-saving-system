'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { depositoService } from '@/lib/services';
import { DepositoType } from '@/lib/types';

export default function DepositoTypeDetailPage() {
  const params = useParams();
  const router = useRouter();
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

  const handleDelete = async () => {
    if (!depositoType) return;

    if (!window.confirm(`Are you sure you want to delete deposito type "${depositoType.name}"?`)) {
      return;
    }

    try {
      await depositoService.delete(id);
      router.push('/deposito-types');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete deposito type';
      window.alert(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <Link href="/deposito-types">
            <Button variant="secondary" className="mt-4">Back to Deposito Types</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deposito Type Details</h1>
          <p className="mt-2 text-gray-600">View deposito type information</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/deposito-types/${id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Link href="/deposito-types">
            <Button variant="secondary">Back</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Deposito Information</h2>
          </CardHeader>
          <CardBody>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-lg text-gray-900">{depositoType.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Yearly Return</dt>
                <dd className="mt-1 text-lg text-gray-900">{depositoType.yearlyReturn}% per year</dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">System Information</h2>
          </CardHeader>
          <CardBody>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Deposito Type ID</dt>
                <dd className="mt-1 text-lg text-gray-900 font-mono">{depositoType.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-lg text-gray-900">{formatDate(depositoType.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-lg text-gray-900">{formatDate(depositoType.updatedAt)}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
