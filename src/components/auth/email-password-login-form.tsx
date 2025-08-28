"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebase/client";

export type EmailPasswordLoginFormProps = {
  continueUrl?: string;
  className?: string;
};

export function EmailPasswordLoginForm({
  continueUrl = "/",
  className,
}: EmailPasswordLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(continueUrl);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "登入失敗。";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handlePasswordSignIn}
      className={className ? className : "space-y-3"}
    >
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
          {error}
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium">電子郵件</label>
        <Input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={loading}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">密碼</label>
        <Input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "登入中…" : "登入"}
      </Button>
      <div className="text-center">
        <Link
          href="/login/forgot-password"
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          忘記密碼？
        </Link>
      </div>
    </form>
  );
}

export default EmailPasswordLoginForm;
