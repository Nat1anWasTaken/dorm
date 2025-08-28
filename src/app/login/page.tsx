"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import EmailPasswordLoginForm from "@/components/auth/email-password-login-form";
import MagicLinkForm from "@/components/auth/magic-link-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const search = useSearchParams();
  const continueUrl =
    search?.get("continueUrl") || search?.get("continue") || "/";

  return (
    <div className="grid min-h-[calc(100dvh-4rem)] place-items-center bg-white px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">登入</CardTitle>
            <CardDescription>
              使用電子郵件與密碼，或索取電子郵件登入連結。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="password">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="password">電子郵件與密碼</TabsTrigger>
                <TabsTrigger value="link">電子郵件連結</TabsTrigger>
              </TabsList>

              <TabsContent value="password">
                <EmailPasswordLoginForm continueUrl={continueUrl} />
              </TabsContent>

              <TabsContent value="link">
                <MagicLinkForm continueUrl={continueUrl} />
              </TabsContent>
            </Tabs>

            <div className="text-muted-foreground mt-6 text-center text-sm">
              <div>
                還沒有帳號？{" "}
                <Link href="/register" className="underline underline-offset-4">
                  註冊
                </Link>
              </div>
              <div className="mt-2">
                <Link href="/" className="underline underline-offset-4">
                  回到首頁
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
