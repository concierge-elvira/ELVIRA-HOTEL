# Regenerate Database Types

## Option 1: Using Supabase CLI (Recommended)

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

Replace `YOUR_PROJECT_ID` with your actual Supabase project ID (found in Project Settings).

## Option 2: Manual Copy from Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **API Docs** in the left sidebar
3. Scroll down to find **TypeScript Types**
4. Copy the entire generated TypeScript code
5. Replace the contents of `src/types/database.ts` with the copied code

## What This Does

This regenerates the TypeScript types to include:

- `hotel_thirdparty_places` table types
- `elvira_approved` field in `thirdparty_places`
- Proper relationships and foreign keys

## After Regenerating Types

Once types are regenerated, all TypeScript errors in the hooks will disappear and the application will compile successfully!

The Gastronomy tab will then work with:

- ✅ List of Elvira-approved places
- ✅ Approve/Reject buttons for each place
- ✅ Star icon to toggle recommendations
- ✅ Separate table showing only recommended places

## Verify It Works

1. Start the dev server: `npm run dev`
2. Navigate to Third-Party Management → Gastronomy
3. You should see the places with action buttons
4. Try approving a place and starring it
5. It should appear in the "Recommended" section below
