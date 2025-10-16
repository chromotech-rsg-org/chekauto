import React, { useState } from 'react';
import { ConsultationModal } from './ConsultationModal';
import { useNavigate } from 'react-router-dom';
import heroBackground from '@/assets/truck-blue-sunset.png';
import logoYellow from '@/assets/logo-chekauto-yellow.png';

export const Hero: React.FC = () => {
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  const [isUsedVehicle, setIsUsedVehicle] = useState(false);
  const [originState, setOriginState] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleConsult = () => {
    setModalOpen(true);
  };

  return (
    <section className="flex flex-col relative min-h-[600px] w-full pb-[11px] max-md:max-w-full">
      <img
        src={heroBackground}
        alt="Hero background"
        className="absolute h-full w-full object-cover inset-0"
      />
      <div className="relative bg-black/80 flex w-full flex-col items-center pt-[73px] pb-[120px] px-20 max-md:max-w-full max-md:pb-[100px] max-md:px-5">
        <div className="flex mb-[-53px] w-full max-w-[1273px] flex-col items-center max-md:max-w-full max-md:mb-2.5">
          <nav className="self-stretch flex w-full items-center gap-5 text-[15px] text-white font-semibold flex-wrap justify-between max-md:max-w-full">
            <img
              src={logoYellow}
              alt="CHEKAUTO Logo"
              className="h-[50px] object-contain"
            />
            <div className="flex items-center gap-[40px_100px] flex-wrap max-md:max-w-full">
              <a href="#about" className="hover:text-brand-yellow transition-colors">A CHEKAUTO</a>
              <a href="#consultation" className="hover:text-brand-yellow transition-colors">CONSULTA</a>
              <a href="#implementations" className="hover:text-brand-yellow transition-colors">IMPLEMENTOS</a>
              <a href="#benefits" className="hover:text-brand-yellow transition-colors">DIFERENCIAIS</a>
              <a href="/login" className="hover:text-brand-yellow transition-colors">ADMIN</a>
            </div>
          </nav>
          
          <h1 className="text-brand-yellow text-4xl font-semibold leading-tight text-center mt-[100px] max-md:max-w-full max-md:mt-10">
            Resolva seu RENAVE/BIN com tranquilidade.
          </h1>
          <p className="text-white text-4xl font-normal leading-tight text-center max-md:max-w-full">
            Consultoria especializada em Implementos.
          </p>
          
          <p className="text-white text-xl font-normal leading-[25px] text-center mt-4 max-md:max-w-full">
            Nós vamos assegurar que seu{" "}
            <span className="font-semibold">caminhão</span> esteja totalmente{" "}
            <span className="underline">
              regular, validado e pronto para seguir em frente.
            </span>
          </p>
          
          <div className="mt-12 w-full max-w-[700px]">
            <div className="flex flex-wrap items-center gap-3 mb-4 justify-center">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNewVehicle}
                  onChange={(e) => setIsNewVehicle(e.target.checked)}
                  className="w-4 h-4 accent-brand-yellow"
                />
                <span className="text-sm">Automóvel novo</span>
              </label>
              
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUsedVehicle}
                  onChange={(e) => setIsUsedVehicle(e.target.checked)}
                  className="w-4 h-4 accent-brand-yellow"
                />
                <span className="text-sm">Automóvel usado</span>
              </label>
              
              <select
                value={originState}
                onChange={(e) => setOriginState(e.target.value)}
                className="bg-white text-black px-4 py-2 rounded text-sm min-w-[150px] h-[42px]"
              >
                <option value="">Estado de Origem</option>
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="RS">Rio Grande do Sul</option>
              </select>
            </div>
            
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Digite o número do seu Chassi"
                value={chassisNumber}
                onChange={(e) => setChassisNumber(e.target.value)}
                className="flex-1 px-6 py-3 rounded-full text-black placeholder:text-gray-500"
              />
              <button
                onClick={handleConsult}
                className="bg-brand-yellow text-black font-bold px-10 py-3 rounded-full hover:bg-brand-yellow-dark transition-colors whitespace-nowrap uppercase"
              >
                Consultar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ConsultationModal open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
};
