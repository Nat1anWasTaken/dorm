"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0";
import { Bell, LogOut } from "lucide-react";
import Link from "next/link";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "Notice Board", href: "/notice-board" },
  { name: "Committee", href: "/committee" },
];

export function Header() {
  const { user, error, isLoading } = useUser();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-black"></div>
              <span className="text-xl font-bold">DormConnect</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.picture} alt={user.name || "User"} />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/auth/logout">
                      <LogOut className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </>
            ) : (
              <Button size="sm" asChild disabled={isLoading}>
                <a href="/auth/login">{isLoading ? "Loading..." : "Sign In"}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
