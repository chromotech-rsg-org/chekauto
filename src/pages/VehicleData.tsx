import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '@/components/ui/stepper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useCheckout } from '@/contexts/CheckoutContext';
import logoYellow from '@/assets/logo-chekauto-yellow.png';
import truckVehicleData from '@/assets/truck-vehicle-data.png';

export default function VehicleData() {
  const navigate = useNavigate();
  const { vehicle, setVehicleData } = useCheckout();
  
  const [formData, setFormData] = useState({
    chassi: vehicle.chassi || '',
    renavam: vehicle.renavam || '',
    ano: vehicle.ano || '',
    placa: vehicle.placa || '',
    estado: vehicle.estado || '',
    cidade: vehicle.cidade || '',
    informacaoAdicional: vehicle.informacaoAdicional || '',
    notaFiscal: vehicle.notaFiscal || null
  });
  const steps = [{
    label: 'Dados do Veículo',
    completed: false,
    active: true
  }, {
    label: 'Dados do Cliente',
    completed: false,
    active: false
  }, {
    label: 'Pagamento',
    completed: false,
    active: false
  }, {
    label: 'Finalizado',
    completed: false,
    active: false
  }];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicleData(formData);
    navigate('/solicitacao/cliente');
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        notaFiscal: e.target.files![0]
      }));
    }
  };
  return <div className="min-h-screen bg-white">
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
      <div className="py-8 bg-white">
        <Stepper steps={steps} />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="bg-white rounded-lg p-8">
            <h1 className="text-2xl font-bold text-black mb-1">Dados do Veículo</h1>
            <p className="text-gray-600 mb-6 text-sm">Preencha todas as informações corretamente</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input id="chassi" value={formData.chassi} onChange={e => setFormData(prev => ({
                ...prev,
                chassi: e.target.value
              }))} placeholder="Número do Chassi:" className="bg-gray-100 border-0" required />
                <Input id="renavam" value={formData.renavam} onChange={e => setFormData(prev => ({
                ...prev,
                renavam: e.target.value
              }))} placeholder="Renavam:" className="bg-gray-100 border-0" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input id="ano" value={formData.ano} onChange={e => setFormData(prev => ({
                ...prev,
                ano: e.target.value
              }))} placeholder="Ano do Veículo:" className="bg-gray-100 border-0" required />
                <Input id="placa" value={formData.placa} onChange={e => setFormData(prev => ({
                ...prev,
                placa: e.target.value
              }))} placeholder="Placa do Veículo:" className="bg-gray-100 border-0" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input id="estado" value={formData.estado} onChange={e => setFormData(prev => ({
                ...prev,
                estado: e.target.value
              }))} placeholder="Estado:" className="bg-gray-100 border-0" required />
                <Input id="cidade" value={formData.cidade} onChange={e => setFormData(prev => ({
                ...prev,
                cidade: e.target.value
              }))} placeholder="Cidade:" className="bg-gray-100 border-0" required />
              </div>

              <Textarea id="informacaoAdicional" value={formData.informacaoAdicional} onChange={e => setFormData(prev => ({
              ...prev,
              informacaoAdicional: e.target.value
            }))} placeholder="Informação adicional:" className="bg-gray-100 border-0 min-h-[80px]" />

              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Faça o Upload da Nota Fiscal do seu Veículo:</p>
                <p className="text-xs text-gray-500 mb-3">Imagem em PNG, JPG ou PDF. Máximo de 2MB</p>
                <input id="notaFiscal" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
                <label htmlFor="notaFiscal" className="cursor-pointer inline-block">
                  <div className="w-20 h-20 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
                    <span className="text-3xl text-gray-400">+</span>
                  </div>
                </label>
              </div>

              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-semibold rounded-full">
                Próximo
              </Button>
            </form>
          </div>

          {/* Image */}
          <div className="hidden md:block relative rounded-lg overflow-hidden h-[700px]">
            <img src={truckVehicleData} alt="Caminhão Amarelo" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-yellow/90 to-transparent p-8">
              
              <img src={logoYellow} alt="CHEKAUTO" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>;
}