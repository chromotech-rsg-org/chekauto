import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import loginBackground from '@/assets/login-background.png';
import logoYellow from '@/assets/logo-chekauto-yellow.png';
import logoIcon from '@/assets/logo-chekauto-icon.png';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    
    console.log('Dados de cadastro:', formData);
    alert('Cadastro realizado com sucesso!');
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={loginBackground}
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

      {/* Right side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center">
            <img src={logoIcon} alt="ChekAuto" className="h-16 mb-8" />
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Criar conta
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Preencha os dados para se cadastrar
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <Label htmlFor="telefone" className="text-gray-700">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  required
                  value={formData.telefone}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-700">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Digite a senha novamente"
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-full">
                Criar conta
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-brand-yellow hover:text-brand-yellow-dark"
              >
                Faça login
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
};
