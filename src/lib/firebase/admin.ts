/**
 * Firebase Admin utilities for server-side operations
 * Note: This should only be used in API routes
 */

import { auth } from "./client";
import { UserClaims } from "@/lib/permissions";

/**
 * Verify Firebase ID token and return user claims
 * This is a client-side helper - for actual verification, use Firebase Admin SDK in API routes
 */
export async function getCurrentUserClaims(): Promise<UserClaims | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  try {
    const idTokenResult = await currentUser.getIdTokenResult();
    return {
      admin: (idTokenResult.claims.admin as boolean) || false,
      roles: (idTokenResult.claims.roles as string[]) || []
    };
  } catch (error) {
    console.error("Error getting user claims:", error);
    return null;
  }
}

/**
 * Get authorization header with ID token
 */
export async function getAuthHeader(): Promise<{ Authorization: string } | Record<string, never>> {
  const currentUser = auth.currentUser;
  if (!currentUser) return {};

  try {
    const token = await currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch (error) {
    console.error("Error getting auth token:", error);
    return {};
  }
}