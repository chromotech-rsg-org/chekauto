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
        <ChevronDown className="text-gray-400 w-10 h-10" />
      </div>
      
      <section className="bg-black flex w-full flex-col items-center justify-center px-20 py-[80px] max-md:max-w-full max-md:px-5 max-md:py-[60px]">
        <div className="flex mb-[-59px] w-[900px] max-w-full flex-col items-stretch max-md:mb-2.5">
          <h2 className="text-brand-yellow text-[15px] font-semibold leading-10 tracking-[9px] text-center self-center">
            SCANER CHEKAUTO
          </h2>
          <h3 className="text-white text-[32px] font-semibold leading-tight text-center mt-[13px] max-md:max-w-full">
            Descubra as opções compatíveis com o seu veículo 
          </h3>
          
          <div className="mt-[43px] max-md:mt-10">
            <div className="flex flex-wrap items-center gap-4 mb-4 justify-center">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNewVehicle}
                  onChange={(e) => setIsNewVehicle(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Automóvel novo</span>
              </label>
              
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUsedVehicle}
                  onChange={(e) => setIsUsedVehicle(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Automóvel usado</span>
              </label>
              
              <select
                value={originState}
                onChange={(e) => setOriginState(e.target.value)}
                className="bg-white text-black px-4 py-2 rounded text-sm min-w-[150px]"
              >
                <option value="">Estado de Origem</option>
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="RS">Rio Grande do Sul</option>
              </select>
            </div>
            
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Digite o Número do seu Chassi"
                value={chassisNumber}
                onChange={(e) => setChassisNumber(e.target.value)}
                className="flex-1 px-4 py-3 rounded text-black"
              />
              <button className="bg-brand-yellow text-black font-semibold px-8 py-3 rounded hover:bg-brand-yellow-dark transition-colors whitespace-nowrap">
                CONSULTAR
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
