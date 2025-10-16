import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import logoYellow from '@/assets/logo-chekauto-yellow.png';

export default function Confirmation() {
  const navigate = useNavigate();

  const steps = [
    { label: 'Dados do Veículo', completed: true, active: false },
    { label: 'Dados do Cliente', completed: true, active: false },
    { label: 'Pagamento', completed: true, active: false },
    { label: 'Finalizado', completed: true, active: true }
  ];

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
      <div className="flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-3xl">
          <div className="bg-brand-yellow rounded-2xl p-16 text-center">
            <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-16 h-16 text-black" strokeWidth={2.5} />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 uppercase tracking-wide">
              PAGAMENTO APROVADO
            </h1>
            
            <p className="text-xl text-white">
              Todas as informações serão enviadas por email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
