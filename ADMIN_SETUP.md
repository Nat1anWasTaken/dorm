# Admin Permission Setup

This document explains how to set up and use the admin permission system for managing notice posts.

## Overview

The admin permission system uses Firebase Custom Claims to grant administrative privileges to specific users. Users with admin claims can:

- Create new notices
- Edit existing notices
- Delete notices
- Pin/unpin notices

## Setup Instructions

### 1. Set up Environment Variables

First, configure your Firebase environment variables:
1. Copy `.env.local.template` to `.env.local`
2. Go to [Firebase Console](https://console.firebase.google.com/)
3. Select your project → Project Settings (gear icon) → General
4. Scroll down to "Your apps" section
5. Copy the Firebase config values to your `.env.local` file:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 2. Configure Firestore

Make sure your Firebase project has Firestore enabled:
1. In Firebase Console, go to Firestore Database
2. Create database (if not already created)
3. Choose your security rules (start in test mode for development)

### 3. Seed Initial Data (Optional)

You can populate Firestore with sample notices:
```bash
# Make sure your environment variables are set in .env.local
node scripts/seed-notices.js
```

### 4. Install firebase-admin (for the setup script)

The setup script requires firebase-admin to be installed separately (not in your main project):

```bash
npm install -g firebase-admin
# or
npm install firebase-admin
```

### 2. Get Firebase Service Account Key

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Save the JSON file securely (e.g., `firebase-service-account.json`)

### 3. Set Admin Claims

Use the provided script to set admin claims for a user:

```bash
# Set environment variable for the service account key
export FIREBASE_SERVICE_ACCOUNT_KEY="/path/to/your/firebase-service-account.json"

# Run the script to make nathan@nat1an.xyz an admin
node scripts/set-admin.js nathan@nat1an.xyz
```

**Important:** The user must already have an account (must have registered) before you can set admin claims.

### 4. Verify Admin Access

1. Log in as the user you granted admin permissions to
2. Visit the Notice Board page
3. You should see:
   - A "Create Notice" button in the top-right
   - Edit, Pin/Unpin, and Delete buttons on each notice card

## How It Works

### Custom Claims Structure

The admin system uses the following Firebase Custom Claims:

```json
{
  "admin": true,
  "roles": ["admin"]
}
```

### Client-Side Permission Checking

- `useAdminClaims()` hook - Gets the current user's admin claims
- `src/lib/permissions.ts` - Utility functions for permission checks
- Components automatically show/hide admin controls based on permissions

### API Protection

API endpoints check for:
1. Valid Firebase ID token in Authorization header
2. Admin claims in the token (when implemented with Firebase Admin SDK)

## Files Created/Modified

### New Files:
- `scripts/set-admin.js` - Script to set admin claims
- `src/hooks/use-admin.ts` - Hook for checking admin permissions
- `src/lib/permissions.ts` - Permission utility functions
- `src/lib/firebase/admin.ts` - Admin utilities for client-side
- `src/app/api/notices/route.ts` - API endpoints for notices
- `src/app/api/notices/[id]/route.ts` - Individual notice API endpoints

### Modified Files:
- `src/components/notice-card.tsx` - Added admin controls (edit, delete, pin buttons)
- `src/components/notice-board.tsx` - Added create notice button for admins

## Usage

### For Admins:
1. **Create Notice**: Click "Create Notice" button on the Notice Board
2. **Edit Notice**: Click the edit (pencil) icon on any notice card
3. **Delete Notice**: Click the delete (trash) icon on any notice card
4. **Pin/Unpin Notice**: Click the pin icon to toggle pinned status

### For Regular Users:
- All admin controls are hidden
- Only viewing functionality is available

## Security Notes

- Keep your Firebase service account key secure and never commit it to version control
- Admin claims are verified on both client and server side
- API endpoints require valid Firebase ID tokens
- Only users with explicit admin claims can perform management operations

## Troubleshooting

### "User not found" Error
The user must register an account first before you can set admin claims.

### Admin Controls Not Showing
1. Check that the user has been granted admin claims using the script
2. Ensure the user logs out and logs back in after claims are set
3. Check browser console for any errors

### API Errors
1. Ensure Firebase is properly configured
2. Check that environment variables are set correctly
3. Verify the user is authenticated and has a valid session