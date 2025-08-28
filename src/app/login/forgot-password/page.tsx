"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("請輸入電子郵件地址");
      return;
    }

    setIsLoading(true);

    try {
      // Send password reset email
      // Note: To use custom reset page, configure the action URL in Firebase Console
      // under Authentication > Templates > Password reset
      // Set it to: https://yourdomain.com/login/reset-password
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success("密碼重設郵件已發送！");
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      switch (error.code) {
        case "auth/user-not-found":
          toast.error("找不到此電子郵件帳號");
          break;
        case "auth/invalid-email":
          toast.error("電子郵件格式不正確");
          break;
        case "auth/too-many-requests":
          toast.error("請求過於頻繁，請稍後再試");
          break;
        default:
          toast.error("發送失敗，請稍後再試");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Container className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>郵件已發送</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              我們已將密碼重設連結發送至：
              <br />
              <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              請檢查您的信箱並點擊連結來重設密碼。如果沒有收到郵件，請檢查垃圾郵件資料夾。
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <Button asChild>
                <Link href="/login">返回登入</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
              >
                重新發送
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>忘記密碼</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">電子郵件</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="輸入您的電子郵件地址"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "發送中..." : "發送重設連結"}
            </Button>
            
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground"
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