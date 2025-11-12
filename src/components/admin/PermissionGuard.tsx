import { usePermissions } from '@/contexts/PermissionsContext';
import { Permission } from '@/lib/permissions';

interface PermissionGuardProps {
  module: keyof Permission;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  module,
  action,
  children,
  fallback = null,
}) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(module, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
