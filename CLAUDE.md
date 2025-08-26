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

**Component Creation Guidelines:**
- ALWAYS check if a component already exists before creating new ones
- Check `@/components/ui/` for existing shadcn/ui components
- If a shadcn/ui component doesn't exist, use the CLI: `pnpm dlx shadcn@latest add <component-name>`
- Only create custom components when shadcn/ui doesn't provide the needed functionality

## Documentation Research

**Context7 Integration:**
- Always use context7 MCP tools when searching for library documentation
- Use `resolve-library-id` first to find the correct library ID
- Then use `get-library-docs` to retrieve up-to-date documentation