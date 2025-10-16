import React from 'react';
import { ConsultationForm } from './ConsultationForm';

export const ScannerSection: React.FC = () => {
  return (
    <section className="bg-black flex w-full flex-col items-center justify-center px-20 py-[243px] max-md:max-w-full max-md:px-5 max-md:py-[100px]">
      <div className="flex mb-[-59px] w-[693px] max-w-full flex-col items-stretch max-md:mb-2.5">
        <h2 className="text-[rgba(240,186,29,1)] text-[15px] font-semibold leading-10 tracking-[9px] text-center self-center">
          SCANER CHEKAUTO
        </h2>
        <h3 className="text-white text-[32px] font-semibold leading-none text-center mt-[13px] max-md:max-w-full">
          Descubra as opções compatíveis com o seu veículo 
        </h3>
        <div className="mt-[43px] max-md:mt-10">
          <ConsultationForm variant="scanner" />
        </div>
      </div>
    </section>
  );
};
