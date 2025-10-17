import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import truckBlue from '@/assets/truck-blue-sunset.png';
import logoYellow from '@/assets/logo-chekauto-yellow.png';
import logoYellowBlack from '@/assets/logo-chekauto-yellow-black.png';
import logoIcon from '@/assets/logo-chekauto-icon.png';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login de teste: admin@chekauto.com / admin123
    if (email === 'admin@chekauto.com' && password === 'admin123') {
      // Redirecionar para o dashboard administrativo
      navigate('/admin/dashboard');
    } else {
      alert('Credenciais inválidas. Use: admin@chekauto.com / admin123');
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
              Bem-vindo ao ChekAuto
            </h1>
            <p className="text-xl text-white/90">
              Consultoria especializada em Implementos
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center">
            <img src={logoIcon} alt="ChekAuto" className="h-16 mb-8" />
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Entre na sua conta para continuar
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
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="password" className="text-gray-700">Senha</Label>
                  <a href="#" className="text-sm font-medium text-brand-yellow hover:text-brand-yellow-dark">
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-full">
                Entrar
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/cadastro')}
                className="font-medium text-brand-yellow hover:text-brand-yellow-dark"
              >
                Cadastre-se
              </button>
            </p>
            
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                <strong>Login de teste:</strong><br />
                Email: admin@chekauto.com<br />
                Senha: admin123
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
