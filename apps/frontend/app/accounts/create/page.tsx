'use client';

import { Container } from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import { AccountForm } from '@/components/forms/AccountForm';
import { accountService } from '@/lib/services';
import { CreateAccountDTO, UpdateAccountDTO } from '@/lib/types';

export default function CreateAccountPage() {
  const handleSubmit = async (data: CreateAccountDTO | UpdateAccountDTO): Promise<void> => {
    await accountService.create(data as CreateAccountDTO);
  };

  return (
    <Container>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Account</h1>
        <p className="mt-2 text-gray-600">Add a new deposit account to the system</p>
      </div>

      <Card>
        <CardBody>
          <AccountForm onSubmit={handleSubmit} />
        </CardBody>
      </Card>
    </Container>
  );
}
