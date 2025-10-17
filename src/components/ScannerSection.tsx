import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const ScannerSection: React.FC = () => {
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  const [isUsedVehicle, setIsUsedVehicle] = useState(false);
  const [originState, setOriginState] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');

  return (
    <>
      <div className="bg-white w-full flex justify-center py-8">
        <ChevronDown className="text-gray-300 w-12 h-12 animate-bounce" />
      </div>
      
      <section className="bg-black flex w-full flex-col items-center justify-center px-20 py-[80px] max-md:max-w-full max-md:px-5 max-md:py-[60px]">
        <div className="w-[900px] max-w-full flex flex-col items-stretch">
          <h2 className="text-brand-yellow text-[13px] font-semibold leading-10 tracking-[8px] text-center uppercase">
            SCANER CHEKAUTO
          </h2>
          <h3 className="text-white text-[28px] font-normal leading-tight text-center mt-2 max-md:max-w-full">
            Descubra as opções compatíveis com o seu veículo 
          </h3>
          
          <div className="mt-8 max-md:mt-10">
            <div className="flex flex-wrap items-center gap-3 mb-4 justify-center">
              <label className="flex items-center gap-2 text-white cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={isNewVehicle}
                  onChange={(e) => setIsNewVehicle(e.target.checked)}
                  className="w-4 h-4 accent-white"
                />
                <span>Automóvel novo</span>
              </label>
              
              <label className="flex items-center gap-2 text-white cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={isUsedVehicle}
                  onChange={(e) => setIsUsedVehicle(e.target.checked)}
                  className="w-4 h-4 accent-white"
                />
                <span>Automóvel usado</span>
              </label>
              
              <select
                value={originState}
                onChange={(e) => setOriginState(e.target.value)}
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
                placeholder="Digite o número do seu chassi"
                value={chassisNumber}
                onChange={(e) => setChassisNumber(e.target.value)}
                className="flex-1 px-6 py-3 rounded-full text-black placeholder:text-gray-500 h-[48px]"
              />
              <button className="bg-brand-yellow text-black font-bold uppercase px-10 py-3 rounded-full hover:bg-brand-yellow-dark transition-colors whitespace-nowrap h-[48px]">
                CONSULTAR
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
