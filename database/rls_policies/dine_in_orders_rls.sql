-- =====================================================
-- RLS Policies for dine_in_orders and dine_in_order_items
-- =====================================================

-- Enable RLS on dine_in_orders table
ALTER TABLE public.dine_in_orders ENABLE ROW LEVEL SECURITY;

-- Enable RLS on dine_in_order_items table
ALTER TABLE public.dine_in_order_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- GUEST POLICIES FOR dine_in_orders
-- =====================================================

-- Policy: Guests can INSERT their own orders
-- This allows guests to create new orders with their guest_id and hotel_id
CREATE POLICY "Guests can insert their own dine_in_orders"
ON public.dine_in_orders
FOR INSERT
TO authenticated
WITH CHECK (
  guest_id IN (
    SELECT id FROM public.guests
    WHERE auth_user_id = auth.uid()
  )
);

-- Policy: Guests can SELECT their own orders
-- This allows guests to view their order history
CREATE POLICY "Guests can view their own dine_in_orders"
ON public.dine_in_orders
FOR SELECT
TO authenticated
USING (
  guest_id IN (
    SELECT id FROM public.guests
    WHERE auth_user_id = auth.uid()
  )
);

-- =====================================================
-- STAFF POLICIES FOR dine_in_orders
-- =====================================================

-- Policy: Staff can SELECT orders from their hotel
-- This allows hotel staff to view all orders for their hotel
CREATE POLICY "Staff can view dine_in_orders from their hotel"
ON public.dine_in_orders
FOR SELECT
TO authenticated
USING (
  hotel_id IN (
    SELECT hotel_id FROM public.profiles
    WHERE id = auth.uid()
    AND user_role IN ('staff', 'admin')
  )
);

-- Policy: Staff can UPDATE orders from their hotel
-- This allows staff to update order status, process orders, etc.
CREATE POLICY "Staff can update dine_in_orders from their hotel"
ON public.dine_in_orders
FOR UPDATE
TO authenticated
USING (
  hotel_id IN (
    SELECT hotel_id FROM public.profiles
    WHERE id = auth.uid()
    AND user_role IN ('staff', 'admin')
  )
)
WITH CHECK (
  hotel_id IN (
    SELECT hotel_id FROM public.profiles
    WHERE id = auth.uid()
    AND user_role IN ('staff', 'admin')
  )
);

-- =====================================================
-- GUEST POLICIES FOR dine_in_order_items
-- =====================================================

-- Policy: Guests can INSERT items for their own orders
-- This allows guests to add items when creating an order
CREATE POLICY "Guests can insert dine_in_order_items for their orders"
ON public.dine_in_order_items
FOR INSERT
TO authenticated
WITH CHECK (
  order_id IN (
    SELECT id FROM public.dine_in_orders
    WHERE guest_id IN (
      SELECT id FROM public.guests
      WHERE auth_user_id = auth.uid()
    )
  )
);

-- Policy: Guests can SELECT items from their own orders
-- This allows guests to view the items in their orders
CREATE POLICY "Guests can view dine_in_order_items from their orders"
ON public.dine_in_order_items
FOR SELECT
TO authenticated
USING (
  order_id IN (
    SELECT id FROM public.dine_in_orders
    WHERE guest_id IN (
      SELECT id FROM public.guests
      WHERE auth_user_id = auth.uid()
    )
  )
);

-- =====================================================
-- STAFF POLICIES FOR dine_in_order_items
-- =====================================================

-- Policy: Staff can SELECT order items from their hotel
-- This allows staff to view order details
CREATE POLICY "Staff can view dine_in_order_items from their hotel"
ON public.dine_in_order_items
FOR SELECT
TO authenticated
USING (
  order_id IN (
    SELECT id FROM public.dine_in_orders
    WHERE hotel_id IN (
      SELECT hotel_id FROM public.profiles
      WHERE id = auth.uid()
      AND user_role IN ('staff', 'admin')
    )
  )
);

-- Policy: Staff can UPDATE order items from their hotel
-- This allows staff to modify order items if needed
CREATE POLICY "Staff can update dine_in_order_items from their hotel"
ON public.dine_in_order_items
FOR UPDATE
TO authenticated
USING (
  order_id IN (
    SELECT id FROM public.dine_in_orders
    WHERE hotel_id IN (
      SELECT hotel_id FROM public.profiles
      WHERE id = auth.uid()
      AND user_role IN ('staff', 'admin')
    )
  )
)
WITH CHECK (
  order_id IN (
    SELECT id FROM public.dine_in_orders
    WHERE hotel_id IN (
      SELECT hotel_id FROM public.profiles
      WHERE id = auth.uid()
      AND user_role IN ('staff', 'admin')
    )
  )
);

-- =====================================================
-- NOTES
-- =====================================================
-- 
-- These policies ensure:
-- 1. Guests can only create and view their own orders
-- 2. Staff can view and manage orders from their hotel
-- 3. The guest_id and hotel_id fields in the application bypass RLS restrictions
--    because they match the authenticated user's data
-- 4. Cross-hotel data access is prevented
-- 5. Guests cannot modify orders after creation (only INSERT and SELECT)
-- 6. Staff have full management capabilities for their hotel's orders
--
