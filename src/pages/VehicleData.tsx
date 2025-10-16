import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '@/components/ui/stepper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import logoBlack from '@/assets/logo-chekauto-black.png';

export default function VehicleData() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    chassi: '',
    renavam: '',
    ano: '',
    placa: '',
    estado: '',
    cidade: '',
    informacaoAdicional: '',
    notaFiscal: null as File | null
  });

  const steps = [
    { label: 'Dados do Veículo', completed: false, active: true },
    { label: 'Dados do Cliente', completed: false, active: false },
    { label: 'Pagamento', completed: false, active: false },
    { label: 'Finalizado', completed: false, active: false }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Vehicle data:', formData);
    navigate('/solicitacao/cliente');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, notaFiscal: e.target.files![0] }));
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
            <h1 className="text-3xl font-bold text-black mb-2">Dados do Veículo</h1>
            <p className="text-gray-600 mb-8">Preencha as informações do seu veículo</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="chassi">Número do Chassi *</Label>
                <Input
                  id="chassi"
                  value={formData.chassi}
                  onChange={(e) => setFormData(prev => ({ ...prev, chassi: e.target.value }))}
                  placeholder="Digite o número do chassi"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="renavam">Renavam *</Label>
                <Input
                  id="renavam"
                  value={formData.renavam}
                  onChange={(e) => setFormData(prev => ({ ...prev, renavam: e.target.value }))}
                  placeholder="Digite o RENAVAM"
                  className="mt-1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ano">Ano do Veículo *</Label>
                  <Input
                    id="ano"
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData(prev => ({ ...prev, ano: e.target.value }))}
                    placeholder="2024"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="placa">Placa *</Label>
                  <Input
                    id="placa"
                    value={formData.placa}
                    onChange={(e) => setFormData(prev => ({ ...prev, placa: e.target.value }))}
                    placeholder="ABC-1D23"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estado">Estado *</Label>
                  <Select value={formData.estado} onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                    placeholder="Digite a cidade"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="informacaoAdicional">Informação Adicional</Label>
                <Textarea
                  id="informacaoAdicional"
                  value={formData.informacaoAdicional}
                  onChange={(e) => setFormData(prev => ({ ...prev, informacaoAdicional: e.target.value }))}
                  placeholder="Adicione informações relevantes sobre o veículo"
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="notaFiscal">Upload da Nota Fiscal</Label>
                <input
                  id="notaFiscal"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-chekauto-yellow file:text-black hover:file:bg-chekauto-yellow/90"
                />
                <p className="text-xs text-gray-500 mt-1">PNG, JPG ou PDF (máx. 2MB)</p>
              </div>

              <Button type="submit" className="w-full bg-black text-white hover:bg-black/90 h-12 text-base font-semibold rounded-full">
                Próximo
              </Button>
            </form>
          </div>

          {/* Image */}
          <div className="hidden md:block">
            <div className="bg-gray-100 rounded-lg h-[600px] flex items-center justify-center">
              <p className="text-gray-400">Imagem do caminhão amarelo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
