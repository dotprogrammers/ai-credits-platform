import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, created, error, validationError } from '@/lib/api-response';
import { createBlogPostSchema, paginationSchema } from '@/lib/validations';
import { requireAuth, requireAdmin } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit } = paginationSchema.parse({
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 12,
    });

    const slug = searchParams.get('slug');
    const categoryId = searchParams.get('categoryId');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = { status: 'PUBLISHED' };
    if (slug) where.slug = slug;
    if (categoryId) where.categoryId = categoryId;
    if (tag) where.tags = { contains: tag };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, username: true, image: true } },
          category: { select: { id: true, name: true, slug: true, color: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return success(posts, { page, limit, total });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch posts');
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAdmin();
    const body = await request.json();
    const parsed = createBlogPostSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const existing = await prisma.blogPost.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) return error('CONFLICT', 'Slug already in use');

    const post = await prisma.blogPost.create({
      data: {
        ...parsed.data,
        authorId: currentUser.id,
        publishedAt: parsed.data.status === 'PUBLISHED' ? new Date() : null,
      },
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        category: true,
      },
    });

    return created(post);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to create post');
  }
}
