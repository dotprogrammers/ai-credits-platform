import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { success, created, error, validationError, conflict } from '@/lib/api-response';
import { registerSchema, paginationSchema } from '@/lib/validations';
import { requireAdmin } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const { page, limit } = paginationSchema.parse({
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 20,
    });

    const where: Record<string, unknown> = {};
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    if (status) where.status = status;
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { name: { contains: search } },
        { username: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          image: true,
          role: true,
          status: true,
          createdAt: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return success(users, { page, limit, total });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch users');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const { email, password, name, username, referralCode } = parsed.data;

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) return conflict('Email already registered');

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) return conflict('Username already taken');

    let referredById: string | undefined;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode } });
      if (!referrer) return error('NOT_FOUND', 'Invalid referral code');
      referredById = referrer.id;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        username,
        referredById,
        wallet: { create: {} },
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        createdAt: true,
      },
    });

    if (referredById) {
      const affiliate = await prisma.affiliateProfile.findUnique({
        where: { userId: referredById },
      });
      if (affiliate) {
        await prisma.referral.create({
          data: { affiliateId: affiliate.id, referredUserId: user.id },
        });
        await prisma.affiliateProfile.update({
          where: { id: affiliate.id },
          data: { totalReferrals: { increment: 1 } },
        });
      }
    }

    return created(user);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to create user');
  }
}
