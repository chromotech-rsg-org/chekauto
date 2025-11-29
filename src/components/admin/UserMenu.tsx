import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Palette, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

export const UserMenu = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    loadUsuario();
  }, []);

  const loadUsuario = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();
      
      if (data) {
        setUsuario(data);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/login');
    toast.success('Logout realizado com sucesso');
  };

  const getInitials = (nome: string) => {
    const names = nome.split(' ');
    return names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : nome.substring(0, 2).toUpperCase();
  };

  const themeLabels = {
    padrao: 'Padrão',
    dark: 'Escuro',
    light: 'Claro'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">{usuario?.nome || 'Usuário'}</p>
            <p className="text-xs text-muted-foreground">{usuario?.email || ''}</p>
          </div>
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src={usuario?.foto_url || ''} alt={usuario?.nome || 'User'} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {usuario?.nome ? getInitials(usuario.nome) : <User className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            <span>Tema: {themeLabels[theme]}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme('padrao')}>
              {theme === 'padrao' && '✓ '}Padrão
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              {theme === 'dark' && '✓ '}Escuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('light')}>
              {theme === 'light' && '✓ '}Claro
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};