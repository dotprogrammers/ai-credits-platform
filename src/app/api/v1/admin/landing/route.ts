import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error, validationError } from '@/lib/api-response';
import { updateLandingSchema } from '@/lib/validations';
import { requireAdmin } from '@/lib/session';

export async function GET() {
  try {
    await requireAdmin();

    const sections = await prisma.landingSection.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return success(sections);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch landing sections');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = updateLandingSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const section = await prisma.landingSection.upsert({
      where: { sectionKey: parsed.data.sectionKey },
      update: {
        title: parsed.data.title,
        content: parsed.data.content as any,
        sortOrder: parsed.data.sortOrder,
        isActive: parsed.data.isActive,
      },
      create: {
        sectionKey: parsed.data.sectionKey,
        title: parsed.data.title,
        content: parsed.data.content as any,
        sortOrder: parsed.data.sortOrder ?? 0,
        isActive: parsed.data.isActive ?? true,
      },
    });

    return success(section);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to update landing section');
  }
}
