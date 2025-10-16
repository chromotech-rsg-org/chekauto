import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="max-w-md w-full space-y-8 py-12">
        <div className="flex flex-col items-center">
          <img src={logoIcon} alt="ChekAuto" className="h-20 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Criar conta
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Preencha os dados para se cadastrar
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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

          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg mt-6">
            Criar conta
          </Button>
          
          <p className="text-center text-sm text-gray-600 pt-4">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-medium text-brand-yellow hover:text-brand-yellow-dark"
            >
              Faça login
            </button>
          </p>
          
          <p className="text-center text-sm text-gray-600">
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
  );
};
