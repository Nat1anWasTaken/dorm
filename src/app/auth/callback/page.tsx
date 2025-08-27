"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebase/client";

const EMAIL_FOR_SIGN_IN_KEY = "firebase_email_for_sign_in";

export default function AuthCallbackPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsEmail, setNeedsEmail] = useState(false);

  const continueUrl = useMemo(() => {
    return search?.get("continueUrl") || search?.get("continue") || "/";
  }, [search]);

  useEffect(() => {
    async function run() {
      if (typeof window === "undefined") return;
      const href = window.location.href;
      const isLink = isSignInWithEmailLink(auth, href);
      if (!isLink) {
        setError("Invalid or expired sign-in link.");
        setLoading(false);
        return;
      }
      // Try stored email first
      const stored = window.localStorage.getItem(EMAIL_FOR_SIGN_IN_KEY);
      const urlEmail = search?.get("email") || "";
      const candidate = stored || urlEmail;
      if (!candidate) {
        setNeedsEmail(true);
        setLoading(false);
        return;
      }
      try {
        await signInWithEmailLink(auth, candidate, href);
        window.localStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY);
        router.replace(continueUrl);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to complete sign-in link.";
        setError(msg);
        setNeedsEmail(true);
      } finally {
        setLoading(false);
      }
    }
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleComplete(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window === "undefined") return;
    const href = window.location.href;
    if (!isSignInWithEmailLink(auth, href)) return;
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailLink(auth, email, href);
      window.localStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY);
      router.replace(continueUrl);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to complete sign-in link.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-white grid place-items-center px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Completing sign-in…</CardTitle>
            <CardDescription>
              {loading
                ? "Verifying your email link."
                : needsEmail
                ? "Enter your email to finish signing in."
                : error
                ? "There was a problem completing the link."
                : "Done"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
                {error}
              </div>
            )}
            {needsEmail && (
              <form onSubmit={handleComplete} className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Completing…" : "Complete sign-in"}
                </Button>
              </form>
            )}
            {!needsEmail && (
              <div className="text-sm text-muted-foreground">
                {loading ? "Please wait…" : "You can close this tab."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

