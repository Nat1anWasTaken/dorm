"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, loading } as const;
}

export function useForgotPassword() {
  const mutation = useMutation({
    mutationFn: async (email: string) => {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    },
  });

  return {
    sendResetEmail: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message ?? null,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  } as const;
}
