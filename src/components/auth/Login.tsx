import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import logoBlack from '@/assets/logo-chekauto-black.png';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // TODO: Implement authentication
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoBlack} alt="CHEKAUTO" className="h-12 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-black mb-2">Bem-vindo de volta</h1>
          <p className="text-gray-600">Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-black font-medium">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="mt-1"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-black font-medium">Senha</Label>
              <Link to="/recuperar-senha" className="text-sm text-chekauto-yellow hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-black text-white hover:bg-black/90 h-12 text-base font-semibold rounded-full">
            Entrar
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-chekauto-yellow font-semibold hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-chekauto-yellow">
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
};
