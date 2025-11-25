'use client';

import { Container } from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { transactionService } from '@/lib/services';
import { CreateTransactionDTO } from '@/lib/types';

export default function CreateTransactionPage() {
  const handleSubmit = async (data: CreateTransactionDTO): Promise<void> => {
    await transactionService.create(data);
  };

  return (
    <Container>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Transaction</h1>
        <p className="mt-2 text-gray-600">Add a new transaction (deposit, withdraw, or interest)</p>
      </div>

      <Card>
        <CardBody>
          <TransactionForm onSubmit={handleSubmit} />
        </CardBody>
      </Card>
    </Container>
  );
}
