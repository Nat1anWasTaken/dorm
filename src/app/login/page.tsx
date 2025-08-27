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
    <div className="min-h-[calc(100dvh-4rem)] bg-white grid place-items-center px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Log in</CardTitle>
            <CardDescription>
              Use email/password or request a magic link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="password">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="password">Email & Password</TabsTrigger>
                <TabsTrigger value="link">Email Link</TabsTrigger>
              </TabsList>

              <TabsContent value="password">
                <EmailPasswordLoginForm continueUrl={continueUrl} />
              </TabsContent>

              <TabsContent value="link">
                <MagicLinkForm continueUrl={continueUrl} />
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <div>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Register
                </Link>
              </div>
              <div className="mt-2">
                <Link href="/" className="underline underline-offset-4">
                  Go back home
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
