import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import logoBlack from '@/assets/logo-chekauto-black.png';

export default function Confirmation() {
  const navigate = useNavigate();

  const steps = [
    { label: 'Dados do Veículo', completed: true, active: false },
    { label: 'Dados do Cliente', completed: true, active: false },
    { label: 'Pagamento', completed: true, active: false },
    { label: 'Finalizado', completed: true, active: true }
  ];

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
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-chekauto-yellow rounded-2xl p-12 shadow-lg">
          <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-16 h-16 text-black" strokeWidth={2.5} />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4 uppercase tracking-wide">
            PAGAMENTO APROVADO
          </h1>
          
          <p className="text-xl text-white mb-8">
            Todas as informações serão enviadas por email.
          </p>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-8 text-white">
            <p className="text-sm mb-2">Número do pedido</p>
            <p className="text-2xl font-bold">#SOL-2024-{Math.floor(Math.random() * 10000)}</p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/')}
              className="w-full max-w-md bg-white text-black hover:bg-white/90 h-12 text-base font-semibold rounded-full"
            >
              Voltar ao Início
            </Button>
            
            <p className="text-sm text-white/90">
              Você receberá um email de confirmação em breve com todos os detalhes da sua solicitação.
            </p>
          </div>
        </div>

        <div className="mt-12 text-gray-600">
          <p className="mb-2">Precisa de ajuda?</p>
          <p className="font-semibold text-black">Entre em contato: (11) 9999-9999</p>
        </div>
      </div>
    </div>
  );
}
