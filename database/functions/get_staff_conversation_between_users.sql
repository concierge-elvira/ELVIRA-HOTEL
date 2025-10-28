-- RPC Function to find conversation between two staff members
-- This is a best practice for complex queries with multiple participants

CREATE OR REPLACE FUNCTION get_staff_conversation_between_users(
  user1_id uuid,
  user2_id uuid
)
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  last_message_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Find conversations where both users are participants
  RETURN QUERY
  SELECT DISTINCT sc.id, sc.created_at, sc.last_message_at
  FROM staff_conversations sc
  WHERE sc.id IN (
    -- Get conversations for user1
    SELECT scp1.conversation_id
    FROM staff_conversation_participants scp1
    WHERE scp1.staff_id = user1_id
  )
  AND sc.id IN (
    -- Get conversations for user2
    SELECT scp2.conversation_id
    FROM staff_conversation_participants scp2
    WHERE scp2.staff_id = user2_id
  )
  -- Ensure it's a 1-on-1 conversation (exactly 2 participants)
  AND (
    SELECT COUNT(*)
    FROM staff_conversation_participants scp
    WHERE scp.conversation_id = sc.id
  ) = 2
  ORDER BY sc.last_message_at DESC NULLS LAST, sc.created_at DESC
  LIMIT 1;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_staff_conversation_between_users(uuid, uuid) TO authenticated;

-- Add comment
COMMENT ON FUNCTION get_staff_conversation_between_users IS 'Finds an existing 1-on-1 conversation between two staff members';
