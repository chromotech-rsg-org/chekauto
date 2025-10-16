import React from 'react';
import truckYellowClose from '@/assets/truck-yellow-hero.png';
import logoYellow from '@/assets/logo-chekauto-yellow.png';

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
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent"></div>
      
      <div className="relative z-10 max-w-[600px]">
        <h2 className="text-brand-yellow text-4xl font-bold leading-tight">
          Resolva seu RENAVE/BIN <br />
          de forma automática
        </h2>
        <p className="text-white text-lg font-normal leading-relaxed mt-6">
          Nós vamos assegurar que seu{" "}
          <span className="font-semibold">caminhão</span> esteja <br />
          totalmente{" "}
          <span className="font-semibold">
            regular, validado e pronto para seguir em frente.
          </span>
        </p>
        
        <button className="bg-brand-yellow text-black font-bold uppercase px-12 py-3 rounded-full hover:bg-brand-yellow-dark transition-colors mt-8">
          Consultar
        </button>
      </div>
      
      <div className="absolute bottom-8 right-8 z-10">
        <img src={logoYellow} alt="ChekAuto" className="h-[100px] object-contain" />
      </div>
    </section>
  );
};
