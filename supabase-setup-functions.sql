
-- Create function to update used storage atomically
CREATE OR REPLACE FUNCTION public.update_used_storage(
  connection_id UUID,
  size_change BIGINT
)
RETURNS void AS $$
BEGIN
  UPDATE public.cloud_connections 
  SET 
    used_storage = GREATEST(0, used_storage + size_change),
    updated_at = NOW()
  WHERE id = connection_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
