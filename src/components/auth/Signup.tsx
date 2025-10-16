import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import logoBlack from '@/assets/logo-chekauto-black.png';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup attempt:', formData);
    // TODO: Implement registration
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoBlack} alt="CHEKAUTO" className="h-12 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-black mb-2">Criar conta</h1>
          <p className="text-gray-600">Preencha os dados para se cadastrar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name" className="text-black font-medium">Nome completo</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-black font-medium">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-black font-medium">Telefone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-black font-medium">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-black font-medium">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Digite a senha novamente"
              className="mt-1"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-chekauto-yellow text-black hover:bg-chekauto-yellow/90 h-12 text-base font-semibold rounded-full">
            Criar conta
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-chekauto-yellow font-semibold hover:underline">
              Faça login
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
