import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '@/components/ui/stepper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { useCheckout } from '@/contexts/CheckoutContext';
import { useToast } from '@/hooks/use-toast';
import logoYellow from '@/assets/logo-chekauto-yellow.png';
import clientDataPerson from '@/assets/client-data-person.png';
import { buscarCep } from '@/lib/cep';
import { supabase } from '@/integrations/supabase/client';
import InputMask from 'react-input-mask';

export default function ClientData() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customer, setCustomerData } = useCheckout();
  const [searchingCpf, setSearchingCpf] = useState(false);
  
  const [formData, setFormData] = useState({
    nomeCompleto: customer.nomeCompleto || '',
    cpfCnpj: customer.cpfCnpj || '',
    cep: customer.cep || '',
    rua: customer.rua || '',
    numero: customer.numero || '',
    bairro: customer.bairro || '',
    complemento: customer.complemento || '',
    email: customer.email || '',
    telefone: customer.telefone || ''
  });
  const steps = [{
    label: 'Dados do Veículo',
    completed: true,
    active: false
  }, {
    label: 'Dados do Cliente',
    completed: false,
    active: true
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
    setCustomerData(formData);
    navigate('/solicitacao/pagamento');
  };
  const handleCepBlur = async () => {
    if (!formData.cep) return;
    
    const data = await buscarCep(formData.cep);
    if (data) {
      setFormData(prev => ({
        ...prev,
        rua: data.logradouro,
        bairro: data.bairro
      }));
    }
  };

  const handleBuscarCliente = async () => {
    if (!formData.cpfCnpj) {
      toast({
        title: "CPF/CNPJ obrigatório",
        description: "Digite o CPF/CNPJ para buscar o cliente",
        variant: "destructive",
      });
      return;
    }

    setSearchingCpf(true);
    try {
      const { data, error } = await supabase.functions.invoke('buscar-cliente', {
        body: { cpf: formData.cpfCnpj.replace(/\D/g, '') }
      });

      if (error) throw error;

      if (data.found && data.cliente) {
        setFormData({
          nomeCompleto: data.cliente.nomeCompleto || '',
          cpfCnpj: data.cliente.cpfCnpj || formData.cpfCnpj,
          cep: data.cliente.cep || '',
          rua: data.cliente.rua || '',
          numero: data.cliente.numero || '',
          bairro: data.cliente.bairro || '',
          complemento: data.cliente.complemento || '',
          email: data.cliente.email || '',
          telefone: data.cliente.telefone || ''
        });
        toast({
          title: "Cliente encontrado!",
          description: "Dados preenchidos automaticamente",
        });
      } else {
        toast({
          title: "Cliente não encontrado",
          description: "Preencha os dados manualmente",
        });
      }
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      toast({
        title: "Erro ao buscar cliente",
        description: "Continue preenchendo os dados manualmente",
        variant: "destructive",
      });
    } finally {
      setSearchingCpf(false);
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
            <h1 className="text-2xl font-bold text-black mb-1">Dados do Cliente</h1>
            <p className="text-gray-600 mb-6 text-sm">Preencha todas as informações corretamente</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">CPF/CNPJ</label>
                <div className="flex gap-2">
                  <InputMask
                    mask={formData.cpfCnpj.length <= 14 ? "999.999.999-99" : "99.999.999/9999-99"}
                    value={formData.cpfCnpj}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      cpfCnpj: e.target.value
                    }))}
                  >
                    {(inputProps: any) => (
                      <Input {...inputProps} placeholder="CPF/CNPJ:" className="bg-gray-100 border-0 flex-1" required />
                    )}
                  </InputMask>
                  <Button
                    type="button"
                    onClick={handleBuscarCliente}
                    disabled={searchingCpf || !formData.cpfCnpj}
                    variant="outline"
                    className="shrink-0"
                  >
                    {searchingCpf ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Input id="nomeCompleto" value={formData.nomeCompleto} onChange={e => setFormData(prev => ({
              ...prev,
              nomeCompleto: e.target.value
            }))} placeholder="Nome Completo:" className="bg-gray-100 border-0" required />

              <div className="grid grid-cols-2 gap-3">
                
                <InputMask
                  mask="99999-999"
                  value={formData.cep}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    cep: e.target.value
                  }))}
                  onBlur={handleCepBlur}
                >
                  {(inputProps: any) => (
                    <Input 
                      {...inputProps}
                      id="cep"
                      placeholder="CEP:" 
                      className="bg-gray-100 border-0" 
                      required 
                    />
                  )}
                </InputMask>
              </div>

              <Input id="rua" value={formData.rua} onChange={e => setFormData(prev => ({
              ...prev,
              rua: e.target.value
            }))} placeholder="Rua:" className="bg-gray-100 border-0" required />

              <div className="grid grid-cols-2 gap-3">
                <Input id="numero" value={formData.numero} onChange={e => setFormData(prev => ({
                ...prev,
                numero: e.target.value
              }))} placeholder="Número:" className="bg-gray-100 border-0" required />
                <Input id="bairro" value={formData.bairro} onChange={e => setFormData(prev => ({
                ...prev,
                bairro: e.target.value
              }))} placeholder="Bairro:" className="bg-gray-100 border-0" required />
              </div>

              <Input id="complemento" value={formData.complemento} onChange={e => setFormData(prev => ({
              ...prev,
              complemento: e.target.value
            }))} placeholder="Complemento:" className="bg-gray-100 border-0" />

              <div className="grid grid-cols-2 gap-3">
                <Input id="email" type="email" value={formData.email} onChange={e => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))} placeholder="E-mail:" className="bg-gray-100 border-0" required />
                <Input id="telefone" type="tel" value={formData.telefone} onChange={e => setFormData(prev => ({
                ...prev,
                telefone: e.target.value
              }))} placeholder="Telefone:" className="bg-gray-100 border-0" required />
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/solicitacao/veiculo')}
                  className="flex-1 h-12 text-base font-semibold rounded-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-800 h-12 text-base font-semibold rounded-full">
                  Próximo
                </Button>
              </div>
            </form>
          </div>

          {/* Image */}
          <div className="hidden md:block relative rounded-lg overflow-hidden h-[700px]">
            <img src={clientDataPerson} alt="Cliente satisfeito" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-yellow/90 to-transparent p-8">
              
              <img src={logoYellow} alt="CHEKAUTO" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>;
}