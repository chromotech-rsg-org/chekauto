import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Theme = 'padrao' | 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('padrao');

  useEffect(() => {
    const loadUserTheme = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('usuarios')
          .select('tema')
          .eq('auth_user_id', user.id)
          .single();
        
        if (data?.tema) {
          setThemeState(data.tema as Theme);
          applyTheme(data.tema as Theme);
        }
      }
    };

    loadUserTheme();
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove classes anteriores
    root.classList.remove('theme-dark', 'theme-light');
    
    // Aplica nova classe se não for padrão
    if (newTheme === 'dark') {
      root.classList.add('theme-dark');
    } else if (newTheme === 'light') {
      root.classList.add('theme-light');
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);

    // Salvar no banco
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('usuarios')
        .update({ tema: newTheme })
        .eq('auth_user_id', user.id);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};