import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error, notFound, validationError } from '@/lib/api-response';
import { updateUserSchema } from '@/lib/validations';
import { requireAuth, requireAdmin } from '@/lib/session';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) return notFound('User not found');
    return success(user);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch user');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await requireAuth();

    if (currentUser.id !== id && currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
      return error('FORBIDDEN', 'Cannot update another user', undefined, 403);
    }

    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    if (parsed.data.username) {
      const existing = await prisma.user.findUnique({ where: { username: parsed.data.username } });
      if (existing && existing.id !== id) return error('CONFLICT', 'Username already taken');
    }

    const user = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        image: true,
        phone: true,
        country: true,
        updatedAt: true,
      },
    });

    return success(user);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to update user');
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();

    await prisma.user.delete({ where: { id } });
    return success({ deleted: true });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to delete user');
  }
}
