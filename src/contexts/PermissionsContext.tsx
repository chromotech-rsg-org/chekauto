import React, { createContext, useContext, useState, useEffect } from 'react';
import { Permission, adminPermissions } from '@/lib/permissions';

interface PermissionsContextType {
  permissions: Permission | null;
  setPermissions: (permissions: Permission) => void;
  hasPermission: (module: keyof Permission, action: string) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<Permission | null>(null);

  useEffect(() => {
    // Por enquanto, simula permissões de admin
    // Em produção, isso viria do perfil do usuário logado
    setPermissions(adminPermissions);
  }, []);

  const hasPermission = (module: keyof Permission, action: string): boolean => {
    if (!permissions) return false;
    const modulePermissions = permissions[module] as any;
    return modulePermissions?.[action] === true;
  };

  return (
    <PermissionsContext.Provider value={{ permissions, setPermissions, hasPermission }}>
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
