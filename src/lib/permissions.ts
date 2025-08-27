/**
 * Permission utilities for checking admin access
 */

export interface UserClaims {
  admin?: boolean;
  roles?: string[];
}

export type Permission = 
  | "manage_notices"
  | "create_notices"
  | "edit_notices"
  | "delete_notices"
  | "pin_notices";

/**
 * Check if user has admin permissions
 */
export function isAdmin(claims: UserClaims | null | undefined): boolean {
  return claims?.admin === true;
}

/**
 * Check if user has a specific role
 */
export function hasRole(claims: UserClaims | null | undefined, role: string): boolean {
  return claims?.roles?.includes(role) || false;
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(claims: UserClaims | null | undefined, permission: Permission): boolean {
  // For now, all notice permissions require admin status
  switch (permission) {
    case "manage_notices":
    case "create_notices":
    case "edit_notices":
    case "delete_notices":
    case "pin_notices":
      return isAdmin(claims);
    default:
      return false;
  }
}

/**
 * Check if user can manage notices (admin only)
 */
export function canManageNotices(claims: UserClaims | null | undefined): boolean {
  return hasPermission(claims, "manage_notices");
}

/**
 * Check if user can create notices (admin only)
 */
export function canCreateNotices(claims: UserClaims | null | undefined): boolean {
  return hasPermission(claims, "create_notices");
}

/**
 * Check if user can edit notices (admin only)
 */
export function canEditNotices(claims: UserClaims | null | undefined): boolean {
  return hasPermission(claims, "edit_notices");
}

/**
 * Check if user can delete notices (admin only)
 */
export function canDeleteNotices(claims: UserClaims | null | undefined): boolean {
  return hasPermission(claims, "delete_notices");
}

/**
 * Check if user can pin/unpin notices (admin only)
 */
export function canPinNotices(claims: UserClaims | null | undefined): boolean {
  return hasPermission(claims, "pin_notices");
}