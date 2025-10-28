# Staff Communication Setup

## Database RPC Function Setup

The staff communication feature requires an RPC function for efficiently finding existing conversations between staff members.

### Setup Instructions

1. **Go to Supabase Dashboard**

   - Navigate to your project
   - Go to "SQL Editor"

2. **Create the RPC Function**

   - Copy the SQL from `database/functions/get_staff_conversation_between_users.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute

3. **Verify the Function**
   ```sql
   -- Test the function
   SELECT * FROM get_staff_conversation_between_users(
     'user1-uuid-here'::uuid,
     'user2-uuid-here'::uuid
   );
   ```

### What This Function Does

- Searches for existing 1-on-1 conversations between two staff members
- Returns the most recent conversation if found
- Ensures the conversation has exactly 2 participants
- Uses efficient database-level queries instead of multiple client calls

### Fallback Behavior

The application will work even without this RPC function:

- If the RPC doesn't exist, it falls back to a manual search method
- The manual method achieves the same result but with more queries
- Creating the RPC function improves performance and is considered best practice

### Benefits of Using RPC

✅ **Performance**: Single database call instead of multiple queries  
✅ **Reliability**: Database-level logic reduces edge cases  
✅ **Security**: Runs with `SECURITY DEFINER` for consistent permissions  
✅ **Maintainability**: Business logic in one place

## Troubleshooting

If you see "Failed to load conversation - Unknown error occurred":

1. Check browser console for detailed error logs
2. Verify RPC function is created in Supabase
3. Check RLS policies on `staff_conversations` and `staff_conversation_participants` tables
4. Ensure authenticated user has INSERT permissions on both tables
