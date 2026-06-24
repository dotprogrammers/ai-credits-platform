import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error, validationError } from '@/lib/api-response';
import { updateSettingsSchema } from '@/lib/validations';
import { requireAdmin } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: Record<string, unknown> = {};
    if (category) where.category = category;

    const settings = await prisma.platformSetting.findMany({
      where,
      orderBy: { category: 'asc' },
    });

    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s]));
    return success(settingsMap);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch settings');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const parsed = updateSettingsSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const updates = await Promise.all(
      Object.entries(parsed.data).map(([key, value]) =>
        prisma.platformSetting.upsert({
          where: { key },
          update: { value: value as any, updatedById: admin.id },
          create: { key, value: value as any, updatedById: admin.id },
        })
      )
    );

    return success(updates);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to update settings');
  }
}
