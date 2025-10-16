import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="relative bg-black flex w-full flex-col items-center pt-[73px] pb-[266px] px-20 max-md:max-w-full max-md:pb-[100px] max-md:px-5">
      <nav className="flex mb-[-53px] w-full max-w-[1273px] flex-col items-center max-md:max-w-full max-md:mb-2.5">
        <div className="self-stretch flex w-full items-stretch gap-5 text-[15px] text-white font-semibold flex-wrap justify-between max-md:max-w-full">
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
        </div>
      </nav>
    </header>
  );
};
