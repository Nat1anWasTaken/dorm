"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebase/client";

export type RegisterFormProps = {
  continueUrl?: string;
  className?: string;
};

export function RegisterForm({
  continueUrl = "/",
  className,
}: RegisterFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (password !== confirm) {
      setError("兩次輸入的密碼不一致。");
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }
      try {
        await sendEmailVerification(cred.user);
      } catch {}
      setMessage("帳號已建立，驗證郵件已寄出。");
      router.push(continueUrl);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "註冊失敗。";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleRegister}
      className={className ? className : "space-y-3"}
    >
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
        <label className="mb-1 block text-sm font-medium">姓名</label>
        <Input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="王小明"
          disabled={loading}
        />
      </div>
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
          autoComplete="new-password"
          disabled={loading}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">確認密碼</label>
        <Input
          type="password"
          required
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "建立中…" : "建立帳號"}
      </Button>
    </form>
  );
}

export default RegisterForm;
