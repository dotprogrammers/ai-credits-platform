import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error, notFound, validationError } from '@/lib/api-response';
import { updateProviderSchema } from '@/lib/validations';
import { requireAdmin } from '@/lib/session';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();

    const existing = await prisma.provider.findUnique({ where: { id } });
    if (!existing) return notFound('Provider not found');

    const body = await request.json();
    const parsed = updateProviderSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const provider = await prisma.provider.update({
      where: { id },
      data: parsed.data,
    });

    return success(provider);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to update provider');
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();

    const productCount = await prisma.creditProduct.count({ where: { providerId: id } });
    if (productCount > 0) {
      return error('CONFLICT', 'Cannot delete provider with existing products');
    }

    await prisma.provider.delete({ where: { id } });
    return success({ deleted: true });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to delete provider');
  }
}
