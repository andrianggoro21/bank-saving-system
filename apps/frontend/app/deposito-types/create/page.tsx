'use client';

import { Container } from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import { DepositoTypeForm } from '@/components/forms/DepositoTypeForm';
import { depositoService } from '@/lib/services';
import { CreateDepositoTypeDTO, UpdateDepositoTypeDTO } from '@/lib/types';

export default function CreateDepositoTypePage() {
  const handleSubmit = async (data: CreateDepositoTypeDTO | UpdateDepositoTypeDTO): Promise<void> => {
    await depositoService.create(data as CreateDepositoTypeDTO);
  };

  return (
    <Container>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Deposito Type</h1>
        <p className="mt-2 text-gray-600">Add a new deposito type to the system</p>
      </div>

      <Card>
        <CardBody>
          <DepositoTypeForm onSubmit={handleSubmit} />
        </CardBody>
      </Card>
    </Container>
  );
}
