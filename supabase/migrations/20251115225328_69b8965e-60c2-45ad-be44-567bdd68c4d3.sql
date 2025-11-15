-- Corrigir função update_updated_at_column_generic com search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column_generic()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.atualizado_em = now();
    RETURN NEW;
END;
$$;