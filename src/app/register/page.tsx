"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import MagicLinkForm from "@/components/auth/magic-link-form";
import RegisterForm from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegisterPage() {
  const search = useSearchParams();
  const continueUrl =
    search?.get("continueUrl") || search?.get("continue") || "/";

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-white grid place-items-center px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">建立你的帳號</CardTitle>
            <CardDescription>一分鐘內加入 DormConnect。</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="register">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="register">建立帳號</TabsTrigger>
                <TabsTrigger value="link">電子郵件連結</TabsTrigger>
              </TabsList>

              <TabsContent value="register">
                <RegisterForm continueUrl={continueUrl} />
              </TabsContent>

              <TabsContent value="link">
                <MagicLinkForm continueUrl={continueUrl} />
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              已經有帳號了嗎？{" "}
              <Link href="/login" className="underline underline-offset-4">
                登入
              </Link>
            </div>
            <div className="mt-2 text-center text-sm text-muted-foreground">
              <Link href="/" className="underline underline-offset-4">
                回到首頁
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
