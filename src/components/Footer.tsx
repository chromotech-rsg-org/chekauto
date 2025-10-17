import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 flex w-full flex-col items-center justify-center px-[70px] pt-[129px] max-md:max-w-full max-md:px-5 max-md:pt-[100px]">
      <div className="mb-[-26px] w-full max-w-[1222px] max-md:max-w-full max-md:mb-2.5">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          <div className="w-[44%] max-md:w-full max-md:ml-0">
            <div className="grow text-[15px] text-white font-normal leading-[25px] max-md:max-w-full max-md:mt-10">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/e90f2af5ed8ffed81c5016c6bc32b68d8cb5188f?placeholderIfAbsent=true"
                alt="CHEKAUTO Logo"
                className="aspect-[5.75] object-contain w-[161px] max-w-full"
              />
              <p className="mt-[43px] max-md:max-w-full max-md:mt-10">
                A <span className="font-bold">CHEKAUTO</span> nasceu para simplificar processos burocráticos no setor automotivo pesado.{" "}
                <span className="font-bold">Especialistas em RENAVE, BIN e assessoria documental</span>, nossa missão é garantir que cada cliente tenha seus registros validados com segurança, agilidade e transparência. 
              </p>
            </div>
          </div>
          <div className="w-[56%] ml-5 max-md:w-full max-md:ml-0">
            <div className="self-stretch my-auto max-md:max-w-full max-md:mt-10">
              <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                <div className="w-[21%] max-md:w-full max-md:ml-0">
                  <nav className="text-[rgba(240,186,29,1)] text-[15px] font-normal max-md:mt-10">
                    <a href="#about" className="block hover:text-white transition-colors">A Chekout</a>
                    <br />
                    <br />
                    <a href="#consultation" className="block hover:text-white transition-colors">Consulta</a>
                    <br />
                    <br />
                    <a href="#implementations" className="block hover:text-white transition-colors">Implementos</a>
                    <br />
                    <br />
                    <a href="#benefits" className="block hover:text-white transition-colors">Diferenciais</a>
                  </nav>
                </div>
                <div className="w-[32%] ml-5 max-md:w-full max-md:ml-0">
                  <nav className="text-[rgba(240,186,29,1)] text-[15px] font-normal max-md:mt-10">
                    <a href="#careers" className="block hover:text-white transition-colors">Trabalhe Conosco</a>
                    <br />
                    <br />
                    <a href="#contact" className="block hover:text-white transition-colors">Fale Conosco</a>
                    <br />
                    <br />
                    <a href="#terms" className="block hover:text-white transition-colors">Termos de Uso</a>
                    <br />
                    <br />
                    <a href="#support" className="block hover:text-white transition-colors">Suporte e Ouvidoria</a>
                  </nav>
                </div>
                <div className="w-[46%] ml-5 max-md:w-full max-md:ml-0">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/e7ec5cfa548e9424fca8568b1e7ba3c4f412cbb2?placeholderIfAbsent=true"
                    alt="Footer logo"
                    className="aspect-[3.94] object-contain w-[193px] shrink-0 max-w-full max-md:mt-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[rgba(24,24,24,1)] flex w-screen flex-col text-[15px] text-white font-normal justify-center px-5 py-[22px] mt-[129px] -mx-[70px] max-md:-mx-5 max-md:mt-10">
        <p className="max-w-[1222px] mx-auto w-full">
          Todos os Direitos de Desenvolvimento por{" "}
          <span className="font-medium">RSG GROUP</span>
        </p>
      </div>
    </footer>
  );
};
