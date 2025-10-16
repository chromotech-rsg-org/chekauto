import React from 'react';
import { ConsultationForm } from './ConsultationForm';

export const Hero: React.FC = () => {
  return (
    <section className="flex flex-col relative min-h-[919px] w-full pb-[11px] max-md:max-w-full">
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/ebe8a33f0a14641d5d46b39f6d30229c5672a86a?placeholderIfAbsent=true"
        alt="Hero background"
        className="absolute h-full w-full object-cover inset-0"
      />
      <div className="relative bg-black flex w-full flex-col items-center pt-[73px] pb-[266px] px-20 max-md:max-w-full max-md:pb-[100px] max-md:px-5">
        <div className="flex mb-[-53px] w-full max-w-[1273px] flex-col items-center max-md:max-w-full max-md:mb-2.5">
          <nav className="self-stretch flex w-full items-stretch gap-5 text-[15px] text-white font-semibold flex-wrap justify-between max-md:max-w-full">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/e90f2af5ed8ffed81c5016c6bc32b68d8cb5188f?placeholderIfAbsent=true"
              alt="CHEKAUTO Logo"
              className="aspect-[5.75] object-contain w-[161px] shrink-0 max-w-full"
            />
            <div className="flex items-stretch gap-[40px_100px] flex-wrap max-md:max-w-full">
              <a href="#about" className="hover:text-[rgba(240,186,29,1)] transition-colors">A CHEKAUTO</a>
              <a href="#consultation" className="hover:text-[rgba(240,186,29,1)] transition-colors">CONSULTA</a>
              <a href="#implementations" className="hover:text-[rgba(240,186,29,1)] transition-colors">IMPLEMENTOS</a>
              <a href="#benefits" className="hover:text-[rgba(240,186,29,1)] transition-colors">DIFERENCIAIS</a>
            </div>
          </nav>
          <h1 className="text-white text-4xl font-medium leading-10 text-center mt-[214px] max-md:max-w-full max-md:mt-10">
            <span className="font-semibold text-[rgba(240,186,29,1)]">
              Resolva seu RENAVE/BIN com tranquilidade.{" "}
            </span>
            <br />
            Consultoria especializada em Implementos.
          </h1>
          <p className="text-white text-xl font-normal leading-[25px] text-center mt-4 max-md:max-w-full">
            Nós vamos assegurar que seu{" "}
            <span className="font-semibold">caminhão</span> esteja totalmente{" "}
            <br />
            <span className="underline">
              regular, validado e pronto para seguir em frente.
            </span>
          </p>
          <div className="mt-[88px] max-md:mt-10">
            <ConsultationForm variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
};
