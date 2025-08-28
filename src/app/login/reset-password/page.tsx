"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidCode, setIsValidCode] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  // Verify the reset code on component mount
  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        toast.error("無效的重設連結");
        router.push("/login/forgot-password");
        return;
      }

      try {
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail);
        setIsValidCode(true);
      } catch (error: unknown) {
        console.error("Code verification error:", error);

        if (error instanceof FirebaseError) {
          switch (error.code) {
            case "auth/expired-action-code":
              toast.error("重設連結已過期，請重新申請");
              break;
            case "auth/invalid-action-code":
              toast.error("無效的重設連結");
              break;
            default:
              toast.error("連結驗證失敗，請重新申請");
          }
          router.push("/login/forgot-password");
          return;
        }

        switch ((error as { code?: string }).code) {
          case "auth/expired-action-code":
            toast.error("重設連結已過期，請重新申請");
            break;
          case "auth/invalid-action-code":
            toast.error("無效的重設連結");
            break;
          default:
            toast.error("連結驗證失敗，請重新申請");
        }
        router.push("/login/forgot-password");
      } finally {
        setIsValidating(false);
      }
    };

    verifyCode();
  }, [oobCode, router]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return "密碼至少需要 6 個字元";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("請填寫所有欄位");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("密碼確認不符");
      return;
    }

    setIsLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode!, newPassword);
      setResetComplete(true);
      toast.success("密碼重設成功！");
    } catch (error: unknown) {
      console.error("Password reset error:", error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/expired-action-code":
            toast.error("重設連結已過期，請重新申請");
            router.push("/login/forgot-password");
            break;
          case "auth/invalid-action-code":
            toast.error("無效的重設連結");
            router.push("/login/forgot-password");
            break;
          case "auth/weak-password":
            toast.error("密碼強度不足，請使用更複雜的密碼");
            break;
          default:
            toast.error("密碼重設失敗，請稍後再試");
        }
        return;
      }

      switch ((error as { code?: string }).code) {
        case "auth/expired-action-code":
          toast.error("重設連結已過期，請重新申請");
          router.push("/login/forgot-password");
          break;
        case "auth/invalid-action-code":
          toast.error("無效的重設連結");
          router.push("/login/forgot-password");
          break;
        case "auth/weak-password":
          toast.error("密碼強度不足，請使用更複雜的密碼");
          break;
        default:
          toast.error("密碼重設失敗，請稍後再試");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while validating code
  if (isValidating) {
    return (
      <Container className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
              <p className="text-muted-foreground text-sm">驗證重設連結中...</p>
            </div>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Success state
  if (resetComplete) {
    return (
      <Container className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">密碼重設完成</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground text-sm">
              您的密碼已成功重設。現在您可以使用新密碼登入。
            </p>
            <Button asChild className="w-full">
              <Link href="/login">前往登入</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Invalid code - this shouldn't render since we redirect, but just in case
  if (!isValidCode) {
    return (
      <Container className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">連結無效</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground text-sm">
              此重設連結無效或已過期。
            </p>
            <Button asChild className="w-full">
              <Link href="/login/forgot-password">重新申請</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Main password reset form
  return (
    <Container className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>設定新密碼</CardTitle>
          <p className="text-muted-foreground text-sm">{email}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">新密碼</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="輸入新密碼"
                autoComplete="new-password"
                required
              />
              <p className="text-muted-foreground text-xs">
                密碼至少需要 6 個字元
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">確認新密碼</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="再次輸入新密碼"
                autoComplete="new-password"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "重設中..." : "重設密碼"}
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                返回登入
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}
