'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { transactionService } from '@/lib/services';
import { Transaction } from '@/lib/types';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaction = useCallback(async () => {
    try {
      setLoading(true);
      const response = await transactionService.getById(id);
      setTransaction(response.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transaction';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  const handleDelete = async () => {
    if (!transaction) return;

    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await transactionService.delete(id);
      router.push('/transactions');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transaction';
      window.alert(errorMessage);
    }
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(value));
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

  const getTransactionTypeBadge = (type: string) => {
    const types: Record<string, { color: string; label: string }> = {
      deposit: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Deposit' },
      withdraw: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Withdraw' },
      interest: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Interest' },
    };
    const typeInfo = types[type.toLowerCase()] || { color: 'bg-gray-100 text-gray-800 border-gray-200', label: type };
    return typeInfo;
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

  if (error || !transaction) {
    return (
      <Container>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error || 'Transaction not found'}</p>
          <Link href="/transactions">
            <Button variant="secondary" className="mt-4">Back to Transactions</Button>
          </Link>
        </div>
      </Container>
    );
  }

  const typeBadge = getTransactionTypeBadge(transaction.type);

  return (
    <Container>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction Details</h1>
          <p className="mt-2 text-gray-600">View transaction information</p>
        </div>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Link href="/transactions">
            <Button variant="secondary">Back</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Transaction Information</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${typeBadge.color}`}>
                {typeBadge.label}
              </span>
            </div>
          </CardHeader>
          <CardBody>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                <dd className="mt-1 text-lg text-gray-900 font-mono">{transaction.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Account ID</dt>
                <dd className="mt-1 text-lg text-gray-900 font-mono">
                  <Link href={`/accounts/${transaction.accountId}`} className="text-blue-600 hover:underline">
                    {transaction.accountId}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Transaction Date</dt>
                <dd className="mt-1 text-lg text-gray-900">{formatDate(transaction.transactionDate)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                <dd className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(transaction.amount)}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Balance Information</h2>
          </CardHeader>
          <CardBody>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Balance Before</dt>
                <dd className="mt-1 text-lg text-gray-900">{formatCurrency(transaction.balanceBefore)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Balance After</dt>
                <dd className="mt-1 text-lg font-semibold text-green-600">{formatCurrency(transaction.balanceAfter)}</dd>
              </div>
              {transaction.interestEarned && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Interest Earned</dt>
                  <dd className="mt-1 text-lg font-semibold text-blue-600">{formatCurrency(transaction.interestEarned)}</dd>
                </div>
              )}
              {transaction.monthsDuration && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Duration</dt>
                  <dd className="mt-1 text-lg text-gray-900">{transaction.monthsDuration} months</dd>
                </div>
              )}
            </dl>
          </CardBody>
        </Card>

        {transaction.notes && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Notes</h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 whitespace-pre-wrap">{transaction.notes}</p>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">System Information</h2>
          </CardHeader>
          <CardBody>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-lg text-gray-900">{formatDate(transaction.createdAt)}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
