'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { accountService, transactionService } from '@/lib/services';
import { Account, Transaction } from '@/lib/types';

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountData = useCallback(async () => {
    try {
      setLoading(true);
      const [accountRes, transactionsRes] = await Promise.all([
        accountService.getById(id),
        transactionService.getByAccountId(id),
      ]);
      setAccount(accountRes.data);
      setTransactions(transactionsRes.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch account';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  const handleDelete = async () => {
    if (!account) return;

    if (!window.confirm('Are you sure you want to delete this account?')) {
      return;
    }

    try {
      await accountService.delete(id);
      router.push('/accounts');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete account';
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
    const types: Record<string, string> = {
      deposit: 'bg-green-100 text-green-800',
      withdraw: 'bg-red-100 text-red-800',
      interest: 'bg-blue-100 text-blue-800',
    };
    return types[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
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
          <Link href="/accounts">
            <Button variant="secondary" className="mt-4">Back to Accounts</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Details</h1>
          <p className="mt-2 text-gray-600">View account information and transactions</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/accounts/${id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Link href="/accounts">
            <Button variant="secondary">Back</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Account Information</h2>
          </CardHeader>
          <CardBody>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Account ID</dt>
                <dd className="mt-1 text-lg text-gray-900 font-mono">{account.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Current Balance</dt>
                <dd className="mt-1 text-2xl font-bold text-green-600">{formatCurrency(account.balance)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Customer</dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {account.customer?.name || `Customer #${account.customerId}`}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Deposito Type</dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {account.depositoType?.name || `Type #${account.depositoTypeId}`}
                  {account.depositoType && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({account.depositoType.yearlyReturn}% p.a.)
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-lg text-gray-900">{formatDate(account.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-lg text-gray-900">{formatDate(account.updatedAt)}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Transaction History</h2>
              <Link href={`/transactions/create?accountId=${id}`}>
                <Button size="sm">New Transaction</Button>
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No transactions yet</p>
                <Link href={`/transactions/create?accountId=${id}`}>
                  <Button size="sm">Create First Transaction</Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Date</TableHeadCell>
                    <TableHeadCell>Type</TableHeadCell>
                    <TableHeadCell>Amount</TableHeadCell>
                    <TableHeadCell>Balance Before</TableHeadCell>
                    <TableHeadCell>Balance After</TableHeadCell>
                    <TableHeadCell>Actions</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeBadge(transaction.type)}`}>
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>{formatCurrency(transaction.balanceBefore)}</TableCell>
                      <TableCell>{formatCurrency(transaction.balanceAfter)}</TableCell>
                      <TableCell>
                        <Link href={`/transactions/${transaction.id}`}>
                          <Button size="sm" variant="secondary">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
