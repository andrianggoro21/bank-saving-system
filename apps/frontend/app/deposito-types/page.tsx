'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { depositoService } from '@/lib/services';
import { DepositoType } from '@/lib/types';

export default function DepositoTypesPage() {
  const [depositoTypes, setDepositoTypes] = useState<DepositoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchDepositoTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await depositoService.getAll({ page, limit });
      setDepositoTypes(response.data);
      if (response.meta) {
        setTotalPages(response.meta.totalPages);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch deposito types';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchDepositoTypes();
  }, [fetchDepositoTypes]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete deposito type "${name}"?`)) {
      return;
    }

    try {
      await depositoService.delete(id);
      fetchDepositoTypes();
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
    });
  };

  return (
    <Container>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deposito Types</h1>
          <p className="mt-2 text-gray-600">Manage deposito types and interest rates</p>
        </div>
        <Link href="/deposito-types/create">
          <Button>Add New Deposito Type</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <Card>
        <CardBody>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : depositoTypes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No deposito types found</p>
              <Link href="/deposito-types/create">
                <Button>Create First Deposito Type</Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Name</TableHeadCell>
                    <TableHeadCell>Yearly Return (%)</TableHeadCell>
                    <TableHeadCell>Created At</TableHeadCell>
                    <TableHeadCell>Actions</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {depositoTypes.map((deposito) => (
                    <TableRow key={deposito.id}>
                      <TableCell className="font-medium">{deposito.name}</TableCell>
                      <TableCell>{deposito.yearlyReturn}%</TableCell>
                      <TableCell>{formatDate(deposito.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/deposito-types/${deposito.id}`}>
                            <Button size="sm" variant="secondary">View</Button>
                          </Link>
                          <Link href={`/deposito-types/${deposito.id}/edit`}>
                            <Button size="sm" variant="secondary">Edit</Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(deposito.id, deposito.name)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}
