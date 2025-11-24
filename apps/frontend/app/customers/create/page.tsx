'use client';

import { Container } from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import { CustomerForm } from '@/components/forms/CustomerForm';
import { customerService } from '@/lib/services';
import { CreateCustomerDTO, UpdateCustomerDTO } from '@/lib/types';

export default function CreateCustomerPage() {
  const handleSubmit = async (data: CreateCustomerDTO | UpdateCustomerDTO): Promise<void> => {
    await customerService.create(data as CreateCustomerDTO);
  };

  return (
    <Container>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Customer</h1>
        <p className="mt-2 text-gray-600">Add a new customer to the system</p>
      </div>

      <Card>
        <CardBody>
          <CustomerForm onSubmit={handleSubmit} />
        </CardBody>
      </Card>
    </Container>
  );
}
