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
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Join DormConnect in a minute.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="register">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="register">Create Account</TabsTrigger>
                <TabsTrigger value="link">Email Link</TabsTrigger>
              </TabsList>

              <TabsContent value="register">
                <RegisterForm continueUrl={continueUrl} />
              </TabsContent>

              <TabsContent value="link">
                <MagicLinkForm continueUrl={continueUrl} />
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Log in
              </Link>
            </div>
            <div className="mt-2 text-center text-sm text-muted-foreground">
              <Link href="/" className="underline underline-offset-4">
                Go back home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
