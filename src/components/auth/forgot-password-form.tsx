"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/hooks/use-auth";

export type ForgotPasswordFormProps = {
  className?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function ForgotPasswordForm({
  className,
  onSuccess,
  onCancel,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const { sendResetEmail, loading, error, isSuccess, reset } =
    useForgotPassword();

  useEffect(() => {
    if (isSuccess) {
      onSuccess?.();
    }
  }, [isSuccess, onSuccess]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await sendResetEmail(email);
    } catch {
      // Error is handled by the hook
    }
  }

  if (isSuccess) {
    return (
      <div className={className ? className : "space-y-3"}>
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">
          密碼重設郵件已發送到您的電子郵件地址。請檢查您的郵箱並按照指示重設密碼。
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            onCancel?.();
          }}
          className="w-full"
        >
          返回登入
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
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
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            onCancel?.();
          }}
          disabled={loading}
          className="w-full"
        >
          取消
        </Button>
        <Button type="submit" disabled={loading || !email} className="w-full">
          {loading ? "發送中…" : "發送重設郵件"}
        </Button>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
