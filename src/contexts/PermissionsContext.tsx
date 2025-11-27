import React, { createContext, useContext, useState, useEffect } from 'react';
import { Permission, defaultPermissions } from '@/lib/permissions';
import { supabase } from '@/integrations/supabase/client';

interface PermissionsContextType {
  permissions: Permission | null;
  isDesenvolvedor: boolean;
  setPermissions: (permissions: Permission) => void;
  hasPermission: (module: keyof Permission, action: string) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<Permission | null>(null);
  const [isDesenvolvedor, setIsDesenvolvedor] = useState(false);

  useEffect(() => {
    loadUserPermissions();
  }, []);

  const loadUserPermissions = async () => {
    try {
      // Buscar usuário autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Erro ao buscar usuário:', authError);
        setPermissions(defaultPermissions);
        setIsDesenvolvedor(false);
        return;
      }

      if (!user) {
        setPermissions(defaultPermissions);
        setIsDesenvolvedor(false);
        return;
      }

      // Buscar usuário na tabela usuarios
      const { data: usuario, error: usuarioError } = await supabase
        .from('usuarios')
        .select('perfil_id')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (usuarioError) {
        console.error('Erro ao buscar dados do usuário:', usuarioError);
        setPermissions(defaultPermissions);
        setIsDesenvolvedor(false);
        return;
      }

      if (!usuario?.perfil_id) {
        setPermissions(defaultPermissions);
        setIsDesenvolvedor(false);
        return;
      }

      // Buscar perfil e suas permissões
      const { data: perfil, error: perfilError } = await supabase
        .from('perfis_permissoes')
        .select('permissoes, is_desenvolvedor')
        .eq('id', usuario.perfil_id)
        .maybeSingle();

      if (perfilError) {
        console.error('Erro ao buscar perfil:', perfilError);
        setPermissions(defaultPermissions);
        setIsDesenvolvedor(false);
        return;
      }

      if (perfil) {
        setPermissions(perfil.permissoes as Permission);
        setIsDesenvolvedor(perfil.is_desenvolvedor || false);
      } else {
        setPermissions(defaultPermissions);
        setIsDesenvolvedor(false);
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
      setPermissions(defaultPermissions);
      setIsDesenvolvedor(false);
    }
  };

  const hasPermission = (module: keyof Permission, action: string): boolean => {
    if (!permissions) return false;
    const modulePermissions = permissions[module] as any;
    return modulePermissions?.[action] === true;
  };

  return (
    <PermissionsContext.Provider value={{ permissions, isDesenvolvedor, setPermissions, hasPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};
