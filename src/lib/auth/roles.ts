import type { UserRole } from "@prisma/client";
import { ForbiddenError } from "@/lib/errors";

/**
 * Role hierarchy for the platform.
 * Higher index = more privileges.
 */
const ROLE_HIERARCHY: UserRole[] = ["USER", "AFFILIATE", "ADMIN", "SUPER_ADMIN"];

/**
 * Check if a role has at least the level of the required role.
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const userLevel = ROLE_HIERARCHY.indexOf(userRole);
  const requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
  return userLevel >= requiredLevel;
}

/**
 * Check if a role is exactly one of the specified roles.
 */
export function isRole(userRole: UserRole, roles: UserRole[]): boolean {
  return roles.includes(userRole);
}

/**
 * Assert that a user has the required role. Throws ForbiddenError if not.
 */
export function assertRole(userRole: UserRole, requiredRole: UserRole): void {
  if (!hasRole(userRole, requiredRole)) {
    throw new ForbiddenError(
      `This action requires ${requiredRole} role or higher`
    );
  }
}

/**
 * Assert that a user has one of the specified roles. Throws ForbiddenError if not.
 */
export function assertAnyRole(userRole: UserRole, roles: UserRole[]): void {
  if (!isRole(userRole, roles)) {
    throw new ForbiddenError(
      `This action requires one of the following roles: ${roles.join(", ")}`
    );
  }
}

/**
 * Check if the user is an admin (ADMIN or SUPER_ADMIN).
 */
export function isAdmin(role: UserRole): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

/**
 * Check if the user is a super admin.
 */
export function isSuperAdmin(role: UserRole): boolean {
  return role === "SUPER_ADMIN";
}

/**
 * Check if the user is an affiliate.
 */
export function isAffiliate(role: UserRole): boolean {
  return role === "AFFILIATE";
}

/**
 * Get the display name for a role.
 */
export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    USER: "User",
    AFFILIATE: "Affiliate",
    ADMIN: "Administrator",
    SUPER_ADMIN: "Super Administrator",
  };
  return displayNames[role];
}

/**
 * Get the permissions for a given role.
 */
export function getRolePermissions(role: UserRole): string[] {
  const basePermissions = ["read:own", "write:own", "trade"];

  switch (role) {
    case "USER":
      return [...basePermissions];
    case "AFFILIATE":
      return [...basePermissions, "affiliate:earn", "affiliate:refer"];
    case "ADMIN":
      return [
        ...basePermissions,
        "admin:users",
        "admin:content",
        "admin:orders",
        "admin:reports",
        "admin:kyc",
      ];
    case "SUPER_ADMIN":
      return [
        ...basePermissions,
        "admin:users",
        "admin:content",
        "admin:orders",
        "admin:reports",
        "admin:kyc",
        "admin:settings",
        "admin:roles",
        "admin:audit",
      ];
    default:
      return basePermissions;
  }
}
