import React from 'react';
import truckYellowClose from '@/assets/truck-yellow-hero.png';
import logoYellow from '@/assets/logo-chekauto-yellow-black.png';

export const CallToAction: React.FC = () => {
  return (
    <section 
      className="relative flex w-full flex-col items-start justify-center px-20 py-[158px] max-md:max-w-full max-md:px-5 max-md:py-[100px] overflow-hidden"
      style={{
        backgroundImage: `url(${truckYellowClose})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
      
      <div className="relative z-10 max-w-[600px]">
        <h2 className="text-brand-yellow text-4xl font-semibold leading-tight">
          Resolva seu RENAVE/BIN <br />
          de forma automática
        </h2>
        <p className="text-white text-xl font-normal leading-[25px] mt-8">
          Nós vamos assegurar que seu{" "}
          <span className="font-semibold">caminhão</span> esteja <br />
          totalmente{" "}
          <span className="underline">
            regular, validado e pronto para seguir em frente.
          </span>
        </p>
        
        <button className="bg-brand-yellow flex max-w-full flex-col items-center text-base text-black font-semibold whitespace-nowrap text-center leading-loose justify-center mt-[55px] px-[70px] py-[21px] rounded-[39px] hover:bg-brand-yellow-dark transition-colors max-md:mt-10 max-md:px-5">
          CONSULTAR
        </button>
      </div>
      
      <div className="absolute bottom-8 right-8 z-10">
        <img src={logoYellow} alt="ChekAuto" className="h-[80px] object-contain" />
      </div>
    </section>
  );
};
