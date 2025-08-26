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

## Architecture

This is a Next.js 15 application using the App Router with TypeScript and Tailwind CSS.

**Project Structure:**
- `src/app/` - Next.js App Router pages and layouts
- `src/lib/` - Utility functions and shared logic
- Uses `@/` alias for imports pointing to `src/`

**UI Framework:**
- Configured for shadcn/ui components with "new-york" style
- Uses Lucide React for icons
- Tailwind CSS with CSS variables enabled
- Class composition utility function `cn()` in `src/lib/utils.ts:4`

**Dependencies:**
- Next.js 15 with React 19
- TypeScript with strict mode
- Tailwind CSS v4 
- Utility libraries: clsx, class-variance-authority, tailwind-merge
- Font: Geist (automatically optimized via next/font)

**shadcn/ui Configuration:**
- Components go in `@/components`
- UI components in `@/components/ui`  
- Hooks in `@/hooks`
- Global CSS in `src/app/globals.css`