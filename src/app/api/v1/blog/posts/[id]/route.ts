import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error, notFound, validationError } from '@/lib/api-response';
import { createBlogPostSchema } from '@/lib/validations';
import { requireAdmin } from '@/lib/session';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        category: true,
      },
    });

    if (!post) return notFound('Post not found');

    await prisma.blogPost.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return success(post);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch post');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return notFound('Post not found');

    const body = await request.json();
    const parsed = createBlogPostSchema.partial().safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    if (parsed.data.slug && parsed.data.slug !== existing.slug) {
      const slugTaken = await prisma.blogPost.findUnique({ where: { slug: parsed.data.slug } });
      if (slugTaken) return error('CONFLICT', 'Slug already in use');
    }

    const data: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.status === 'PUBLISHED' && !existing.publishedAt) {
      data.publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data,
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        category: true,
      },
    });

    return success(post);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to update post');
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();

    await prisma.blogPost.delete({ where: { id } });
    return success({ deleted: true });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to delete post');
  }
}
