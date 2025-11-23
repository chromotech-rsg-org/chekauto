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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPermissions(defaultPermissions);
        return;
      }

      // Buscar usuário na tabela usuarios
      const { data: usuario } = await supabase
        .from('usuarios')
        .select('perfil_id')
        .eq('auth_user_id', user.id)
        .single();

      if (!usuario?.perfil_id) {
        setPermissions(defaultPermissions);
        return;
      }

      // Buscar perfil e suas permissões
      const { data: perfil } = await supabase
        .from('perfis_permissoes')
        .select('permissoes, is_desenvolvedor')
        .eq('id', usuario.perfil_id)
        .single();

      if (perfil) {
        setPermissions(perfil.permissoes as Permission);
        setIsDesenvolvedor(perfil.is_desenvolvedor || false);
      } else {
        setPermissions(defaultPermissions);
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
      setPermissions(defaultPermissions);
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
