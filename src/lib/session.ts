import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { unauthorized } from './api-response';
import { UserRole } from '@prisma/client';

export async function getSession() {
  return getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) return null;
  return session.user as {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: UserRole;
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw unauthorized();
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    throw new Response(
      JSON.stringify({ error: { code: 'FORBIDDEN', message: 'Admin access required' } }),
      { status: 403 }
    );
  }
  return user;
}

export async function requireRole(...roles: UserRole[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new Response(
      JSON.stringify({ error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } }),
      { status: 403 }
    );
  }
  return user;
}
