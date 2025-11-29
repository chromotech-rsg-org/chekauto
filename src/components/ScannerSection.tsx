import React, { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useVehicleConsultation } from '@/hooks/useVehicleConsultation';
import { VehicleDataDisplay } from './VehicleDataDisplay';
import { ErrorDialog } from '@/components/ui/error-dialog';

export const ScannerSection: React.FC = () => {
  const [vehicleType, setVehicleType] = useState<'novo' | 'usado' | ''>('');
  const [originState, setOriginState] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { consultar, loading, resultado, error, showErrorDialog, closeErrorDialog } = useVehicleConsultation();
  const handleConsultar = async () => {
    if (!chassisNumber || chassisNumber.trim().length < 3) {
      return;
    }

    const valorLimpo = chassisNumber.trim().toUpperCase();
    let tipo: 'chassi' | 'placa' | 'renavam' = 'chassi';
    
    // Detectar tipo baseado no formato
    if (valorLimpo.length === 17) {
      tipo = 'chassi';
    } else if (valorLimpo.length >= 9 && valorLimpo.length <= 11 && /^\d+$/.test(valorLimpo)) {
      tipo = 'renavam';
    } else if (valorLimpo.length === 7) {
      tipo = 'placa';
    }

    // Determinar endpoint: 0KM = BIN, Usado SP = base-sp, Usado outros = BIN
    let endpoint: 'base-sp' | 'bin' = 'bin';
    let uf = originState === 'SP' ? 'SP' : '';
    
    if (vehicleType === 'usado' && originState === 'SP') {
      endpoint = 'base-sp';
    } else {
      endpoint = 'bin';
    }

    const result = await consultar(tipo, valorLimpo, endpoint, uf);
    if (result) {
      setShowResults(true);
    }
  };

  return <>
      <ErrorDialog
        open={showErrorDialog}
        onClose={closeErrorDialog}
        title="Erro na Consulta"
        message={error || ''}
      />
      
      <div className="bg-white w-full flex justify-center py-8">
        <ChevronDown className="text-gray-300 w-12 h-12 animate-bounce" />
      </div>
      
      <section className="bg-black flex w-full flex-col items-center justify-center px-20 py-[80px] max-md:max-w-full max-md:px-5 max-md:py-[60px]">
        <div className="w-[900px] max-w-full flex flex-col items-stretch">
          <h2 className="text-brand-yellow text-[13px] font-semibold leading-10 tracking-[8px] text-center uppercase text-amber-400">
            SCANER CHEKAUTO
          </h2>
          <h3 className="text-white text-[28px] font-normal leading-tight text-center mt-2 max-md:max-w-full">
            Descubra as opções compatíveis com o seu veículo 
          </h3>
          
          <div className="mt-8 max-md:mt-10">
            <div className="flex flex-wrap items-center gap-3 mb-4 justify-center">
              <label className="flex items-center gap-2 text-white cursor-pointer text-sm">
                <input 
                  type="radio" 
                  name="vehicleType"
                  checked={vehicleType === 'novo'} 
                  onChange={() => setVehicleType('novo')} 
                  className="w-4 h-4 accent-white" 
                />
                <span>Automóvel novo (0KM)</span>
              </label>
              
              <label className="flex items-center gap-2 text-white cursor-pointer text-sm">
                <input 
                  type="radio" 
                  name="vehicleType"
                  checked={vehicleType === 'usado'} 
                  onChange={() => setVehicleType('usado')} 
                  className="w-4 h-4 accent-white" 
                />
                <span>Automóvel usado</span>
              </label>
              
              <select 
                value={originState} 
                onChange={e => setOriginState(e.target.value)} 
                className="bg-neutral-800 text-white border border-neutral-700 px-4 py-2 rounded text-sm min-w-[160px] h-[40px]"
              >
                <option value="">Estado de origem</option>
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="RS">Rio Grande do Sul</option>
              </select>
            </div>
            
            <div className="flex gap-3 items-center max-md:flex-col">
              <input 
                type="text" 
                placeholder="Digite chassi, placa ou renavam" 
                value={chassisNumber} 
                onChange={e => setChassisNumber(e.target.value.toUpperCase())} 
                onKeyPress={(e) => e.key === 'Enter' && handleConsultar()}
                className="flex-1 px-6 py-3 rounded-full text-black placeholder:text-gray-500 h-[48px] uppercase" 
              />
              <button 
                onClick={handleConsultar}
                disabled={loading}
                className="bg-brand-yellow text-black font-bold uppercase px-10 py-3 rounded-full hover:bg-brand-yellow-dark transition-colors whitespace-nowrap h-[48px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  'CONSULTAR'
                )}
              </button>
            </div>

            {/* Resultados da consulta */}
            {showResults && resultado && (
              <div className="mt-8 bg-white rounded-lg p-6">
                <VehicleDataDisplay 
                  dados={resultado.data}
                  fromCache={resultado.fromCache}
                  ultimaAtualizacao={resultado.ultimaAtualizacao}
                  showFullDetails={true}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>;
};