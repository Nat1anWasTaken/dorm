"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "./use-auth";

export interface AdminClaims {
  admin?: boolean;
  roles?: string[];
}

export function useAdminClaims() {
  const { user, loading: userLoading } = useCurrentUser();
  const [claims, setClaims] = useState<AdminClaims>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setClaims({});
      setLoading(false);
      return;
    }

    // Get the ID token to access custom claims
    user
      .getIdTokenResult()
      .then(idTokenResult => {
        const customClaims = idTokenResult.claims as AdminClaims;
        setClaims({
          admin: customClaims.admin || false,
          roles: customClaims.roles || [],
        });
      })
      .catch(error => {
        console.error("Error getting custom claims:", error);
        setClaims({});
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, userLoading]);

  const isAdmin = claims.admin === true;
  const hasRole = (role: string) => claims.roles?.includes(role) || false;

  return {
    claims,
    isAdmin,
    hasRole,
    loading,
  } as const;
}
