'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import { AccountForm } from '@/components/forms/AccountForm';
import { accountService } from '@/lib/services';
import { Account, UpdateAccountDTO } from '@/lib/types';

export default function EditAccountPage() {
  const params = useParams();
  const id = params.id as string;
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccount = useCallback(async () => {
    try {
      setLoading(true);
      const response = await accountService.getById(id);
      setAccount(response.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch account';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const handleSubmit = async (data: UpdateAccountDTO): Promise<void> => {
    await accountService.update(id, data);
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

  if (error || !account) {
    return (
      <Container>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error || 'Account not found'}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Account</h1>
        <p className="mt-2 text-gray-600">Update account balance</p>
      </div>

      <Card>
        <CardBody>
          <AccountForm account={account} onSubmit={handleSubmit} isEdit />
        </CardBody>
      </Card>
    </Container>
  );
}
