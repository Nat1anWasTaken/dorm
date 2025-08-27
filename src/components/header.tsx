"use client";

import Link from "next/link";
import { useMemo } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useCurrentUser } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "Notice Board", href: "/notice-board" },
  { name: "Committee", href: "/committee" },
];

export function Header() {
  const { user } = useCurrentUser();
  const letter = useMemo(() => {
    const src = user?.displayName || user?.email || "?";
    return src.trim().charAt(0).toUpperCase();
  }, [user]);
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

          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-end mr-8">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full">
                    <Avatar>
                      {user.photoURL ? (
                        <AvatarImage
                          src={user.photoURL}
                          alt={user.displayName || user.email || "User"}
                        />
                      ) : null}
                      <AvatarFallback>{letter}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-48">
                  {(user.displayName || user.email) && (
                    <DropdownMenuLabel className="truncate">
                      {user.displayName || user.email}
                    </DropdownMenuLabel>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => void signOut(auth)}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild size="sm" variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
