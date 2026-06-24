import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

/**
 * Audit log middleware for recording user actions.
 */

interface AuditLogEntry {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Record an audit log entry.
 */
export async function recordAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId,
        oldValue: (entry.oldValue as Prisma.InputJsonValue) ?? undefined,
        newValue: (entry.newValue as Prisma.InputJsonValue) ?? undefined,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    });
  } catch (error) {
    // Don't let audit log failures break the main operation
    console.error("Failed to record audit log:", error);
  }
}

/**
 * Create an audit log entry from a request.
 */
export function createAuditEntry(
  request: Request,
  params: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    oldValue?: Record<string, unknown>;
    newValue?: Record<string, unknown>;
  }
): AuditLogEntry {
  return {
    ...params,
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  };
}

/**
 * Audit log middleware helper.
 * Wraps an action with audit logging.
 */
export async function withAuditLog<T>(
  request: Request,
  params: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
  },
  action: () => Promise<T>,
  getOldValue?: () => Promise<Record<string, unknown> | undefined>,
  getNewValue?: (result: T) => Record<string, unknown> | undefined
): Promise<T> {
  const oldValue = getOldValue ? await getOldValue() : undefined;

  const result = await action();

  const newValue = getNewValue ? getNewValue(result) : undefined;

  await recordAuditLog({
    ...params,
    oldValue,
    newValue,
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  return result;
}

/**
 * Query audit logs with filters.
 */
export async function queryAuditLogs(params: {
  userId?: string;
  action?: string;
  entity?: string;
  entityId?: string;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}) {
  const { userId, action, entity, entityId, fromDate, toDate, page = 1, limit = 50 } = params;
  const skip = (page - 1) * limit;

  const where = {
    ...(userId ? { userId } : {}),
    ...(action ? { action } : {}),
    ...(entity ? { entity } : {}),
    ...(entityId ? { entityId } : {}),
    ...(fromDate || toDate
      ? {
          createdAt: {
            ...(fromDate ? { gte: fromDate } : {}),
            ...(toDate ? { lte: toDate } : {}),
          },
        }
      : {}),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
