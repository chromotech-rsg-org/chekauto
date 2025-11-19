import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import truckBlue from '@/assets/truck-blue-sunset.png';
import logoYellow from '@/assets/logo-chekauto-yellow.png';
import logoIcon from '@/assets/logo-chekauto-icon.png';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verificar se há uma sessão de recuperação válida
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error('Link de recuperação inválido ou expirado');
        navigate('/esqueci-senha');
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      toast.success('Senha redefinida com sucesso!');
      
      // Fazer logout para forçar novo login com a nova senha
      await supabase.auth.signOut();
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      toast.error(error.message || 'Erro ao redefinir senha');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={truckBlue}
          alt="ChekAuto"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center px-8">
            <img src={logoYellow} alt="ChekAuto" className="h-20 mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-white mb-4">
              Nova Senha
            </h1>
            <p className="text-xl text-white/90">
              Crie uma nova senha segura para sua conta
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center">
            <img src={logoIcon} alt="ChekAuto" className="h-16 mb-8" />
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Redefinir Senha
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Digite sua nova senha abaixo
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-gray-700">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-full"
                disabled={isLoading}
              >
                {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-600">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-brand-yellow hover:text-brand-yellow-dark"
              >
                Voltar ao Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
