import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '@/components/ui/stepper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import logoYellow from '@/assets/logo-chekauto-yellow.png';

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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black py-6 px-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={logoYellow} alt="CHEKAUTO" className="h-8" />
          <nav className="hidden md:flex items-center gap-12 text-white text-sm font-semibold">
            <a href="/" className="hover:text-brand-yellow transition-colors">A CHEKAUTO</a>
            <a href="/#consultation" className="hover:text-brand-yellow transition-colors">CONSULTA</a>
            <a href="/#implementations" className="hover:text-brand-yellow transition-colors">IMPLEMENTOS</a>
            <a href="/#benefits" className="hover:text-brand-yellow transition-colors">DIFERENCIAIS</a>
            <div className="w-10 h-10 bg-brand-yellow rounded-full"></div>
          </nav>
        </div>
      </header>

      {/* Stepper */}
      <div className="py-8 bg-black">
        <Stepper steps={steps} />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="bg-white rounded-lg p-8">
            <h1 className="text-2xl font-bold text-black mb-1">Dados do Cliente</h1>
            <p className="text-gray-600 mb-6 text-sm">Preencha todas as informações corretamente</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={(e) => setFormData(prev => ({ ...prev, nomeCompleto: e.target.value }))}
                placeholder="Nome Completo:"
                className="bg-gray-100 border-0"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={(e) => setFormData(prev => ({ ...prev, cpfCnpj: e.target.value }))}
                  placeholder="CPF/CNPJ:"
                  className="bg-gray-100 border-0"
                  required
                />
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                  onBlur={handleCepBlur}
                  placeholder="CEP:"
                  className="bg-gray-100 border-0"
                  required
                />
              </div>

              <Input
                id="rua"
                value={formData.rua}
                onChange={(e) => setFormData(prev => ({ ...prev, rua: e.target.value }))}
                placeholder="Rua:"
                className="bg-gray-100 border-0"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                  placeholder="Número:"
                  className="bg-gray-100 border-0"
                  required
                />
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
                  placeholder="Bairro:"
                  className="bg-gray-100 border-0"
                  required
                />
              </div>

              <Input
                id="complemento"
                value={formData.complemento}
                onChange={(e) => setFormData(prev => ({ ...prev, complemento: e.target.value }))}
                placeholder="Complemento:"
                className="bg-gray-100 border-0"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="E-mail:"
                  className="bg-gray-100 border-0"
                  required
                />
                <Input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="Telefone:"
                  className="bg-gray-100 border-0"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-semibold rounded-full">
                Próximo
              </Button>
            </form>
          </div>

          {/* Image */}
          <div className="hidden md:block relative rounded-lg overflow-hidden h-[700px]">
            <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800" alt="Cliente satisfeito" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-yellow to-transparent p-8">
              <p className="text-white text-xl font-semibold mb-2">Do chassi à rodovia, a validação que garante seu caminho</p>
              <img src={logoYellow} alt="CHEKAUTO" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
