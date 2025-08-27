"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebase/client";

const EMAIL_FOR_SIGN_IN_KEY = "firebase_email_for_sign_in";

export type MagicLinkFormProps = {
  continueUrl?: string;
  className?: string;
};

export function MagicLinkForm({ continueUrl = "/", className }: MagicLinkFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [linkPresent, setLinkPresent] = useState(false);

  const actionCodeSettings = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${baseUrl}/auth/callback?continueUrl=${encodeURIComponent(continueUrl)}`;
    const dynamicLinkDomain =
      process.env.NEXT_PUBLIC_FIREBASE_DYNAMIC_LINK_DOMAIN || undefined;
    return { handleCodeInApp: true, url, dynamicLinkDomain } as const;
  }, [continueUrl]);

  const completeEmailLinkIfPresent = useCallback(async () => {
    if (typeof window === "undefined") return;
    const href = window.location.href;
    const present = isSignInWithEmailLink(auth, href);
    setLinkPresent(present);
    if (!present) return;

    setMessage("Completing sign-in…");
    setError(null);
    setLoading(true);
    try {
      const stored = window.localStorage.getItem(EMAIL_FOR_SIGN_IN_KEY) || email;
      if (!stored) {
        setMessage(null);
        setError("Enter your email to complete sign-in.");
        setLoading(false);
        return;
      }
      await signInWithEmailLink(auth, stored, href);
      window.localStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY);
      router.push(continueUrl);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to complete sign-in link.";
      setError(msg);
      setMessage(null);
    } finally {
      setLoading(false);
    }
  }, [email, continueUrl, router]);

  useEffect(() => {
    void completeEmailLinkIfPresent();
  }, [completeEmailLinkIfPresent]);

  async function handleSendEmailLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(EMAIL_FOR_SIGN_IN_KEY, email);
      }
      setMessage("Sign-in link sent. Check your email.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to send sign-in link.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteEmailLink() {
    if (typeof window === "undefined") return;
    const href = window.location.href;
    if (!isSignInWithEmailLink(auth, href)) return;
    setLoading(true);
    setMessage("Completing sign-in…");
    setError(null);
    try {
      await signInWithEmailLink(auth, email, href);
      window.localStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY);
      router.push(continueUrl);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to complete sign-in link.";
      setError(msg);
      setMessage(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSendEmailLink} className={className ? className : "space-y-3"}>
      {message && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
          {error}
        </div>
      )}
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
      <div className="flex gap-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Sending…" : "Send sign-in link"}
        </Button>
        {linkPresent && (
          <Button
            type="button"
            variant="outline"
            disabled={loading || !email}
            onClick={handleCompleteEmailLink}
          >
            Complete sign-in
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        We’ll email you a secure link. After clicking it, you’ll be signed in here.
      </p>
    </form>
  );
}

export default MagicLinkForm;
