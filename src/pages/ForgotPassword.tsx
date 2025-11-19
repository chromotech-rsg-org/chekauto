import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import truckBlue from '@/assets/truck-blue-sunset.png';
import logoYellow from '@/assets/logo-chekauto-yellow.png';
import logoIcon from '@/assets/logo-chekauto-icon.png';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, insira seu email');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (error) {
        throw error;
      }

      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao enviar email de recuperação:', error);
      toast.error(error.message || 'Erro ao enviar email de recuperação');
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
              Recuperação de Senha
            </h1>
            <p className="text-xl text-white/90">
              Enviaremos um link de recuperação para seu email
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
              Esqueceu sua senha?
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Digite seu email para receber as instruções de recuperação
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-full"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-600">
              Lembrou sua senha?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-brand-yellow hover:text-brand-yellow-dark"
              >
                Fazer Login
              </button>
            </p>
            
            <p className="text-center text-sm text-gray-600 mt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="font-medium text-gray-700 hover:text-black"
              >
                ← Voltar ao início
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
