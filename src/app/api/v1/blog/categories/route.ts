import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, created, error, validationError } from '@/lib/api-response';
import { createCategorySchema } from '@/lib/validations';
import { requireAdmin } from '@/lib/session';

export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { posts: { where: { status: 'PUBLISHED' } } } } },
    });

    return success(categories);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch categories');
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const existingName = await prisma.blogCategory.findUnique({ where: { name: parsed.data.name } });
    if (existingName) return error('CONFLICT', 'Category name already exists');

    const existingSlug = await prisma.blogCategory.findUnique({ where: { slug: parsed.data.slug } });
    if (existingSlug) return error('CONFLICT', 'Category slug already exists');

    const category = await prisma.blogCategory.create({ data: parsed.data });
    return created(category);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to create category');
  }
}
