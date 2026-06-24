import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error, validationError } from '@/lib/api-response';
import { paginationSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/session';
import { z } from 'zod';

const markReadSchema = z.object({
  ids: z.array(z.string()).optional(),
  all: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const { searchParams } = new URL(request.url);
    const { page, limit } = paginationSchema.parse({
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 20,
    });

    const type = searchParams.get('type');
    const unreadOnly = searchParams.get('unread') === 'true';

    const where: Record<string, unknown> = { userId: currentUser.id };
    if (type) where.type = type;
    if (unreadOnly) where.isRead = false;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId: currentUser.id, isRead: false } }),
    ]);

    return success(notifications, { page, limit, total, unreadCount } as any);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch notifications');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const body = await request.json();
    const parsed = markReadSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    if (parsed.data.all) {
      await prisma.notification.updateMany({
        where: { userId: currentUser.id, isRead: false },
        data: { isRead: true },
      });
      return success({ marked: 'all' });
    }

    if (parsed.data.ids && parsed.data.ids.length > 0) {
      await prisma.notification.updateMany({
        where: { id: { in: parsed.data.ids }, userId: currentUser.id },
        data: { isRead: true },
      });
      return success({ marked: parsed.data.ids.length });
    }

    return validationError('Provide ids or all: true');
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to update notifications');
  }
}
