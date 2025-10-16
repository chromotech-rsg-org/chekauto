import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '@/components/ui/stepper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import logoBlack from '@/assets/logo-chekauto-black.png';

export default function ClientData() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpfCnpj: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    complemento: '',
    email: '',
    telefone: ''
  });

  const steps = [
    { label: 'Dados do Veículo', completed: true, active: false },
    { label: 'Dados do Cliente', completed: false, active: true },
    { label: 'Pagamento', completed: false, active: false },
    { label: 'Finalizado', completed: false, active: false }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Client data:', formData);
    navigate('/solicitacao/pagamento');
  };

  const handleCepBlur = async () => {
    if (formData.cep.length === 8) {
      // TODO: Buscar CEP via API ViaCEP
      console.log('Buscando CEP:', formData.cep);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6">
        <img src={logoBlack} alt="CHEKAUTO" className="h-8" />
      </header>

      {/* Stepper */}
      <div className="py-12 bg-gray-50">
        <Stepper steps={steps} />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Dados do Cliente</h1>
            <p className="text-gray-600 mb-8">Preencha seus dados para continuar</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                <Input
                  id="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={(e) => setFormData(prev => ({ ...prev, nomeCompleto: e.target.value }))}
                  placeholder="Digite seu nome completo"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                <Input
                  id="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={(e) => setFormData(prev => ({ ...prev, cpfCnpj: e.target.value }))}
                  placeholder="000.000.000-00"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                  className="mt-1"
                  required
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <Label htmlFor="rua">Rua *</Label>
                  <Input
                    id="rua"
                    value={formData.rua}
                    onChange={(e) => setFormData(prev => ({ ...prev, rua: e.target.value }))}
                    placeholder="Nome da rua"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                    placeholder="123"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input
                    id="bairro"
                    value={formData.bairro}
                    onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
                    placeholder="Bairro"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={formData.complemento}
                    onChange={(e) => setFormData(prev => ({ ...prev, complemento: e.target.value }))}
                    placeholder="Apto, bloco, etc"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="seu@email.com"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(00) 00000-0000"
                  className="mt-1"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-black text-white hover:bg-black/90 h-12 text-base font-semibold rounded-full">
                Próximo
              </Button>
            </form>
          </div>

          {/* Image */}
          <div className="hidden md:block">
            <div className="bg-gray-100 rounded-lg h-[600px] flex items-center justify-center">
              <p className="text-gray-400">Imagem pessoa com jaqueta amarela</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
