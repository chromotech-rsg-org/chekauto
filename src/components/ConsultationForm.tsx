import React, { useState } from 'react';

interface ConsultationFormProps {
  variant?: 'hero' | 'scanner';
  className?: string;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ 
  variant = 'hero',
  className = '' 
}) => {
  const [isNewVehicle, setIsNewVehicle] = useState(true);
  const [isUsedVehicle, setIsUsedVehicle] = useState(false);
  const [chassisNumber, setChassisNumber] = useState('');
  const [originState, setOriginState] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { isNewVehicle, isUsedVehicle, chassisNumber, originState });
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex w-full max-w-[509px] items-stretch gap-8 text-sm text-neutral-100 font-medium leading-[25px] flex-wrap mb-3.5">
        <div className="flex items-stretch gap-[17px] grow shrink basis-auto">
          <label className="flex items-center gap-[17px] cursor-pointer">
            <div 
              className={`rounded border-neutral-100 border flex w-[22px] shrink-0 h-[22px] border-solid relative ${
                isNewVehicle ? 'bg-white' : ''
              }`}
              onClick={() => setIsNewVehicle(!isNewVehicle)}
            >
              {isNewVehicle && (
                <div className="absolute inset-1 bg-black rounded-sm"></div>
              )}
            </div>
            <span>Automóvel novo</span>
          </label>
          <label className="flex items-center gap-[17px] cursor-pointer">
            <div 
              className={`rounded border-neutral-100 border flex w-[22px] shrink-0 h-[22px] border-solid relative ${
                isUsedVehicle ? 'bg-white' : ''
              }`}
              onClick={() => setIsUsedVehicle(!isUsedVehicle)}
            >
              {isUsedVehicle && (
                <div className="absolute inset-1 bg-black rounded-sm"></div>
              )}
            </div>
            <span className="basis-auto">Automóvel usado</span>
          </label>
        </div>
        <div className="flex items-stretch gap-2.5">
          <select 
            value={originState}
            onChange={(e) => setOriginState(e.target.value)}
            className="rounded bg-[rgba(238,238,238,1)] flex w-[58px] shrink-0 h-[22px] text-black text-xs px-1"
          >
            <option value="">UF</option>
            <option value="SP">SP</option>
            <option value="RJ">RJ</option>
            <option value="MG">MG</option>
          </select>
          <span className="basis-auto">Estado de Origem</span>
        </div>
      </div>
      <div className="flex w-full max-w-[686px] items-stretch gap-[17px] flex-wrap">
        <input
          type="text"
          value={chassisNumber}
          onChange={(e) => setChassisNumber(e.target.value)}
          placeholder="Digite o número do seu Chassi"
          className="bg-[rgba(238,238,238,1)] flex flex-col text-sm text-[rgba(166,166,166,1)] font-medium leading-[25px] grow shrink-0 basis-0 w-fit pt-[18px] pb-2.5 px-[37px] rounded-[15px] border-none outline-none"
        />
        <button
          type="submit"
          className="bg-[rgba(240,186,29,1)] flex flex-col items-stretch text-base text-black font-semibold whitespace-nowrap text-center leading-loose justify-center px-[41px] py-[21px] rounded-[39px] hover:bg-[rgba(220,166,9,1)] transition-colors"
        >
          CONSULTAR
        </button>
      </div>
    </form>
  );
};
