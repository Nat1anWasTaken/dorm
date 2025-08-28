# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Package Manager:**

- This project uses pnpm exclusively. Always use `pnpm` instead of npm or yarn.

**Development:**

- `pnpm dev` - Start development server (uses Turbopack)
- `pnpm build` - Build for production (uses Turbopack)
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting with Prettier

**Utility Scripts:**

- `node scripts/set-admin.js <email>` - Set admin status for a user (requires Firebase service account)
- `node scripts/seed-notices.js` - Seed sample notices data
- `node scripts/check-env.js` - Validate environment variables

## Architecture

This is a Next.js 15 application using the App Router with TypeScript and Tailwind CSS.

**Project Structure:**

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components (ui, auth, notices, admin, editor)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions, API clients, and Firebase config
- `src/schemas/` - Zod validation schemas
- `src/types/` - TypeScript type definitions
- `scripts/` - Utility scripts for admin tasks
- Uses `@/` alias for imports pointing to `src/`

**UI Framework:**

- Configured for shadcn/ui components with "new-york" style
- Uses Lucide React for icons
- Tailwind CSS v4 with CSS variables enabled
- Class composition utility function `cn()` in `src/lib/utils.ts`
- Prettier configured with Tailwind CSS plugin for class sorting

**Dependencies:**

- Next.js 15 with React 19
- TypeScript with strict mode
- Tailwind CSS v4
- Utility libraries: clsx, class-variance-authority, tailwind-merge
- Firebase v11 for auth and Firestore database
- Lexical for rich text editing
- Zod for schema validation
- Sonner for toast notifications

**shadcn/ui Configuration:**

- Components go in `@/components`
- UI components in `@/components/ui`
- Hooks in `@/hooks`
- Global CSS in `src/app/globals.css`

**Component Creation Guidelines:**

- ALWAYS check if a component already exists before creating new ones
- Check `@/components/ui/` for existing shadcn/ui components
- If a shadcn/ui component doesn't exist, use the CLI: `pnpm dlx shadcn@latest add <component-name>`
- Only create custom components when shadcn/ui doesn't provide the needed functionality

**Firebase Integration:**

- Client-side Firebase config in `src/lib/firebase/client.ts`
- Server-side Firebase admin in `src/lib/firebase/admin.ts`
- Firestore operations in `src/lib/firebase/notices.ts`
- Authentication state management in `src/hooks/use-auth.ts`
- Admin role checking in `src/hooks/use-admin.ts`

**Rich Text Editor:**

- Lexical editor implementation in `src/components/editor/`
- Custom nodes and plugins in `src/components/blocks/editor-00/`
- Editor theme configuration in `src/components/editor/themes/`

**Code Quality:**

- ESLint configured with Next.js, TypeScript, and Prettier integration
- Prettier with Tailwind CSS class sorting
- TypeScript strict mode enabled

## Data Fetching

- Always use `@tanstack/react-query` for client-side data fetching, caching, and mutations. Prefer `useQuery` for reads and `useMutation` for writes.
- The app is already wrapped with a `QueryClientProvider` in `src/components/auth-provider.tsx`, which is used in `src/app/layout.tsx`. Do not add duplicate providers.
- Define query keys as stable arrays (for example, `["notices", params]` and `["notice", id]`) and colocate domain hooks in `@/hooks` (see `src/hooks/use-notices.ts`).
- Invalidate or update caches on mutation success (for example, `queryClient.invalidateQueries({ queryKey: ["notices"] })`). Prefer invalidation over manual cache writes unless doing focused updates.
- Avoid ad-hoc `fetch` in client components and avoid alternative client data libraries (for example, SWR). Use direct `fetch` only in server components or route handlers where React Query does not apply.
- Set `staleTime` thoughtfully to reduce unnecessary refetches; use `enabled` to guard queries that depend on required params/IDs.

**Example Pattern (Hooks):**

```ts
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api/notices";

export const noticesKeys = {
  all: ["notices"] as const,
  list: (params?: unknown) => ["notices", params] as const,
  detail: (id?: string) => ["notice", id] as const,
};

export function useNotices(params?: { category?: string; search?: string }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: noticesKeys.list(params),
    queryFn: () => api.fetchNotices(params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  const createMutation = useMutation({
    mutationFn: api.createNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticesKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      api.updateNotice(id, data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: noticesKeys.all });
      queryClient.invalidateQueries({ queryKey: noticesKeys.detail(variables.id) });
    },
  });

  return {
    notices: query.data?.notices ?? [],
    total: query.data?.total ?? 0,
    loading: query.isLoading,
    error: (query.error as Error | null)?.message ?? null,
    refreshNotices: query.refetch,
    createNotice: createMutation.mutateAsync,
    updateNotice: (id: string, data: any) => updateMutation.mutateAsync({ id, data }),
  } as const;
}

export function useNotice(id?: string) {
  return useQuery({
    queryKey: noticesKeys.detail(id),
    queryFn: () => api.fetchNotice(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}
```

## Documentation Research

**Context7 Integration:**

- Always use context7 MCP tools when searching for library documentation
- Use `resolve-library-id` first to find the correct library ID
- Then use `get-library-docs` to retrieve up-to-date documentation

<!-- Auth0 integration has been removed from this project. -->
