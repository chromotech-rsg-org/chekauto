import React, { useState } from 'react';
import { ConsultationModal } from './ConsultationModal';
import { useNavigate } from 'react-router-dom';
import heroBackground from '@/assets/truck-blue-sunset.png';
import logoYellow from '@/assets/logo-chekauto-yellow.png';
import { useVehicleConsultation } from '@/hooks/useVehicleConsultation';
import { toast } from '@/hooks/use-toast';
export const Hero: React.FC = () => {
  const [vehicleType, setVehicleType] = useState<'novo' | 'usado'>('usado');
  const [originState, setOriginState] = useState<'SP' | 'outros'>('SP');
  const [chassisNumber, setChassisNumber] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const navigate = useNavigate();
  const { consultar, loading } = useVehicleConsultation();
  
  const handleConsult = async () => {
    if (!chassisNumber || chassisNumber.trim().length < 3) {
      toast({
        title: 'Erro',
        description: 'Por favor, informe um chassi, placa ou renavam válido',
        variant: 'destructive',
      });
      return;
    }

    // Detectar tipo de consulta
    const valorLimpo = chassisNumber.trim().toUpperCase();
    let tipo: 'chassi' | 'placa' | 'renavam' = 'chassi';
    
    if (valorLimpo.length === 17) {
      tipo = 'chassi';
    } else if (valorLimpo.length >= 9 && valorLimpo.length <= 11 && /^\d+$/.test(valorLimpo)) {
      tipo = 'renavam';
    } else if (valorLimpo.length === 7) {
      tipo = 'placa';
    }

    // Determinar endpoint baseado nas regras:
    // - 0KM (novo) → sempre BIN
    // - Usado de SP → base-sp
    // - Usado de outros estados → BIN
    let endpoint: 'base-sp' | 'bin' = 'bin';
    let uf = originState === 'SP' ? 'SP' : '';
    
    if (vehicleType === 'usado' && originState === 'SP') {
      endpoint = 'base-sp';
    } else {
      endpoint = 'bin';
    }

    const resultado = await consultar(tipo, valorLimpo, endpoint, uf);
    
    if (resultado) {
      setVehicleData(resultado);
      setModalOpen(true);
    }
  };
  return <section className="flex flex-col relative min-h-[600px] w-full pb-[11px] max-md:max-w-full">
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
            Consultoria especializada em Implementos.
          </p>
          
          <p className="text-white text-xl font-normal leading-[25px] text-center mt-2 max-md:max-w-full">
            Nós vamos assegurar que seu{" "}
            <span className="font-semibold">caminhão</span> esteja totalmente{" "}
            <span className="underline text-brand-yellow">
              regular, validado e pronto para seguir em frente.
            </span>
          </p>
          
          <div className="mt-6 w-full max-w-[700px]">
            <div className="flex flex-wrap items-center gap-4 mb-4 justify-center">
              {/* Radio buttons para novo/usado */}
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input 
                  type="radio" 
                  name="vehicleType"
                  checked={vehicleType === 'novo'} 
                  onChange={() => setVehicleType('novo')} 
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
              
              {/* Dropdown SP ou Outros */}
              <select 
                value={originState} 
                onChange={(e) => setOriginState(e.target.value as 'SP' | 'outros')} 
                className="bg-white text-black px-4 py-2 rounded text-sm min-w-[150px] h-[42px] font-medium"
              >
                <option value="SP">SP</option>
                <option value="outros">Outros Estados</option>
              </select>
            </div>
            
            <div className="flex gap-3 items-center">
              <input type="text" placeholder="Digite chassi, placa ou renavam" value={chassisNumber} onChange={e => setChassisNumber(e.target.value)} className="flex-1 px-6 py-3 rounded-full text-black placeholder:text-gray-500" />
              <button 
                onClick={handleConsult} 
                disabled={loading}
                className="bg-brand-yellow text-black font-bold px-10 py-3 rounded-full hover:bg-brand-yellow-dark transition-colors whitespace-nowrap uppercase bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'CONSULTANDO...' : 'CONSULTAR'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ConsultationModal open={modalOpen} onOpenChange={setModalOpen} vehicleData={vehicleData} />
    </section>;
};