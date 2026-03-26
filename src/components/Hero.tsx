import React, { useState } from 'react';
import { ConsultationModal } from './ConsultationModal';
import { useNavigate } from 'react-router-dom';
import heroBackground from '@/assets/truck-blue-sunset.png';
import logoYellow from '@/assets/logo-chekauto-yellow.png';
import { useVehicleConsultation } from '@/hooks/useVehicleConsultation';
import { toast } from '@/hooks/use-toast';
import { ErrorDialog } from '@/components/ui/error-dialog';

export const Hero: React.FC = () => {
  const [vehicleType, setVehicleType] = useState<'novo' | 'usado'>('usado');
  const [originState, setOriginState] = useState<'SP' | 'outros'>('SP');
  const [chassisNumber, setChassisNumber] = useState('');
  const [consultType, setConsultType] = useState<'chassi' | 'placa-renavam'>('chassi');
  const [placaInput, setPlacaInput] = useState('');
  const [renavamInput, setRenavamInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const navigate = useNavigate();
  const { consultar, loading, error, showErrorDialog, closeErrorDialog } = useVehicleConsultation();
  
  // 0KM sempre usa BIN e outros estados (bloqueado)
  const is0KM = vehicleType === 'novo';
  const effectiveState = is0KM ? 'outros' : originState;
  
  // Determinar título do erro baseado na mensagem
  const getErrorTitle = () => {
    if (!error) return 'Erro na Consulta';
    if (error.includes('reveja os dados fornecidos')) return 'Dados Não Encontrados';
    if (error.includes('Consulta já realizada')) return 'Consulta Já Realizada';
    if (error.includes('Chassi inválido') || error.includes('dígito verificador')) return 'Chassi Inválido';
    if (error.includes('não foi encontrado')) return 'Veículo Não Encontrado';
    if (error.includes('API errada') || error.includes('outro estado')) return 'Estado Incorreto';
    if (error.includes('Erro inesperado')) return 'Erro na API';
    if (error.includes('autenticação')) return 'Erro de Autenticação';
    return 'Atenção';
  };
  
  const handleConsult = async () => {
    let tipo: 'chassi' | 'placa' | 'renavam';
    let valorLimpo: string;

    if (is0KM || consultType === 'chassi') {
      if (!chassisNumber || chassisNumber.trim().length < 3) {
        toast({ title: 'Erro', description: 'Por favor, informe um chassi válido', variant: 'destructive' });
        return;
      }
      valorLimpo = chassisNumber.trim().toUpperCase();
      tipo = 'chassi';
    } else {
      // placa-renavam mode
      if (!placaInput.trim() && !renavamInput.trim()) {
        toast({ title: 'Erro', description: 'Informe a placa ou o renavam do veículo', variant: 'destructive' });
        return;
      }
      if (placaInput.trim()) {
        valorLimpo = placaInput.trim().toUpperCase();
        tipo = 'placa';
      } else {
        valorLimpo = renavamInput.trim().toUpperCase();
        tipo = 'renavam';
      }
    }

    let endpoint: 'base-sp' | 'bin' = 'bin';
    let uf = '';
    
    if (is0KM) {
      endpoint = 'bin';
      uf = '';
    } else if (effectiveState === 'SP') {
      endpoint = 'base-sp';
      uf = 'SP';
    } else {
      endpoint = 'bin';
      uf = '';
    }

    const resultado = await consultar(tipo, valorLimpo, endpoint, uf);
    
    if (resultado) {
      setVehicleData(resultado);
      setModalOpen(true);
    }
  };

  return <>
      <ErrorDialog
        open={showErrorDialog}
        onClose={closeErrorDialog}
        title={getErrorTitle()}
        message={error || 'Ocorreu um erro ao consultar o veículo.'}
      />
      
      <section className="flex flex-col relative min-h-[600px] w-full pb-[11px] max-md:max-w-full">
      <img src={heroBackground} alt="Hero background" className="absolute h-full w-full object-cover inset-0" />
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative flex w-full flex-col items-center pt-[73px] pb-[120px] px-20 max-md:max-w-full max-md:pb-[100px] max-md:px-5">
        <div className="flex mb-[-53px] w-full max-w-[1273px] flex-col items-center max-md:max-w-full max-md:mb-2.5">
          <nav className="self-stretch flex w-full items-center gap-5 text-[15px] text-white font-semibold flex-wrap justify-between max-md:max-w-full">
            <img src={logoYellow} alt="CHEKAUTO Logo" className="h-[50px] object-contain" />
            <div className="flex items-center gap-[40px_100px] flex-wrap max-md:max-w-full">
              <a href="#about" className="hover:text-brand-yellow transition-colors">A CHEKAUTO</a>
              <a href="#consultation" className="hover:text-brand-yellow transition-colors">CONSULTA</a>
              <a href="#implementations" className="hover:text-brand-yellow transition-colors">IMPLEMENTOS</a>
              <a href="#benefits" className="hover:text-brand-yellow transition-colors">DIFERENCIAIS</a>
              <a href="/login" className="hover:text-brand-yellow transition-colors">ADMIN</a>
            </div>
          </nav>
          
          <h1 className="text-brand-yellow text-3xl font-semibold leading-tight text-center mt-[100px] max-md:max-w-full max-md:mt-10">
            Resolva seu RENAVE/BIN com tranquilidade.
          </h1>
          <p className="text-white text-2xl font-normal leading-tight text-center max-md:max-w-full">
            Solução para implementos em caminhões, caminhonetes e veículos transformados.
          </p>
          
          <p className="text-white text-xl font-normal leading-[25px] text-center mt-2 max-md:max-w-full">
            Nós vamos assegurar que seu{" "}
            <span className="font-semibold">veículo</span> esteja totalmente{" "}
            <span className="underline text-brand-yellow">
              regular, validado e pronto para seguir em frente.
            </span>
          </p>
          
          <div className="mt-6 w-full max-w-[700px]">
            <div className="flex flex-wrap items-center gap-4 mb-4 justify-center">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input 
                  type="radio" 
                  name="vehicleType"
                  checked={vehicleType === 'novo'} 
                  onChange={() => { setVehicleType('novo'); setConsultType('chassi'); }} 
                  className="w-4 h-4 accent-brand-yellow" 
                />
                <span className="text-sm font-medium">Automóvel novo (0KM)</span>
              </label>
              
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input 
                  type="radio" 
                  name="vehicleType"
                  checked={vehicleType === 'usado'} 
                  onChange={() => setVehicleType('usado')} 
                  className="w-4 h-4 accent-brand-yellow" 
                />
                <span className="text-sm font-medium">Automóvel usado</span>
              </label>
              
              <select 
                value={effectiveState} 
                onChange={(e) => setOriginState(e.target.value as 'SP' | 'outros')} 
                disabled={is0KM}
                className={`bg-white text-black px-4 py-2 rounded text-sm min-w-[150px] h-[42px] font-medium ${is0KM ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <option value="SP">SP</option>
                <option value="outros">Outros Estados</option>
              </select>
            </div>
            
            {/* Toggle chassi / placa+renavam - só para usado */}
            {!is0KM && (
              <div className="flex items-center gap-4 mb-4 justify-center">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input 
                    type="radio" 
                    name="consultType"
                    checked={consultType === 'chassi'} 
                    onChange={() => setConsultType('chassi')} 
                    className="w-4 h-4 accent-brand-yellow" 
                  />
                  <span className="text-sm font-medium">Consultar por Chassi</span>
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input 
                    type="radio" 
                    name="consultType"
                    checked={consultType === 'placa-renavam'} 
                    onChange={() => setConsultType('placa-renavam')} 
                    className="w-4 h-4 accent-brand-yellow" 
                  />
                  <span className="text-sm font-medium">Consultar por Placa e Renavam</span>
                </label>
              </div>
            )}
            
            <div className="flex gap-3 items-center">
              {(is0KM || consultType === 'chassi') ? (
                <input 
                  type="text" 
                  placeholder="Digite o chassi do veículo" 
                  value={chassisNumber} 
                  onChange={e => setChassisNumber(e.target.value)} 
                  className="flex-1 px-6 py-3 rounded-full text-black placeholder:text-gray-500" 
                />
              ) : (
                <>
                  <input 
                    type="text" 
                    placeholder="Placa" 
                    value={placaInput} 
                    onChange={e => setPlacaInput(e.target.value)} 
                    className="flex-1 px-6 py-3 rounded-full text-black placeholder:text-gray-500" 
                  />
                  <input 
                    type="text" 
                    placeholder="Renavam" 
                    value={renavamInput} 
                    onChange={e => setRenavamInput(e.target.value)} 
                    className="flex-1 px-6 py-3 rounded-full text-black placeholder:text-gray-500" 
                  />
                </>
              )}
              <button 
                onClick={handleConsult} 
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-10 py-3 rounded-full transition-colors whitespace-nowrap uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'CONSULTANDO...' : 'CONSULTAR'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ConsultationModal open={modalOpen} onOpenChange={setModalOpen} vehicleData={vehicleData} />
    </section>
  </>;
};